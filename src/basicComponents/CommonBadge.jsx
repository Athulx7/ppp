import React from 'react';

function CommonBadge({ text, color = 'blue', size = 'md', icon, className = '' }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-800',
        green: 'bg-green-100 text-green-800',
        red: 'bg-red-100 text-red-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        purple: 'bg-purple-100 text-purple-800',
        pink: 'bg-pink-100 text-pink-800',
        indigo: 'bg-indigo-100 text-indigo-800',
        gray: 'bg-gray-100 text-gray-800',
        orange: 'bg-orange-100 text-orange-800',
        teal: 'bg-teal-100 text-teal-800'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
    };

    return (
        <span className={`
            inline-flex items-center font-medium rounded-full
            ${colors[color] || colors.blue}
            ${sizes[size] || sizes.md}
            ${className}
        `}>
            {icon && <span className="mr-1">{icon}</span>}
            {text}
        </span>
    );
}

export default CommonBadge;