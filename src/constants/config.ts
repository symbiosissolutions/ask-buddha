export const BEDROCK_AWS_REGION = import.meta.env.VITE_BEDROCK_AWS_REGION as string | undefined;
export const BEDROCK_MODEL_ID = import.meta.env.VITE_BEDROCK_MODEL_ID as string | undefined;
export const BEDROCK_MAX_TOKENS = Number( import.meta.env.VITE_BEDROCK_MAX_TOKENS ?? 1024,);
export const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID as string | undefined;
export const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY as string | undefined;
