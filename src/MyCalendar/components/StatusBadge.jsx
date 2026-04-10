import React from 'react'

function StatusBadge({ status }) {
    const map = {
        approved: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        rejected: 'bg-red-100 text-red-800',
        holiday: 'bg-red-100 text-red-700',
        completed: 'bg-gray-100 text-gray-600',
    }
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

export default StatusBadge
