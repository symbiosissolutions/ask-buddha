import AzureOpenAI from "openai";

export function azureOpenaiClient(apiKey: string, endpoint: string, apiVersion: string, deployment: string) {
  const openai = new AzureOpenAI({
    baseURL: endpoint,
    apiKey,
    apiVersion,
    deployment,
    dangerouslyAllowBrowser: true,
  });

  return {
    createThread: createThreadWith(openai),
    createMessageInThread: createMessageInThreadWith(openai),
    createRun: createRunWith(openai),
    listMessages: listMessagesWith(openai),
  };
}

function createThreadWith(client: AzureOpenAI) {
  return async function () {
    return await client.beta.threads.create();
  };
}

function createMessageInThreadWith(client: AzureOpenAI) {
  return async function (threadId: string, content: string) {
    return await client.beta.threads.messages.create(threadId, {
      role: "user",
      content,
    });
  };
}

function createRunWith(client: AzureOpenAI) {
  return async function (threadId: string, assistantId: string) {
    return await client.beta.threads.runs.createAndPoll(threadId, {
      assistant_id: assistantId,
    });
  };
}

function listMessagesWith(client: AzureOpenAI) {
  return async function (threadId: string) {
    return await client.beta.threads.messages.list(threadId);
  };
}
