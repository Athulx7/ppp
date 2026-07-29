import React from 'react'

function SectionHeading({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )
}

export default SectionHeading
