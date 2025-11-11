import { concate } from "@/utils"
import Image from "next/image"
import SearchIcon from "public/icons/search-icon.svg"

function Input({ className, ...props }: { className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="relative flex gap-2">
            <Image src={SearchIcon} alt="" className="absolute right-2 top-2" />
            <input type="text" placeholder="Buscar Placa" className={concate("w-full h-10 indent-2 rounded-sm bg-background-strong-muted", className!)} maxLength={12}  {...props} />
        </div>
    )
}

export default Input