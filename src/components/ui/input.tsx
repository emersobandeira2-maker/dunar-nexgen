import { concate } from "@/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string
    label?: string
}

function Input({ className, label, ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <input
                className={concate("min-h-10 w-full px-3 rounded-lg border border-black/10 text-gray-700 bg-white placeholder:text-gray-400", className!)}
                {...props}
            />
        </div>
    )
}

export default Input
