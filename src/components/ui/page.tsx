import { PropsWithChildren } from "react"
import { concate } from "@/utils"

function Page({ className, children }: { className?: string } & PropsWithChildren) {
    return (
        <div className={concate("w-full min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8", className!)}>
            {children}
        </div>
    )
}


export default Page