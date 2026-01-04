import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import { cn } from '@/lib/utils'
import React from 'react'

const page = async () => {
  const users = await prisma.user.findMany()
  const flag = true
  return (
    <div className={cn("bg-red-900 font-extrabold", flag === true && "text-black")}>
      {JSON.stringify(users)}
    </div>
  )
}

export default page