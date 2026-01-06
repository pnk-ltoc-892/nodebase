import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"
import LogOutButton from "./logout"

const page = async () => {
    await requireAuth()   // Removal still be protected by protected Procedure

    const data = await caller.getUsers()
    return (
      <div className="min-h-screen min-w-screen flex items-center justify-center text-white bg-black flex-col gap-y-6">
        protected server component
        <div>
          {JSON.stringify(data)}
        </div>
          <LogOutButton />
      </div>

    )
}

export default page



// As a Client Component
// "use client"

// import { Button } from "@/components/ui/button"
// import { authClient } from "@/lib/auth-client"

// const page = () => {
//   const { data } = authClient.useSession()
 
//   return (
//     <div className="min-h-screen min-w-screen flex items-center justify-center text-white bg-black">
//       {JSON.stringify(data)}
//       {
//         data && 
//           <Button onClick={() => authClient.signOut()}>
//           Logout
//         </Button>
//       }
//     </div>
//   )
// }

// export default page