import React from 'react';
import { Link } from 'react-router-dom';

function CommonButton({
    label = 'Button',
    variant = 'primary',
    size = 'medium',
    disabled = false,
    fullWidth = false,
    onClick = () => { },
    className = '',
    icon = null,
    iconPosition = 'left',
    href = null,
    to = null,
    target = '_self',
    type = 'button',
    loading = false,
    pill = false,
    rounded = 'lg',
    shadow = 'none'
}) {

    const sizeClasses = {
        small: 'py-1 px-3 text-sm min-h-[34px]',
        medium: 'py-2 px-4 text-base min-h-[42px]',
        large: 'py-3 px-5 text-lg min-h-[50px]'
    }

    const roundedClasses = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: pill ? 'rounded-full' : 'rounded-full'
    }

    const shadowClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow',
        lg: 'shadow-lg'
    }
    const variantClasses = {
        primary: {
            base: `bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border border-indigo-600`,
            hover: `hover:from-indigo-600 hover:to-indigo-700 hover:border-indigo-700`,
            focus: `focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2`,
            disabled: `from-indigo-300 to-indigo-400 border-indigo-400 cursor-not-allowed`
        },
        success: {
            base: `bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border border-emerald-600`,
            hover: `hover:from-emerald-600 hover:to-emerald-700 hover:border-emerald-700`,
            focus: `focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-2`,
            disabled: `from-emerald-300 to-emerald-400 border-emerald-400 cursor-not-allowed`
        },
        danger: {
            base: `bg-gradient-to-r from-red-500 to-red-600 text-white border border-red-600`,
            hover: `hover:from-red-600 hover:to-red-700 hover:border-red-700`,
            focus: `focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2`,
            disabled: `from-red-300 to-red-400 border-red-400 cursor-not-allowed`
        },
        warning: {
            base: `bg-gradient-to-r from-amber-500 to-amber-600 text-white border border-amber-600`,
            hover: `hover:from-amber-600 hover:to-amber-700 hover:border-amber-700`,
            focus: `focus:ring-1 focus:ring-amber-500/30 focus:ring-offset-1`,
            disabled: `from-amber-300 to-amber-400 border-amber-400 cursor-not-allowed`
        },
        outline: {
            base: `bg-white text-gray-700 border-1 border-gray-300`,
            hover: `hover:bg-gray-50 hover:border-gray-400`,
            focus: `focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-2`,
            disabled: `text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed`
        },
        'outline-primary': {
            base: `bg-white text-indigo-600 border-1 border-indigo-600`,
            hover: `hover:bg-indigo-50 hover:border-indigo-700 hover:text-indigo-700`,
            focus: `focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2`,
            disabled: `text-indigo-300 border-indigo-300 bg-indigo-50 cursor-not-allowed`
        },
        'outline-danger': {
            base: `bg-white text-red-600 border-1 border-red-600`,
            hover: `hover:bg-red-50 hover:border-red-700 hover:text-red-700`,
            focus: `focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2`,
            disabled: `text-red-300 border-red-300 bg-red-50 cursor-not-allowed`
        },
        cancel: {
            base: `bg-white text-red-600 border-1 border-red-600`,
            hover: `hover:bg-red-50 hover:border-red-700 hover:text-red-700`,
            focus: `focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2`,
            disabled: `text-red-300 border-red-300 bg-red-50 cursor-not-allowed`
        },
        ghost: {
            base: `bg-transparent text-gray-700 border border-transparent`,
            hover: `hover:bg-gray-100 hover:border-gray-200`,
            focus: `focus:ring-2 focus:ring-gray-500/30 focus:ring-offset-2`,
            disabled: `text-gray-400 bg-transparent cursor-not-allowed`
        },
        'ghost-primary': {
            base: `bg-transparent text-indigo-600 border border-transparent`,
            hover: `hover:bg-indigo-50 hover:border-indigo-100`,
            focus: `focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2`,
            disabled: `text-indigo-300 bg-transparent cursor-not-allowed`
        }
    }

    const iconSpacing = {
        left: 'mr-2',
        right: 'ml-2'
    }

    const baseClasses = `
        inline-flex items-center justify-center font-medium transition-all duration-200 
        focus:outline-none ${fullWidth ? 'w-full' : ''}
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${sizeClasses[size]}
        ${disabled ? variantClasses[variant].disabled : `
            ${variantClasses[variant].base}
            ${variantClasses[variant].hover}
            ${variantClasses[variant].focus}
        `}
        ${loading ? 'opacity-70 cursor-wait' : ''}
        ${className}
    `.replace(/\s+/g, ' ').trim()

    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )

    const content = (
        <>
            {loading && <LoadingSpinner />}
            {icon && iconPosition === 'left' && !loading && (
                <span className={`${iconSpacing.left} flex items-center`}>{icon}</span>
            )}
            <span className="whitespace-nowrap">{label}</span>
            {icon && iconPosition === 'right' && (
                <span className={`${iconSpacing.right} flex items-center`}>{icon}</span>
            )}
        </>
    )

    if (to) {
        return (
            <Link
                to={disabled ? '#' : to}
                className={baseClasses}
                onClick={(e) => {
                    if (disabled || loading) {
                        e.preventDefault();
                    }
                }}
            >
                {content}
            </Link>
        )
    }

    if (href) {
        return (
            <a
                href={disabled ? '#' : href}
                target={target}
                rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                className={baseClasses}
                onClick={(e) => {
                    if (disabled || loading) {
                        e.preventDefault();
                    }
                }}
            >
                {content}
            </a>
        )
    }

    return (
        <button
            type={type}
            onClick={(e) => {
                if (!disabled && !loading && onClick) {
                    onClick(e);
                }
            }}
            disabled={disabled || loading}
            className={baseClasses}
        >
            {content}
        </button>
    )
}

export default CommonButton