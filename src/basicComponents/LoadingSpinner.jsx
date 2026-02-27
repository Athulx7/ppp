import React, { useEffect } from 'react'

const LoadingSpinner = ({message}) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [])

    return (
        <div className="min-h-screen fixed inset-0 z-999 bg-black/40 p-4 md:p-10 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-indigo-500 mx-auto"></div>
                <p className="mt-4 text-white-600">{message}</p>
            </div>
        </div>
    )
}

export default LoadingSpinner
