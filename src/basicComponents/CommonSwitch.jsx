import React from 'react';

function CommonSwitch({ label, checked, onChange, disabled = false, size = 'md' }) {
    const sizes = {
        sm: { toggle: 'w-8 h-4', dot: 'w-3 h-3', translate: 'translate-x-4' },
        md: { toggle: 'w-11 h-6', dot: 'w-5 h-5', translate: 'translate-x-5' },
        lg: { toggle: 'w-14 h-7', dot: 'w-6 h-6', translate: 'translate-x-7' }
    };

    return (
        <label className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div className={`block ${sizes[size].toggle} rounded-full transition-colors ${checked ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}></div>
                <div className={`dot absolute left-1 top-1 ${sizes[size].dot} bg-white rounded-full transition-transform ${checked ? sizes[size].translate : 'translate-x-0'
                    }`}></div>
            </div>
            {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
        </label>
    );
}

export default CommonSwitch;