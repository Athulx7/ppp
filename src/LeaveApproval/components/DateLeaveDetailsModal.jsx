import React from 'react'

function DateLeaveDetailsModal({ selectedDate, dateLeaveDetails, setShowDateLeaves,
    setSelectedRequest, setShowDetailsModal
}) {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Leaves on {selectedDate}</h3>
                                <p className="text-sm text-gray-500">{dateLeaveDetails.length} employee(s) on leave</p>
                            </div>
                            <button
                                onClick={() => setShowDateLeaves(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {dateLeaveDetails.map((leave, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium">{leave.emp_name}</p>
                                            <p className="text-xs text-gray-500">{leave.department} - {leave.designation}</p>
                                        </div>
                                        <StatusBadge status={leave.status} />
                                    </div>
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                            <span className="text-gray-500">Leave Type:</span>
                                            <p className="font-medium">{leave.leave_name}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Duration:</span>
                                            <p className="font-medium">{leave.days} days</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {leave.from_date} to {leave.to_date}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShowDateLeaves(false);
                                            setSelectedRequest(leave);
                                            setShowDetailsModal(true);
                                        }}
                                        className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowDateLeaves(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DateLeaveDetailsModal