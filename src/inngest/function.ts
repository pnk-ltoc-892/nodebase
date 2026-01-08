import { inngest } from "./client";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { openai } from '@ai-sdk/openai';


export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {

    await step.sleep("pretend", "5s")

    // Just an inngest optimization way
    const { steps: geminiStep } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        model: google('gemini-2.5-flash'),
        system: "You are a helpful assistant",
        prompt: "Give a morning motivational thought",
        experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
      }
    )
    const { steps: openaiStep } = await step.ai.wrap(
      "openai-generate-text",
      generateText,
      {
        model: openai('gpt-4'),
        system: "You are a helpful assistant",
        prompt: "Give a morning motivational thought",
        experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
        
      }
    )
    return {
      geminiStep,
      openaiStep
    };
  },
);