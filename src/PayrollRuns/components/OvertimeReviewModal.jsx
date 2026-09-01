import React, { useState } from 'react';
import { 
    Clock, Search, CheckCircle2, Info
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';

export default function OvertimeReviewModal({
    isOpen,
    onClose,
    employees,
    onUpdateEmployeeOt,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');
    const [otOnly, setOtOnly] = useState(true);

    if (!isOpen) return null;

    const filtered = employees.filter(emp => {
        const matchesSearch = 
            emp.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.id?.toLowerCase().includes(search.toLowerCase());
        const matchesOt = !otOnly || (emp.overtime_hours > 0);
        return matchesSearch && matchesOt;
    });

    const totalOtStaff = employees.filter(e => e.overtime_hours > 0).length;
    const totalOtHours = employees.reduce((sum, e) => sum + (e.overtime_hours || 0), 0);
    const totalOtAmount = employees.reduce((sum, e) => sum + (e.overtime_pay || 0), 0);

    const handleOtHourChange = (empId, newHours) => {
        const parsed = Math.max(0, Math.min(100, Number(newHours) || 0));
        onUpdateEmployeeOt(empId, parsed);
    };

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            title="Overtime & Variable Earnings Review"
        >
            <div className="p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {totalOtStaff}
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Eligible Employees</p>
                            <p className="text-sm font-bold text-indigo-950">Overtime Logged</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {totalOtHours}
                        </div>
                        <div>
                            <p className="text-xs text-purple-800 font-medium">Total OT Hours</p>
                            <p className="text-sm font-bold text-purple-950">Logged this Month</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-emerald-800 font-medium">Total Overtime Payout</p>
                            <p className="text-sm font-bold text-emerald-950">₹{totalOtAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={otOnly}
                            onChange={(e) => setOtOnly(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        Show only employees with logged OT
                    </label>
                </div>

                {/* Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600">
                            <tr>
                                <th className="py-2.5 px-3 font-semibold">Employee</th>
                                <th className="py-2.5 px-3 font-semibold">Department</th>
                                <th className="py-2.5 px-3 font-semibold text-right">Base Gross</th>
                                <th className="py-2.5 px-3 font-semibold text-center">Hourly Rate (1.5x)</th>
                                <th className="py-2.5 px-3 font-semibold text-center text-indigo-700 bg-indigo-50/70">OT Hours</th>
                                <th className="py-2.5 px-3 font-semibold text-right text-emerald-700 bg-emerald-50/70">Total OT Pay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">
                                        No employees matching overtime criteria.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(emp => {
                                    const hourlyRate = Math.round((emp.gross_salary / 30 / 8) * 1.5);
                                    return (
                                        <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <div className="font-semibold text-gray-900">{emp.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{emp.id}</div>
                                            </td>
                                            <td className="py-2.5 px-3 text-gray-600">{emp.department}</td>
                                            <td className="py-2.5 px-3 text-right font-medium">₹{emp.gross_salary?.toLocaleString('en-IN')}</td>
                                            <td className="py-2.5 px-3 text-center text-gray-600 font-mono">₹{hourlyRate}/hr</td>
                                            <td className="py-2.5 px-3 text-center bg-indigo-50/30">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={emp.overtime_hours || 0}
                                                    onChange={(e) => handleOtHourChange(emp.id, e.target.value)}
                                                    className="w-16 text-center py-1 border border-indigo-300 rounded font-semibold text-indigo-900 bg-indigo-50/80 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-bold text-emerald-600 bg-emerald-50/30">
                                                ₹{(emp.overtime_pay || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        Formula: <code>(Monthly Gross / 30 / 8) × 1.5 × OT Hours</code>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                onConfirmVerification();
                                onClose();
                            }}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Confirm OT & Mark Verified
                        </button>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}
