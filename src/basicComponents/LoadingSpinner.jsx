import React from 'react'
import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ fullScreen = false, size = 'md', color = 'indigo', message, }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
    }

    const colorClasses = {
        indigo: 'text-indigo-600',
        white: 'text-white',
        gray: 'text-gray-600',
        red: 'text-red-600',
        green: 'text-green-600',
        blue: 'text-blue-600',
        purple: 'text-purple-600',
        pink: 'text-pink-600',
        yellow: 'text-yellow-600',
    }

    return (
        <div className={` ${fullScreen ? 'fixed inset-0 z-[999]' : ''} flex items-center justify-center bg-black/40 `}>
            <div className="flex flex-col items-center space-y-3">
                <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />
                {message && (
                    <p className={`text-base font-medium ${colorClasses[color]}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    )
}

export default LoadingSpinner
