import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { concate } from "@/utils"
import Image from "next/image"

function IconedButton({ text, className, icon, ...props }: { text: string, icon: StaticImport, className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={concate("w-full flex justify-between items-center h-10 px-3 rounded-lg border border-black/10 text-gray-50 bg-primary hover:bg-primary/90 hover:cursor-pointer", className || "")} {...props}>
            {text}
            <Image src={icon} alt="" />
        </button>
    )
}

export default IconedButton