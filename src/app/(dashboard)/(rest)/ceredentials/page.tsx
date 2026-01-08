import { requireAuth } from "@/lib/auth-utils"

const page = async () => {
  await requireAuth()

  return (
    <div>
      Ceredentials Page
    </div>
  )
}

export default page