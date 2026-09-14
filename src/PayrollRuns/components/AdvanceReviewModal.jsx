import React, { useState, useEffect } from 'react';
import { 
    CreditCard, Search, CheckCircle2, Info, RefreshCw,
    AlertCircle, FileText, Check
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';
import { ApiCall } from '../../library/constants';

export default function AdvanceReviewModal({
    isOpen,
    onClose,
    employees = [],
    month,
    year,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');
    const [apiData, setApiData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchAdvanceInspection = async () => {
            setLoading(true);
            try {
                const m = month || (new Date().getMonth() + 1);
                const y = year || new Date().getFullYear();
                const res = await ApiCall('get', `/payroll/inspect/advances?month=${m}&year=${y}`);
                if (res?.data?.success && res.data.data) {
                    setApiData(res.data.data.advances || []);
                    setSummary(res.data.data.summary || null);
                }
            } catch (err) {
                console.error("Failed to load advances inspection:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdvanceInspection();
    }, [isOpen, month, year]);

    if (!isOpen) return null;

    // Use fetched advances or fall back to employees with advance recovery
    const displayList = apiData.length > 0 ? apiData : employees
        .filter(e => (e.advance_recovery > 0 || e.loan_recovery > 0))
        .map(e => ({
            advance_code: 'ADV-SYNC',
            employee_code: e.id,
            employee_name: e.name,
            department: e.department,
            designation: e.designation,
            advance_amount: (e.advance_recovery || 0) * 3,
            installment_amount: (e.advance_recovery || 0) + (e.loan_recovery || 0),
            recovered_amount: (e.advance_recovery || 0),
            remaining_balance: (e.advance_recovery || 0) * 2,
            purpose: 'Salary Advance / EMI',
            repayment_status: 'Active'
        }));

    const filtered = displayList.filter(item => {
        const empCode = item.employee_code || '';
        const empName = item.employee_name || '';
        const matchesSearch = 
            empName.toLowerCase().includes(search.toLowerCase()) ||
            empCode.toLowerCase().includes(search.toLowerCase());
        return matchesSearch;
    });

    const totalRecoveriesCount = displayList.length;
    const totalAdvanceSum = displayList.reduce((sum, e) => sum + (e.installment_amount || 0), 0);
    const totalOutstanding = displayList.reduce((sum, e) => sum + (e.remaining_balance || 0), 0);

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            size="2xl"
            title="Salary Advances & Loan Recovery Inspection"
        >
            <div className="p-5 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {totalRecoveriesCount}
                        </div>
                        <div>
                            <p className="text-xs text-purple-800 font-medium">Active Recoveries</p>
                            <p className="text-sm font-bold text-purple-950">Approved Advances</p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Monthly Installment Sum</p>
                            <p className="text-sm font-bold text-indigo-950">₹{totalAdvanceSum.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-amber-800 font-medium">Total Outstanding Balance</p>
                            <p className="text-sm font-bold text-amber-950">₹{totalOutstanding.toLocaleString('en-IN')}</p>
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
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[420px] overflow-y-auto">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
                            <p className="text-xs">Fetching active salary advances & loan ledgers...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600">
                                <tr>
                                    <th className="py-2.5 px-3 font-semibold">Employee</th>
                                    <th className="py-2.5 px-3 font-semibold">Department</th>
                                    <th className="py-2.5 px-3 font-semibold">Purpose</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Advance Amount</th>
                                    <th className="py-2.5 px-3 font-semibold text-right text-purple-700 bg-purple-50/70">Cycle Recovery (EMI)</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Remaining Balance</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-400">
                                            No active advance or loan recoveries found for this month.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <div className="font-semibold text-gray-900">{item.employee_name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{item.employee_code}</div>
                                            </td>
                                            <td className="py-2.5 px-3 text-gray-600">{item.department || '—'}</td>
                                            <td className="py-2.5 px-3 text-gray-700 font-medium max-w-[140px] truncate" title={item.purpose}>
                                                {item.purpose || 'Salary Advance'}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-gray-700">
                                                ₹{(item.advance_amount || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-bold text-purple-700 bg-purple-50/30">
                                                ₹{(item.installment_amount || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-mono text-amber-700 font-medium">
                                                ₹{(item.remaining_balance || 0).toLocaleString('en-IN')}
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                    {item.repayment_status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
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

