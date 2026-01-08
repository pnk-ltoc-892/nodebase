import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

import { inngest } from '@/inngest/client';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';


export const appRouter = createTRPCRouter({
  testAI: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai"
    })

    return {success: true, message: "job Queued"}
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany()
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    // Async stuff to be executed
    // Fetch Something
    // await new Promise((r) => setTimeout(r, 5000))

    // Process Something
    // await new Promise((r) => setTimeout(r, 5000))

    // Lets Use Inngest - lets us execute function in while while user being free on client side
    // Not stuck while the work is being done
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "pnk@mail.com"
      }
    })
    return {success: true, messgae: "job Queued"}
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;