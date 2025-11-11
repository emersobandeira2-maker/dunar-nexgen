import { concate } from "@/utils"
import { PropsWithChildren } from "react";

function Select({ children, className, ...props }: { className?: string } & React.SelectHTMLAttributes<HTMLSelectElement> & PropsWithChildren) {
    return (
        <select name="" id="" className={concate("min-h-10 px-3 rounded-lg border border-black/10 text-gray-700 bg-white placeholder:text-gray-400", className!)} {...props}>
            {children}
        </select>
    )
}

export default Select