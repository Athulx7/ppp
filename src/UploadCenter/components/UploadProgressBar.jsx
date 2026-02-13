import React from 'react';

function UploadProgressBar({ progress, size = 'md', showPercentage = true, color = 'bg-indigo-600' }) {
    const sizes = {
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4'
    };

    const statusColor =
        progress === 100 ? 'bg-green-600' :
            progress > 0 ? color : 'bg-gray-300';

    return (
        <div className="flex items-center gap-3">
            <div className={`flex-1 bg-gray-200 rounded-full ${sizes[size]}`}>
                <div
                    className={`${statusColor} rounded-full ${sizes[size]} transition-all duration-500 ease-in-out`}
                    style={{ width: `${progress}%` }}
                />
            </div>
            {showPercentage && (
                <span className="text-sm font-medium text-gray-700 min-w-[45px]">
                    {progress}%
                </span>
            )}
        </div>
    );
}

export default UploadProgressBar;