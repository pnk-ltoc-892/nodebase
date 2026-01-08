import { requireAuth } from "@/lib/auth-utils"

const page = async () => {
  await requireAuth()
  
  return (
    <div>
      WorkFlow Page
    </div>
  )
}

export default page