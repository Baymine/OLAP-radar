import { describe, it, expect } from "vitest";
import { AigoCodeProvider } from "../providers/aigocode.ts";

describe("AigoCodeProvider", () => {
  it("initializes with env variables", () => {
    process.env["AIGOCODE_API_KEY"] = "test-key";
    process.env["AIGOCODE_MODEL"] = "gpt-5.4";
    const provider = new AigoCodeProvider();
    expect(provider.name).toBe("aigocode");
    // internals check not strictly needed, but verifies no exceptions thrown
  });

  it("throws if no api key", () => {
    delete process.env["AIGOCODE_API_KEY"];
    delete process.env["OPENAI_API_KEY"];
    expect(() => new AigoCodeProvider()).toThrow(/Missing API key/);
  });
});
