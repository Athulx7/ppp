import React from 'react'

function CommonButton({
    label = 'Button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    onClick = () => { },
    className = '',
    icon = null,
    iconPosition = 'left'
}) {

    const baseClasses = `flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${fullWidth ? 'w-full' : ''
        } ${className}`

    const sizeClasses = {
        small: 'py-1.5 px-3 text-sm',
        medium: 'py-2.5 px-4 text-base',
        large: 'py-3 px-5 text-lg'
    }

    const variantClasses = {

        'primary': `bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-500 border border-indigo-500 ${disabled ? 'bg-indigo-400 border-indigo-400 cursor-not-allowed' : ''
            }`,

        'primary-bordered': `bg-white text-indigo-500 hover:bg-indigo-50 border-2 border-indigo-600 focus:ring-indigo-500 ${disabled ? 'text-indigo-300 border-indigo-300 cursor-not-allowed' : ''
            }`,

        'delete': `bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-red-600 ${disabled ? 'bg-red-400 border-red-400 cursor-not-allowed' : ''
            }`,

        'delete-bordered': `bg-white text-red-600 hover:bg-red-50 border-2 border-red-600 focus:ring-red-500 ${disabled ? 'text-red-300 border-red-300 cursor-not-allowed' : ''
            }`
    }

    const iconSpacing = {
        left: 'mr-2',
        right: 'ml-2'
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} cursor-pointer`}
        >
            {icon && iconPosition === 'left' && (
                <span className={`${iconSpacing.left}`}>{icon}</span>
            )}
            {label}
            {icon && iconPosition === 'right' && (
                <span className={`${iconSpacing.right}`}>{icon}</span>
            )}
        </button>
    )
}

export default CommonButton