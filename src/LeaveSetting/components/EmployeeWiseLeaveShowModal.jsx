import { Edit, X } from "lucide-react";

function EmployeeWiseLeaveShowModal({ modalEmployee, modalStats, closeModal, handleEditAllocation,getEmpTypeBadgeClass  }) {
    const getInitials = (name) =>
        name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col mx-4">

                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {getInitials(modalEmployee.emp_name)}
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">{modalEmployee.emp_name}</h2>
                            <p className="text-xs text-gray-500">
                                {modalEmployee.emp_code} &nbsp;·&nbsp; {modalEmployee.designation} &nbsp;·&nbsp; {modalEmployee.department}
                                &nbsp;·&nbsp;
                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${getEmpTypeBadgeClass(modalEmployee.employment_type)}`}>
                                    {modalEmployee.employment_type}
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={closeModal}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3 px-6 py-4 border-b border-gray-100">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-gray-500 mb-1">Leave Types</div>
                        <div className="text-xl font-semibold text-gray-900">{modalStats.leaveCount}</div>
                    </div>
                    <div className="bg-indigo-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-indigo-500 mb-1">Total Allocated</div>
                        <div className="text-xl font-semibold text-indigo-700">{modalStats.totalAllocated}</div>
                        <div className="text-xs text-indigo-400">days</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-orange-500 mb-1">Total Used</div>
                        <div className="text-xl font-semibold text-orange-600">{modalStats.totalUsed}</div>
                        <div className="text-xs text-orange-400">days</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-xs text-green-500 mb-1">Balance</div>
                        <div className={`text-xl font-semibold ${modalStats.balance < 10 ? 'text-red-600' : 'text-green-600'}`}>
                            {modalStats.balance}
                        </div>
                        <div className="text-xs text-green-400">days</div>
                    </div>
                </div>

                {/* Leave Breakdown — scrollable */}
                <div className="flex-1 overflow-y-auto scrollbar px-6 py-4">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Leave Breakdown</h3>
                    <div className="space-y-3">
                        {modalEmployee.leaves.map(leave => {
                            const pct = leave.allocated_days > 0
                                ? Math.min(100, Math.round((leave.used_days / leave.allocated_days) * 100))
                                : 0;
                            return (
                                <div
                                    key={leave.id}
                                    className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors"
                                >
                                    {/* Leave name + validity */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${leave.leave_color || 'bg-indigo-50 text-indigo-700'}`}>
                                                {leave.leave_name}
                                            </span>
                                            {leave.carry_forward && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                                                    Carry Forward
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {leave.valid_from} → {leave.valid_to}
                                        </span>
                                    </div>

                                    {/* Stats row */}
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="text-center">
                                            <div className="text-base font-semibold text-gray-800">{leave.allocated_days}</div>
                                            <div className="text-xs text-gray-400">Allocated</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-base font-semibold text-orange-500">{leave.used_days}</div>
                                            <div className="text-xs text-gray-400">Used</div>
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-base font-semibold ${leave.pending_days < 3 ? 'text-red-500' : 'text-green-600'}`}>
                                                {leave.pending_days}
                                            </div>
                                            <div className="text-xs text-gray-400">Balance</div>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-1.5 bg-indigo-500 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>{pct}% used</span>
                                        {leave.note && <span className="italic">{leave.note}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-gray-100">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => { closeModal(); handleEditAllocation(modalEmployee); }}
                        className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                    >
                        <Edit className="w-3.5 h-3.5" /> Edit Allocations
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EmployeeWiseLeaveShowModal