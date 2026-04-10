import React from 'react'
import { LEAVE_TYPES } from '../hooks/useCalendarState'

function LeaveBalance({ openModal }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">Leave Balance</h3>
                <button onClick={() => openModal('leave')}
                    className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-xl">
                    + Apply
                </button>
            </div>
            <div className="space-y-2.5">
                {LEAVE_TYPES.filter(lt => lt.code !== 'UL').map(lt => (
                    <div key={lt.code}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-700 font-medium">{lt.name}</span>
                            <span className={`text-xs font-bold ${lt.text}`}>{lt.balance}/{lt.total}</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${lt.color} rounded-full`}
                                style={{ width: `${(lt.balance / lt.total) * 100}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LeaveBalance
