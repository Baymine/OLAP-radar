/**
 * AigoCode provider — custom API wrapping.
 *
 * Env vars:
 *   AIGOCODE_API_KEY   - API key (falls back to OPENAI_API_KEY)
 *   AIGOCODE_BASE_URL  - endpoint override (default: https://api.aigocode.com/v1/responses)
 *   AIGOCODE_MODEL     - model name (default: gpt-5.4)
 */

import type { LlmProvider } from "./types.ts";

export class AigoCodeProvider implements LlmProvider {
  readonly name = "aigocode";
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(opts?: { apiKey?: string; baseURL?: string; model?: string }) {
    this.apiKey = opts?.apiKey ?? process.env["AIGOCODE_API_KEY"] ?? process.env["OPENAI_API_KEY"] ?? "";
    this.baseUrl =
      opts?.baseURL ?? process.env["AIGOCODE_BASE_URL"] ?? "https://api.aigocode.com/v1/responses";
    this.model = opts?.model ?? process.env["AIGOCODE_MODEL"] ?? "gpt-5.4";

    if (!this.apiKey) {
      throw new Error(`[aigocode] Missing API key. Set AIGOCODE_API_KEY or OPENAI_API_KEY.`);
    }
  }

  async call(prompt: string, maxTokens?: number): Promise<string> {
    const payload = {
      model: this.model,
      input: [
        {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: prompt,
            },
          ],
        },
      ],
      ...(maxTokens ? { max_output_tokens: maxTokens } : {}),
    };

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`[aigocode] API Error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const outputText = data?.output?.[0]?.content?.[0]?.text;

    if (typeof outputText !== "string") {
      throw new Error(`[aigocode] Unexpected response structure: ${JSON.stringify(data)}`);
    }

    return outputText;
  }
}
