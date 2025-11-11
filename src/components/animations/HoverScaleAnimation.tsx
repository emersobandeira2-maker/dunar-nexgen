import { PropsWithChildren } from "react"

type HoverScaleAnimationProps =
    {
        scale?: number
    }

function HoverScaleAnimation({ scale = 102, children }: { scale?: 95 | 100 | 102 | 105 | 110 | 115 | 120, children: React.ReactNode }) {
    const scaleMap: Record<number, string> = {
        95: "hover:scale-95",
        100: "hover:scale-100",
        102: "hover:scale-102",
        105: "hover:scale-105",
        110: "hover:scale-110",
        115: "hover:scale-115",
        120: "hover:scale-120",
    }

    return (
        <div className={`transition-transform duration-200 ${scaleMap[scale]}`}>
            {children}
        </div>
    )
}


export default HoverScaleAnimation