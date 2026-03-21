/**
 * Puter.js typed wrapper for client-side AI integration.
 * Puter provides free, browser-based LLM access.
 * Load puter.js via <Script src="https://js.puter.com/v2/" /> in the page.
 */

export interface PuterMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PuterAIResponse {
  message?: { content: string };
  text?: string;
}

export type PuterModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "o4-mini"
  | "claude-sonnet-4-5"
  | "gpt-oss-20b"
  | "gpt-oss-120b";

export const PUTER_MODELS: { id: PuterModel; label: string; description: string }[] = [
  { id: "gpt-4o-mini", label: "GPT-4o Mini", description: "Fast & free — recommended" },
  { id: "gpt-4o", label: "GPT-4o", description: "Best quality" },
  { id: "gpt-4.1", label: "GPT-4.1", description: "Latest GPT-4 series" },
  { id: "gpt-4.1-mini", label: "GPT-4.1 Mini", description: "Fast GPT-4.1" },
  { id: "gpt-4.1-nano", label: "GPT-4.1 Nano", description: "Lightweight" },
  { id: "o4-mini", label: "o4 Mini", description: "Reasoning model" },
  { id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5", description: "Anthropic" },
  { id: "gpt-oss-20b", label: "GPT OSS 20B", description: "Open source" },
];

declare global {
  interface Window {
    puter?: {
      ai: {
        chat: (
          messages: string | PuterMessage[],
          options?: { model?: string; stream?: boolean }
        ) => Promise<PuterAIResponse>;
      };
    };
  }
}

export function isPuterAvailable(): boolean {
  return typeof window !== "undefined" && !!window.puter?.ai;
}

export async function puterChat(
  prompt: string,
  model: PuterModel = "gpt-4o-mini"
): Promise<string> {
  if (!isPuterAvailable()) {
    throw new Error("Puter.js is not loaded. Make sure the script is included.");
  }
  const response = await window.puter!.ai.chat(prompt, { model });
  // Handle both response shapes
  if (response?.message?.content) return response.message.content;
  if (response?.text) return response.text;
  return String(response);
}
