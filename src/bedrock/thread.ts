export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type BedrockAuth = {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
};

export type BedrockClientOptions = {
  auth?: BedrockAuth;
  maxTokens?: number;
  system?: string;
};

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export function anthropicBedrockClient(
  region: string,
  modelId: string,
  options: BedrockClientOptions = {},
) {
  if (!region) {
    throw new Error("Missing AWS region for Bedrock client");
  }
  if (!modelId) {
    throw new Error("Missing Bedrock model ID");
  }

  const client = new BedrockRuntimeClient({
    region,
    credentials: options.auth
      ? {
          accessKeyId: options.auth.accessKeyId,
          secretAccessKey: options.auth.secretAccessKey,
          sessionToken: options.auth.sessionToken,
        }
      : undefined,
  });

  return {
    // Bedrock is stateless; "createThread" now just initializes your local array
    createThread: (): Message[] => [],
    
    // Instead of creating a message then 'running' it, we do it in one call
    sendMessage: sendMessageWith(client, modelId, {
      maxTokens: options.maxTokens,
      system: options.system,
    }),
  };
}

function sendMessageWith(
  client: BedrockRuntimeClient,
  modelId: string,
  options: Pick<BedrockClientOptions, "maxTokens" | "system">,
) {
  return async function (
    currentHistory: Message[],
    nextUserMessage: string,
  ): Promise<{ text: string; updatedHistory: Message[] }> {
    const messages: Message[] = [
      ...currentHistory,
      { role: "user", content: nextUserMessage },
    ];

    const maxTokens =
      typeof options.maxTokens === "number" && Number.isFinite(options.maxTokens)
        ? options.maxTokens
        : 1024;

    const command = new InvokeModelCommand({
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        messages,
        ...(options.system ? { system: options.system } : {}),
      }),
    });

    const response = await client.send(command);

    const jsonText = await decodeBody(response.body);
    const parsed = JSON.parse(jsonText) as unknown;

    const assistantText = extractClaudeText(parsed);

    return {
      text: assistantText,
      updatedHistory: [
        ...messages,
        { role: "assistant", content: assistantText },
      ],
    };
  };
}

async function decodeBody(body: unknown): Promise<string> {
  if (body instanceof Uint8Array) {
    return new TextDecoder().decode(body);
  }

  if (typeof body === "string") {
    return body;
  }

  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    const transformToString = record.transformToString;
    if (typeof transformToString === "function") {
      const result = transformToString as (encoding?: string) => Promise<string>;
      return await result("utf-8");
    }

    const text = record.text;
    if (typeof text === "function") {
      const result = text as () => Promise<string>;
      return await result();
    }
  }

  throw new Error("Unexpected Bedrock response body type");
}

function extractClaudeText(response: unknown): string {
  if (typeof response !== "object" || response === null) {
    throw new Error("Unexpected Bedrock response shape");
  }

  const record = response as Record<string, unknown>;
  const content = record.content;
  if (!Array.isArray(content)) {
    throw new Error("Unexpected Bedrock response content");
  }

  return content
    .map((block) => {
      if (typeof block !== "object" || block === null) return "";
      const b = block as Record<string, unknown>;
      if (b.type !== "text") return "";
      return typeof b.text === "string" ? b.text : "";
    })
    .join("");
}
