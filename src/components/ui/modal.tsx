"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{
    open: boolean;
    onClose?: () => void;
    backdropClickable?: boolean;
}>;

export default function Modal({ children, open, onClose, backdropClickable = true }: ModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // bloqueia scroll quando aberto
    useEffect(() => {
        if (!mounted) return;
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mounted, open]);

    if (!mounted || !open) return null;

    const root = document.getElementById("modal-root") || document.body;

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={backdropClickable ? onClose : undefined}
            />
            <div className="relative z-50 w-full max-w-md max-h-[90vh] overflow-y-auto">
                {children}
            </div>
        </div>,
        root
    );
}
