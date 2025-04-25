"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import { SparklesIcon } from "lucide-react"

const DashboardBtn = () => {
  return (
    <div>
      <Link href={"/dashboard"}>
            <Button className="gap-2 font-medium" size={"sm"}>
                <SparklesIcon className="size-4" />
                Dashboard
            </Button>
       </Link>
    </div>
  )
}

export default DashboardBtn
