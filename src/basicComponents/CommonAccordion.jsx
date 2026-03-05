import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

function CommonAccordion({
    title,
    children,
    icon,
    defaultOpen = false,
    actions = null,
    className = '',
    titleClassName = '',
    contentClassName = ''
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
            <div
                className={`
                    flex items-center justify-between p-4 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${titleClassName}
                `}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {icon && <span className="text-gray-500">{icon}</span>}
                    <h3 className="font-medium text-gray-900">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {actions && <div onClick={(e) => e.stopPropagation()}>{actions}</div>}
                    <button className="p-1 hover:bg-gray-200 rounded-full">
                        {isOpen ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                        )}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className={`p-4 border-t border-gray-200 ${contentClassName}`}>
                    {children}
                </div>
            )}
        </div>
    );
}

export default CommonAccordion;