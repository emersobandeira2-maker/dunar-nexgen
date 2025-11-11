import { PropsWithChildren } from "react"

export function Table({ children }: PropsWithChildren) {
    return (
        <div className="overflow-x-auto w-full p-conpad rounded-lg bg-background-muted">
            <table className="w-full table-auto border-collapse text-sm sm:text-base">
                {children}
            </table>
        </div>
    )
}

export function TableHead({ children }: PropsWithChildren) {
    return (
        <thead>
            <tr>
                {children}
            </tr>
        </thead>
    )
}

export function TableHeadChild({ border = true, children }: { border?: boolean } & PropsWithChildren) {
    return (
        <td className={`px-4 py-2 text-left font-bold ${border && "border-l border-black/5"}`}>
            {children}
        </td>
    )
}

export function TableBody({ children }: PropsWithChildren) {
    return (
        <tbody>
            {children}
        </tbody>
    )
}

export function TableBodyRow({ children }: PropsWithChildren) {
    return (
        <tr>
            {children}
        </tr>
    )
}

export function TableBodyChild({ border = true, children }: { border?: boolean } & PropsWithChildren) {
    return (
        <td className={`px-4 py-2 ${border && "border-l border-black/5"} wrap-break-word whitespace-normal`}>
            {children}
        </td>
    )
}