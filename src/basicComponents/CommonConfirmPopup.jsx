import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, Info, CheckCircle, X } from 'lucide-react'

export default function CommonConfirmPopup({
    isOpen,
    onConfirm,
    onCancel,
    title = 'Are you sure?',
    message = '',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
}) {
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e) => { if (e.key === 'Escape') onCancel?.() }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [isOpen, onCancel])

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    if (!isOpen) return null

    const variantConfig = {
        danger: {
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            Icon: Trash2,
            confirmBtn: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border border-red-600 focus:ring-red-500/30',
            ringColor: 'ring-red-200',
        },
        warning: {
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            Icon: AlertTriangle,
            confirmBtn: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border border-amber-600 focus:ring-amber-500/30',
            ringColor: 'ring-amber-200',
        },
        info: {
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            Icon: Info,
            confirmBtn: 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border border-indigo-600 focus:ring-indigo-500/30',
            ringColor: 'ring-indigo-200',
        },
        success: {
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            Icon: CheckCircle,
            confirmBtn: 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border border-emerald-600 focus:ring-emerald-500/30',
            ringColor: 'ring-emerald-200',
        },
    }

    const cfg = variantConfig[variant] ?? variantConfig.danger
    const { iconBg, iconColor, Icon, confirmBtn } = cfg

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
                onClick={onCancel}
            />

            <div
                className="relative w-full max-w-sm bg-white rounded-md animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                <div className="p-6 flex flex-col items-center text-center gap-4">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-full ${iconBg} ring-8 ${cfg.ringColor}`}>
                        <Icon size={26} className={iconColor} />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
                        {message && (
                            <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 px-6 pb-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="
                            flex-1 py-2 px-4 rounded-lg text-sm font-medium
                            bg-white text-gray-700 border border-gray-300
                            hover:bg-gray-50 hover:border-gray-400
                            focus:outline-none focus:ring-2 focus:ring-gray-400/30 focus:ring-offset-1
                            disabled:opacity-50 disabled:cursor-not-allowed
                            transition-all duration-150
                        "
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`
                            flex-1 py-2 px-4 rounded-lg text-sm font-medium text-white
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            disabled:opacity-60 disabled:cursor-not-allowed
                            transition-all duration-150 inline-flex items-center justify-center gap-2
                            ${confirmBtn}
                        `}
                    >
                        {loading && (
                            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )}
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
