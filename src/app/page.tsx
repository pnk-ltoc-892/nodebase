// For Client Component
// 'use client'

// import { useTRPC } from "@/trpc/client"
// import { useQuery } from "@tanstack/react-query";

// const page = () => {
//   const trpc = useTRPC();
//   const { data: users } = useQuery(trpc.getUsers.queryOptions())
//   return (
//     <div className="bg-red-900 font-extrabold">
//       {JSON.stringify(users)}
//     </div>
//   )
// }

// export default page


// For Server Component
// import { cn } from '@/lib/utils'
// import { caller } from '@/trpc/server'
// import React from 'react'
// import { Client } from './client'

// const page = async () => {
//   const users = await caller.getUsers()
//   const flag = true
//   return (
//     <div className={cn("bg-red-900 font-extrabold", flag === true && "text-black")}>
//       // Data - Server Component - Client Component
//       // Leveraging Server Component Load Speed 
//       <Client users={users} />
//        {/* {JSON.stringify(users)} */}
//     </div>
//   )
// }

// export default page


// For Server Component

import { getQueryClient, trpc } from '@/trpc/server'
import React, { Suspense } from 'react'
import { Client } from './client'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

const page = async () => {
  const queryClient = getQueryClient()

  // Prefetch - Server Component leveraged to prefetch fast
  // Hand it off to client Component
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions())
 
  return (
    <div className="bg-red-900 font-extrabold">
      <HydrationBoundary state={dehydrate(queryClient)} >
        <Suspense fallback={<p>Loading...</p>} >
          <Client />
        </Suspense>
      </HydrationBoundary> 
    </div>
  )
}

export default page