import { PropsWithChildren } from "react"
import { concate } from "@/utils"

function Card({ className, children, ...props }: { className?: string } & PropsWithChildren) {
    return (
        <div className={concate("relative w-full max-w-[95%] sm:max-w-[800px] lg:max-w-[1000px] flex flex-col justify-center items-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 rounded-2xl bg-background/95 shadow-black shadow-2xl/70", className!)} {...props}>
            {children}
        </div>
    )
}

export default Card