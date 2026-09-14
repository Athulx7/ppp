import React, { useState, useEffect } from 'react';
import { 
    Clock, Search, CheckCircle2, Info, ChevronDown, ChevronUp,
    RefreshCw, Calendar
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';
import { ApiCall } from '../../library/constants';

export default function OvertimeReviewModal({
    isOpen,
    onClose,
    employees = [],
    month,
    year,
    onUpdateEmployeeOt,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');
    const [otOnly, setOtOnly] = useState(false);
    const [expandedEmpId, setExpandedEmpId] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editedOt, setEditedOt] = useState({});

    // Fetch live overtime inspection data from backend
    useEffect(() => {
        if (!isOpen) return;

        const fetchOtInspection = async () => {
            setLoading(true);
            try {
                const m = month || (new Date().getMonth() + 1);
                const y = year || new Date().getFullYear();
                const res = await ApiCall('get', `/payroll/inspect/overtime?month=${m}&year=${y}`);
                if (res?.data?.success && res.data.data) {
                    const fetchedEmployees = res.data.data.employees || [];
                    setApiData(fetchedEmployees);
                    setSummary(res.data.data.summary || null);

                    const initialOt = {};
                    fetchedEmployees.forEach(emp => {
                        initialOt[emp.employee_code] = emp.overtime_hours;
                    });
                    setEditedOt(initialOt);
                }
            } catch (err) {
                console.error("Failed to load overtime inspection:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOtInspection();
    }, [isOpen, month, year]);

    if (!isOpen) return null;

    // Use fetched API data if available, otherwise fallback to employees prop
    const displayList = apiData.length > 0 ? apiData : employees.map(e => ({
        employee_code: e.id,
        employee_name: e.name,
        department: e.department,
        designation: e.designation,
        gross_salary: e.gross_salary || 0,
        hourly_rate: Math.round((e.gross_salary || 0) / 30 / 8),
        ot_rate_multiplier: 1.5,
        overtime_minutes: (e.overtime_hours || 0) * 60,
        overtime_hours: e.overtime_hours || 0,
        overtime_payout: e.overtime_pay || 0,
        daily_ot_records: []
    }));

    const filtered = displayList.filter(emp => {
        const empCode = emp.employee_code || emp.id || '';
        const empName = emp.employee_name || emp.name || '';
        const curOt = editedOt[empCode] !== undefined ? editedOt[empCode] : emp.overtime_hours;

        const matchesSearch = 
            empName.toLowerCase().includes(search.toLowerCase()) ||
            empCode.toLowerCase().includes(search.toLowerCase());
        const matchesOt = !otOnly || (curOt > 0);
        return matchesSearch && matchesOt;
    });

    const totalOtStaff = displayList.filter(e => {
        const curOt = editedOt[e.employee_code] !== undefined ? editedOt[e.employee_code] : e.overtime_hours;
        return (curOt || 0) > 0;
    }).length;

    const totalOtHours = displayList.reduce((sum, e) => {
        const curOt = editedOt[e.employee_code] !== undefined ? editedOt[e.employee_code] : e.overtime_hours;
        return sum + (curOt || 0);
    }, 0);

    const totalOtAmount = displayList.reduce((sum, e) => {
        const curOt = editedOt[e.employee_code] !== undefined ? editedOt[e.employee_code] : e.overtime_hours;
        const rate = (e.hourly_rate || Math.round((e.gross_salary || 0) / 30 / 8)) * (e.ot_rate_multiplier || 1.5);
        return sum + Math.round((curOt || 0) * rate);
    }, 0);

    const handleOtHourChange = (empCode, newHours) => {
        const parsed = Math.max(0, Math.min(100, Number(newHours) || 0));
        setEditedOt(prev => ({ ...prev, [empCode]: parsed }));
        if (onUpdateEmployeeOt) {
            onUpdateEmployeeOt(empCode, parsed);
        }
    };

    const toggleExpand = (empCode) => {
        setExpandedEmpId(prev => prev === empCode ? null : empCode);
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
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {totalOtStaff}
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Eligible Employees</p>
                            <p className="text-sm font-bold text-indigo-950">Overtime Logged</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                            {Number(totalOtHours).toFixed(1)}
                        </div>
                        <div>
                            <p className="text-xs text-purple-800 font-medium">Total OT Hours</p>
                            <p className="text-sm font-bold text-purple-950">Logged this Month</p>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex items-center gap-3">
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
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[420px] overflow-y-auto">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                            <p className="text-xs">Fetching overtime punches & schedule multipliers...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600">
                                <tr>
                                    <th className="py-2.5 px-3 font-semibold">Employee</th>
                                    <th className="py-2.5 px-3 font-semibold">Department</th>
                                    <th className="py-2.5 px-3 font-semibold text-right">Base Gross</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Effective Rate</th>
                                    <th className="py-2.5 px-3 font-semibold text-center text-indigo-700 bg-indigo-50/70">OT Hours</th>
                                    <th className="py-2.5 px-3 font-semibold text-right text-emerald-700 bg-emerald-50/70">Total OT Pay</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Daily Logs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-gray-400">
                                            No employees matching overtime criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(emp => {
                                        const code = emp.employee_code || emp.id;
                                        const currentOt = editedOt[code] !== undefined ? editedOt[code] : (emp.overtime_hours || 0);
                                        const effectiveHourly = Math.round((emp.hourly_rate || ((emp.gross_salary || 0) / 30 / 8)) * (emp.ot_rate_multiplier || 1.5));
                                        const totalPay = Math.round(effectiveHourly * currentOt);
                                        const isExpanded = expandedEmpId === code;
                                        const dailyLogs = emp.daily_ot_records || [];

                                        return (
                                            <React.Fragment key={code}>
                                                <tr className={`hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="py-2.5 px-3">
                                                        <div className="font-semibold text-gray-900">{emp.employee_name || emp.name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono">{code}</div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-gray-600">{emp.department || '—'}</td>
                                                    <td className="py-2.5 px-3 text-right font-medium">₹{(emp.gross_salary || 0).toLocaleString('en-IN')}</td>
                                                    <td className="py-2.5 px-3 text-center text-gray-600 font-mono">₹{effectiveHourly}/hr ({emp.ot_rate_multiplier || 1.5}x)</td>
                                                    <td className="py-2.5 px-3 text-center bg-indigo-50/30">
                                                        <input
                                                            type="number"
                                                            step="0.5"
                                                            min="0"
                                                            max="100"
                                                            value={currentOt}
                                                            onChange={(e) => handleOtHourChange(code, e.target.value)}
                                                            className="w-16 text-center py-1 border border-indigo-300 rounded font-semibold text-indigo-900 bg-indigo-50/80 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                                                        />
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right font-bold text-emerald-600 bg-emerald-50/30">
                                                        ₹{totalPay.toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        {dailyLogs.length > 0 ? (
                                                            <button
                                                                onClick={() => toggleExpand(code)}
                                                                className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[11px] font-medium flex items-center gap-1 mx-auto"
                                                            >
                                                                {dailyLogs.length} Days
                                                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400">0 logs</span>
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* Expanded Daily Overtime Punches */}
                                                {isExpanded && dailyLogs.length > 0 && (
                                                    <tr className="bg-indigo-50/30">
                                                        <td colSpan={7} className="p-3">
                                                            <div className="bg-white border border-indigo-200 rounded-lg p-3 shadow-inner">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                                                                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                                                        Overtime Punch Log for {emp.employee_name || emp.name} ({code})
                                                                    </span>
                                                                    <span className="text-[11px] text-gray-500">
                                                                        Hourly Rate: <strong>₹{effectiveHourly}/hr</strong>
                                                                    </span>
                                                                </div>

                                                                <div className="max-h-40 overflow-y-auto border border-gray-100 rounded">
                                                                    <table className="w-full text-[11px] text-left">
                                                                        <thead className="bg-gray-100 text-gray-600 sticky top-0">
                                                                            <tr>
                                                                                <th className="py-1.5 px-2.5 font-semibold">Date</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold text-center">Shift Work Hours</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold text-center text-indigo-700">OT Minutes</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold text-right text-emerald-700">OT Hours Logged</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {dailyLogs.map((log, lIdx) => (
                                                                                <tr key={lIdx} className="hover:bg-gray-50">
                                                                                    <td className="py-1 px-2.5 font-mono text-gray-700">
                                                                                        {log.attendance_date ? new Date(log.attendance_date).toLocaleDateString('en-GB') : '—'}
                                                                                    </td>
                                                                                    <td className="py-1 px-2.5 text-center font-mono text-gray-600">
                                                                                        {log.total_work_hours ? `${Number(log.total_work_hours).toFixed(1)} hrs` : '—'}
                                                                                    </td>
                                                                                    <td className="py-1 px-2.5 text-center font-mono font-semibold text-indigo-700">
                                                                                        {log.overtime_minutes || 0} mins
                                                                                    </td>
                                                                                    <td className="py-1 px-2.5 text-right font-mono font-bold text-emerald-700">
                                                                                        {((log.overtime_minutes || 0) / 60).toFixed(2)} hrs
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        Formula: <code>(Monthly Gross / 30 / 8) × Schedule OT Rate × OT Hours</code>
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

