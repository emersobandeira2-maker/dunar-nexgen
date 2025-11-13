import Image from "next/image"
import Link from "next/link"
import PaymentIcon from "public/icons/payment-icon.svg"
import DataIcon from "public/icons/data-icon.svg"
import UserIcon from "public/icons/user-list-icon.svg"
import RegisterIcon from "public/icons/register-icon.svg"
// import CheckIcon from "public/icons/check-icon.svg"
import HoverScaleAnimation from "@/components/animations/HoverScaleAnimation"

export default function Menu() {
    return (
        <div className="w-full flex flex-col gap-5 p-conpad rounded-lg bg-background-muted">

            <HoverScaleAnimation>
                <Link href={"/admin/controle-acesso"}>
                    <span className="flex justify-between">
                        <span>Controle de Acesso</span>
                        <Image src={RegisterIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/pagamentos"}>
                    <span className="flex justify-between">
                        <span>Pagamentos</span>
                        <Image src={PaymentIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/relatorios"}>
                    <span className="flex justify-between">
                        <span>Relatórios</span>
                        <Image src={DataIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/cadastro"}>
                    <span className="flex justify-between">
                        <span>Cadastros de Usuários</span>
                        <Image src={UserIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/cooperados"}>
                    <span className="flex justify-between">
                        <span>🤝 Cooperados</span>
                        <Image src={UserIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/eventos"}>
                    <span className="flex justify-between">
                        <span>🎉 Eventos</span>
                        <Image src={DataIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>

            <HoverScaleAnimation>
                <Link href={"/admin/configuracoes"}>
                    <span className="flex justify-between">
                        <span>⚙️ Configurações</span>
                        <Image src={DataIcon} alt="" />
                    </span>
                </Link>
            </HoverScaleAnimation>
        </div>
    )
}