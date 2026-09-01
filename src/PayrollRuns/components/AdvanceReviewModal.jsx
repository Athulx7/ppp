import React, { useState } from 'react';
import { 
    CreditCard, Search, CheckCircle2, Info
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';

export default function AdvanceReviewModal({
    isOpen,
    onClose,
    employees,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');

    if (!isOpen) return null;

    const filtered = employees.filter(emp => {
        const hasDeductions = (emp.advance_recovery > 0 || emp.loan_recovery > 0);
        const matchesSearch = 
            emp.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.id?.toLowerCase().includes(search.toLowerCase());
        return hasDeductions && matchesSearch;
    });

    const totalRecoveriesCount = employees.filter(e => (e.advance_recovery > 0 || e.loan_recovery > 0)).length;
    const totalAdvanceSum = employees.reduce((sum, e) => sum + (e.advance_recovery || 0) + (e.loan_recovery || 0), 0);

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            title="Salary Advances & Loan Recovery Inspection"
        >
            <div className="p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {totalRecoveriesCount}
                        </div>
                        <div>
                            <p className="text-xs text-purple-800 font-medium">Employees with Active Deductions</p>
                            <p className="text-sm font-bold text-purple-950">Advances / Loan EMIs</p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Total Monthly Recovery</p>
                            <p className="text-sm font-bold text-indigo-950">₹{totalAdvanceSum.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Filter */}
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

                {/* Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-[380px] overflow-y-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600">
                            <tr>
                                <th className="py-2.5 px-3 font-semibold">Employee</th>
                                <th className="py-2.5 px-3 font-semibold">Department</th>
                                <th className="py-2.5 px-3 font-semibold text-right">Salary Advance Deduction</th>
                                <th className="py-2.5 px-3 font-semibold text-right">Company Loan EMI</th>
                                <th className="py-2.5 px-3 font-semibold text-right text-purple-700 bg-purple-50/70">Total Cycle Deduction</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-400">
                                        No active advance or loan recoveries found for this month.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(emp => {
                                    const totalDeducted = (emp.advance_recovery || 0) + (emp.loan_recovery || 0);
                                    return (
                                        <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <div className="font-semibold text-gray-900">{emp.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{emp.id}</div>
                                            </td>
                                            <td className="py-2.5 px-3 text-gray-600">{emp.department}</td>
                                            <td className="py-2.5 px-3 text-right font-medium text-gray-700">
                                                ₹{(emp.advance_recovery || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-medium text-gray-700">
                                                ₹{(emp.loan_recovery || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">
                                                ₹{totalDeducted.toLocaleString('en-IN')}
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
                        Recoveries are linked automatically from the Salary Advance and Loan modules.
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
                            Confirm Recoveries & Mark Verified
                        </button>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}
