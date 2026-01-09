import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

import { inngest } from '@/inngest/client';
import { baseProcedure, createTRPCRouter, premiumProcedure, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { TRPCError } from '@trpc/server';


export const appRouter = createTRPCRouter({
  testAI: premiumProcedure.mutation(async () => {
    // throw new TRPCError({code: "BAD_REQUEST", message: "Something went wrong"})

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