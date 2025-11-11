import { concate } from "@/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string
    className?: string
    children?: React.ReactNode
}

function Button({ text, className, children, ...props }: ButtonProps) {
    return (
        <button className={concate("h-10 px-3 rounded-lg border-1 border-black/10 text-gray-50 bg-primary hover:bg-primary/90 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed", className!)} {...props}>
            {children || text}
        </button>
    )
}

export default Button
