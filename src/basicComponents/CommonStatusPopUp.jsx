import React from "react"
import { X, CheckCircle, XCircle, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const CommonStatusPopUp = ({
    isOpen = false,
    onClose = () => { },
    title = "",
    children = null,
    body = "",
    primaryButtonText = "",
    secondaryButtonText = "",
    onPrimaryButtonClick = () => { },
    onSecondaryButtonClick = () => { },
    showCloseButton = true,
    type = "default",
    autoClose = false,
    autoCloseDuration = 3000,
}) => {
    React.useEffect(() => {
        if (autoClose && isOpen) {
            const timer = setTimeout(onClose, autoCloseDuration)
            return () => clearTimeout(timer)
        }
    }, [isOpen, autoClose, autoCloseDuration, onClose])

    const typeConfig = {
        success: {
            Icon: CheckCircle,
            iconColor: "text-emerald-500",
            bgColor: "bg-emerald-100",
            titleColor: "text-emerald-600",
            buttonColor: "bg-emerald-500 hover:bg-emerald-600",
            animation: { scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] },
        },
        error: {
            Icon: XCircle,
            iconColor: "text-red-600",
            bgColor: "bg-red-100",
            titleColor: "text-red-600",
            buttonColor: "bg-red-500 hover:bg-red-600",
            animation: { scale: [1, 1.1, 1] },
        },
        info: {
            Icon: Info,
            iconColor: "text-yellow-500",
            bgColor: "bg-yellow-100",
            titleColor: "text-yellow-500",
            buttonColor: "bg-yellow-500 hover:bg-yellow-600",
            animation: { scale: [1, 1.05, 1], y: [0, -5, 0] },
        },
        default: {
            Icon: null,
            iconColor: "text-gray-500",
            bgColor: "bg-gray-100",
            titleColor: "text-gray-600",
            buttonColor: "bg-emerald-500 hover:bg-emerald-600",
            animation: { scale: 1 },
        },
    }

    const currentType = typeConfig[type] || typeConfig.default
    const content = body || children
    const StatusIcon = currentType.Icon

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 backdrop-blur-[2px] bg-[rgba(249,250,251,0.7)]"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 10 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="relative z-10 w-full max-w-xs rounded-xl bg-white px-6 py-8 shadow-2xl"
                    >
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 transition"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {(StatusIcon || title) && (
                            <div className="flex flex-col items-center text-center space-y-4">
                                {StatusIcon && (
                                    <motion.div
                                        initial={{ scale: 1 }}
                                        animate={currentType.animation}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className={`flex items-center justify-center w-20 h-20 rounded-full ${currentType.bgColor}`}
                                    >
                                        <StatusIcon
                                            size={40}
                                            className={currentType.iconColor}
                                        />
                                    </motion.div>
                                )}

                                {title && (
                                    <h3 className={`text-lg font-semibold ${currentType.titleColor}`}>
                                        {title}
                                    </h3>
                                )}

                                {content && (
                                    <div className="text-sm text-gray-600">
                                        {content}
                                    </div>
                                )}
                            </div>
                        )}

                        {(primaryButtonText || secondaryButtonText) && (
                            <div className="mt-6 flex justify-center gap-3">
                                {secondaryButtonText && (
                                    <button
                                        onClick={onSecondaryButtonClick || onClose}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        {secondaryButtonText}
                                    </button>
                                )}
                                {primaryButtonText && (
                                    <button
                                        onClick={onPrimaryButtonClick}
                                        className={`px-4 py-2 rounded-lg text-white ${currentType.buttonColor}`}
                                    >
                                        {primaryButtonText}
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default CommonStatusPopUp