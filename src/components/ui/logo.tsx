import Image from "next/image"
import Link, { LinkProps } from "next/link"
import { concate } from "@/utils"
import DunarLogo from "public/dunar-icon.svg"

function Logo({ className, title, subtitle, ...props }: { className?: string, title?: string, subtitle?: string } & LinkProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={concate("relative w-40 h-40", className!)}>
                <Link {...props}>
                    <Image src={DunarLogo} alt="" fill />
                </Link>
            </div>

            <span className="text-[1.2rem] text-center text-gray-50">
                {title}
                <br />
                <span className="text-[1rem] text-center text-gray-50/50">{subtitle}</span>
            </span>

        </div>
    )
}

export default Logo