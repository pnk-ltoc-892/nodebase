import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import React from 'react'

const page = () => {

  const flag = true
  return (
    <div className={cn("bg-red-900 font-extrabold", flag === true && "text-black")}>
      <Button  >
        Click Me
      </Button>
    </div>
  )
}

export default page