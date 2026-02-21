import { Disc3, DiscIcon, Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <div className="flex flex-col justify-center items-center">

      <Disc3
        role="status"
        aria-label="Loading"
        className={cn("animate-spin size-10", className)}
        {...props}
      />
      <div className="mt-2">Loading...</div>
    </div>
  )
}

export { Spinner }
