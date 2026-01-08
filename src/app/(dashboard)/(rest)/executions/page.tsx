import { requireAuth } from "@/lib/auth-utils"

const page = async () => {
  await requireAuth()

  return (
    <div>
      Executions Page
    </div>
  )
}

export default page