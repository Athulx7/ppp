import React from 'react'

function LeaveBalance({ openModal, leaveBalance = [] }) {
    const colors = {
        'CL': { text: 'text-blue-700', color: 'bg-blue-500' },
        'SL': { text: 'text-green-700', color: 'bg-green-500' },
        'EL': { text: 'text-purple-700', color: 'bg-purple-500' },
        'CO': { text: 'text-amber-700', color: 'bg-amber-500' }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">Leave Balance</h3>
                <button onClick={() => openModal('leave')}
                    className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-md hover:bg-indigo-100 cursor-pointer">
                    + Apply
                </button>
            </div>
            <div className="space-y-2.5">
                {(leaveBalance || []).map(lt => {
                    const style = colors[lt.leave_code] || { text: 'text-indigo-700', color: 'bg-indigo-500' };
                    const total = lt.total > 0 ? lt.total : 1;
                    const pct = Math.min(100, Math.round((lt.available / total) * 100));

                    return (
                        <div key={lt.id || lt.leave_code}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-700 font-medium">{lt.leave_name}</span>
                                <span className={`text-xs font-bold ${style.text}`}>{lt.available}/{lt.total}</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className={`h-full ${style.color} rounded-full`}
                                    style={{ width: `${pct}%` }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default LeaveBalance
