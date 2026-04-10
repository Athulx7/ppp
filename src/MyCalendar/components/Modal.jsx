import React from 'react'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children, footer }) {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <X size={18} className="text-gray-500" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar">
                    {children}
                </div>
                {footer && (
                    <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Modal
