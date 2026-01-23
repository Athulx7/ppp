import React, { useEffect } from "react";
import { X } from "lucide-react";

function CommonModal({
    isOpen,
    onClose,
    title,
    body,
    children,
    size = "md",
    closeButton = true,
    overlayClose = true,
    animation = "fade",
    customHeader,
    customFooter
}) {

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        }
        document.addEventListener("keydown", handleEscape)
        return () => document.removeEventListener("keydown", handleEscape)
    }, [isOpen, onClose])

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto"
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        full: "max-w-full mx-4",
    };

    const animationClasses = {
        fade: "animate-fadeIn",
        slide: "animate-slideIn",
        bounce: "animate-bounceIn",
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className={`fixed inset-0 bg-black/50 transition-opacity ${animationClasses[animation]}`}
                onClick={overlayClose ? onClose : undefined}
            />

            <div className="flex items-center justify-center min-h-screen p-4">
                <div
                    className={`relative bg-white rounded-xl shadow-xl w-full ${sizeClasses[size]} ${animationClasses[animation]}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {customHeader || (
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            {closeButton && (
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-500 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="p-4 overflow-y-auto max-h-[70vh]">
                        {typeof body === "function" ? body() : body || children}
                    </div>

                    {customFooter && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            {typeof customFooter === "function"
                                ? customFooter()
                                : customFooter}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


export default CommonModal