import React, { useState, useEffect } from 'react';
import { 
    X, CalendarDays, Search, Filter, CheckCircle2, AlertTriangle, 
    Save, RefreshCw, AlertCircle, Info, Download, SlidersHorizontal,
    ChevronDown, ChevronUp, Clock, Check, User
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';
import { ApiCall } from '../../library/constants';

export default function LopAttendanceReviewModal({
    isOpen,
    onClose,
    employees = [],
    month,
    year,
    onUpdateEmployeeLop,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');
    const [lopOnly, setLopOnly] = useState(false);
    const [departmentFilter, setDepartmentFilter] = useState('ALL');
    const [expandedEmpId, setExpandedEmpId] = useState(null);
    const [apiData, setApiData] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editedLop, setEditedLop] = useState({});

    // Fetch live attendance and LOP inspection data from backend
    useEffect(() => {
        if (!isOpen) return;

        const fetchInspectionData = async () => {
            setLoading(true);
            try {
                const m = month || (new Date().getMonth() + 1);
                const y = year || new Date().getFullYear();
                const res = await ApiCall('get', `/payroll/inspect/attendance-lop?month=${m}&year=${y}`);
                if (res?.data?.success && res.data.data) {
                    const fetchedEmployees = res.data.data.employees || [];
                    setApiData(fetchedEmployees);
                    setSummary(res.data.data.summary || null);

                    // Initialize local edited LOP map
                    const initialLop = {};
                    fetchedEmployees.forEach(emp => {
                        initialLop[emp.employee_code] = emp.lop_days;
                    });
                    setEditedLop(initialLop);
                }
            } catch (err) {
                console.error("Failed to load attendance & LOP inspection:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInspectionData();
    }, [isOpen, month, year]);

    if (!isOpen) return null;

    // Use fetched API data if available, otherwise fallback to passed employees prop
    const displayList = apiData.length > 0 ? apiData : employees.map(e => ({
        employee_code: e.id,
        employee_name: e.name,
        department: e.department,
        designation: e.designation,
        working_days: e.working_days || 30,
        present_days: e.present_days || 0,
        half_days: 0,
        approved_leaves: e.leave_days || 0,
        lop_days: e.lop_days || 0,
        gross_salary: e.gross_salary || 0,
        per_day_rate: Math.round((e.gross_salary || 0) / (e.working_days || 30)),
        lop_deduction: e.lop_deduction || 0,
        daily_records: []
    }));

    const departments = ['ALL', ...Array.from(new Set(displayList.map(e => e.department).filter(Boolean)))];

    const filtered = displayList.filter(emp => {
        const empCode = emp.employee_code || emp.id || '';
        const empName = emp.employee_name || emp.name || '';
        const curLop = editedLop[empCode] !== undefined ? editedLop[empCode] : emp.lop_days;

        const matchesSearch = 
            empName.toLowerCase().includes(search.toLowerCase()) ||
            empCode.toLowerCase().includes(search.toLowerCase());
        const matchesLop = !lopOnly || (curLop > 0);
        const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
        return matchesSearch && matchesLop && matchesDept;
    });

    const totalLopStaff = displayList.filter(e => {
        const curLop = editedLop[e.employee_code] !== undefined ? editedLop[e.employee_code] : e.lop_days;
        return (curLop || 0) > 0;
    }).length;

    const totalLopDays = displayList.reduce((sum, e) => {
        const curLop = editedLop[e.employee_code] !== undefined ? editedLop[e.employee_code] : e.lop_days;
        return sum + (curLop || 0);
    }, 0);

    const totalLopAmount = displayList.reduce((sum, e) => {
        const curLop = editedLop[e.employee_code] !== undefined ? editedLop[e.employee_code] : e.lop_days;
        const rate = e.per_day_rate || Math.round((e.gross_salary || 0) / (e.working_days || 30));
        return sum + Math.round((curLop || 0) * rate);
    }, 0);

    const handleLopDayChange = (empCode, newDays) => {
        const parsed = Math.max(0, Math.min(31, Number(newDays) || 0));
        setEditedLop(prev => ({ ...prev, [empCode]: parsed }));
        if (onUpdateEmployeeLop) {
            onUpdateEmployeeLop(empCode, parsed);
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
            title="Loss of Pay (LOP) & Attendance Deep-Dive Review"
        >
            <div className="p-5 space-y-4">
                {/* Info & Stats Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            {totalLopStaff}
                        </div>
                        <div>
                            <p className="text-xs text-amber-800 font-medium">Employees with LOP</p>
                            <p className="text-sm font-bold text-amber-950">Loss of Pay Applied</p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {totalLopDays}
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Total LOP Days</p>
                            <p className="text-sm font-bold text-indigo-950">Unapproved Absences</p>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                            ₹
                        </div>
                        <div>
                            <p className="text-xs text-rose-800 font-medium">Total LOP Deducted</p>
                            <p className="text-sm font-bold text-rose-950">₹{totalLopAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or emp code..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        >
                            {departments.map(d => (
                                <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                            ))}
                        </select>
                    </div>

                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer self-start sm:self-center">
                        <input
                            type="checkbox"
                            checked={lopOnly}
                            onChange={(e) => setLopOnly(e.target.checked)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        />
                        Show only employees with LOP
                    </label>
                </div>

                {/* Employee LOP Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[420px] overflow-y-auto">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-2">
                            <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                            <p className="text-xs">Fetching attendance logs from tenant database...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10 text-gray-600">
                                <tr>
                                    <th className="py-2.5 px-3 font-semibold">Employee</th>
                                    <th className="py-2.5 px-3 font-semibold">Department</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Working Days</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Present</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Paid Leaves</th>
                                    <th className="py-2.5 px-3 font-semibold text-center text-amber-700 bg-amber-50/70">LOP Days</th>
                                    <th className="py-2.5 px-3 font-semibold text-right text-rose-700 bg-rose-50/70">LOP Deduction</th>
                                    <th className="py-2.5 px-3 font-semibold text-center">Punches</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-gray-400">
                                            No employees matching current filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(emp => {
                                        const code = emp.employee_code || emp.id;
                                        const currentLop = editedLop[code] !== undefined ? editedLop[code] : (emp.lop_days || 0);
                                        const perDayRate = emp.per_day_rate || Math.round((emp.gross_salary || 0) / (emp.working_days || 30));
                                        const deduction = Math.round(perDayRate * currentLop);
                                        const isExpanded = expandedEmpId === code;
                                        const dailyPunches = emp.daily_records || [];

                                        return (
                                            <React.Fragment key={code}>
                                                <tr className={`hover:bg-gray-50/80 transition-colors ${isExpanded ? 'bg-indigo-50/30' : ''}`}>
                                                    <td className="py-2.5 px-3">
                                                        <div className="font-semibold text-gray-900">{emp.employee_name || emp.name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono">{code}</div>
                                                    </td>
                                                    <td className="py-2.5 px-3 text-gray-600">{emp.department || '—'}</td>
                                                    <td className="py-2.5 px-3 text-center text-gray-600">{emp.working_days || 30}</td>
                                                    <td className="py-2.5 px-3 text-center text-emerald-600 font-medium">{emp.present_days}</td>
                                                    <td className="py-2.5 px-3 text-center text-blue-600 font-medium">{emp.approved_leaves || emp.leave_days || 0}</td>
                                                    <td className="py-2.5 px-3 text-center bg-amber-50/30">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="31"
                                                            value={currentLop}
                                                            onChange={(e) => handleLopDayChange(code, e.target.value)}
                                                            className="w-14 text-center py-1 border border-amber-300 rounded font-semibold text-amber-900 bg-amber-50/80 focus:bg-white focus:ring-1 focus:ring-amber-500"
                                                        />
                                                    </td>
                                                    <td className="py-2.5 px-3 text-right font-bold text-rose-600 bg-rose-50/30">
                                                        ₹{deduction.toLocaleString('en-IN')}
                                                    </td>
                                                    <td className="py-2.5 px-3 text-center">
                                                        {dailyPunches.length > 0 ? (
                                                            <button
                                                                onClick={() => toggleExpand(code)}
                                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[11px] font-medium flex items-center gap-1 mx-auto"
                                                            >
                                                                {dailyPunches.length} Logs
                                                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] text-gray-400">No logs</span>
                                                        )}
                                                    </td>
                                                </tr>

                                                {/* Expanded Daily Punches Drill-Down */}
                                                {isExpanded && dailyPunches.length > 0 && (
                                                    <tr className="bg-gray-50/60">
                                                        <td colSpan={8} className="p-3">
                                                            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-inner">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                                                                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                                                        Daily Attendance Punches for {emp.employee_name || emp.name} ({code})
                                                                    </span>
                                                                    <span className="text-[11px] text-gray-500">
                                                                        Per-Day Salary Rate: <strong>₹{perDayRate.toLocaleString('en-IN')}</strong>
                                                                    </span>
                                                                </div>

                                                                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded">
                                                                    <table className="w-full text-[11px] text-left">
                                                                        <thead className="bg-gray-100 text-gray-600 sticky top-0">
                                                                            <tr>
                                                                                <th className="py-1.5 px-2.5 font-semibold">Date</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold">Status</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold">Punch In</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold">Punch Out</th>
                                                                                <th className="py-1.5 px-2.5 font-semibold text-right">Work Hours</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {dailyPunches.map((punch, pIdx) => {
                                                                                const isAbsent = punch.status?.toLowerCase() === 'absent' || punch.status?.toLowerCase() === 'lop';
                                                                                return (
                                                                                    <tr key={pIdx} className={isAbsent ? 'bg-rose-50/40' : 'hover:bg-gray-50'}>
                                                                                        <td className="py-1 px-2.5 font-mono text-gray-700">
                                                                                            {punch.attendance_date ? new Date(punch.attendance_date).toLocaleDateString('en-GB') : '—'}
                                                                                        </td>
                                                                                        <td className="py-1 px-2.5 font-semibold">
                                                                                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                                                                                                punch.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                                                                                                punch.status === 'half_day' ? 'bg-amber-100 text-amber-800' :
                                                                                                punch.status === 'leave' ? 'bg-blue-100 text-blue-800' :
                                                                                                'bg-rose-100 text-rose-800'
                                                                                            }`}>
                                                                                                {punch.status || 'absent'}
                                                                                            </span>
                                                                                        </td>
                                                                                        <td className="py-1 px-2.5 font-mono text-gray-600">
                                                                                            {punch.punch_in ? new Date(punch.punch_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                                                        </td>
                                                                                        <td className="py-1 px-2.5 font-mono text-gray-600">
                                                                                            {punch.punch_out ? new Date(punch.punch_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                                                                                        </td>
                                                                                        <td className="py-1 px-2.5 text-right font-mono text-gray-700">
                                                                                            {punch.total_work_hours ? `${Number(punch.total_work_hours).toFixed(1)} hrs` : '0.0 hrs'}
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })}
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

                {/* Footer buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-500" />
                        Formula: <code>(Gross Salary / Working Days) × LOP Days</code>
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
                            Confirm LOP & Mark Verified
                        </button>
                    </div>
                </div>
            </div>
        </CommonModal>
    );
}

