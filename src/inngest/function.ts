import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Fetching something
    await step.sleep("fetching", "4s");

    // Processing something
    await step.sleep("processing", "4s");

    // Making a entry
    await step.sleep("recording", "4s");

    await step.run("create-workflow", async () => {
      await prisma.workflow.create({
        data: {
          name: "Workflow From Inngest Function"
        }
      })
    })

    return { message: `Hello ${event.data.email}!` };
  },
);