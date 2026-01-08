import { requireAuth } from "@/lib/auth-utils"

interface PageProps {
    params: Promise<{
        ceredentialId: string
    }>
}


const page = async ({ params }: PageProps) => {
    await requireAuth()
    const { ceredentialId } = await params
  return (
    <div>
      Ceredential ID: {ceredentialId}
    </div>
  )
}

export default page