import { PropsWithChildren } from "react"
import { concate } from "@/utils"

function Form({ className, children, ...props }: { className?: string } & React.FormHTMLAttributes<HTMLFormElement> & PropsWithChildren) {
    return (
        <form className={concate("relative w-full max-w-[95%] sm:max-w-[450px] md:max-w-[500px] flex flex-col justify-center items-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 rounded-2xl bg-background/95 shadow-black shadow-2xl/70", className!)} {...props}>
            {children}
        </form>
    )
}

export default Form