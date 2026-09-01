import React, { useState } from 'react';
import { 
    X, CalendarDays, Search, Filter, CheckCircle2, AlertTriangle, 
    Save, RefreshCw, AlertCircle, Info, Download, SlidersHorizontal 
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';

export default function LopAttendanceReviewModal({
    isOpen,
    onClose,
    employees,
    onUpdateEmployeeLop,
    onConfirmVerification
}) {
    const [search, setSearch] = useState('');
    const [lopOnly, setLopOnly] = useState(true);
    const [departmentFilter, setDepartmentFilter] = useState('ALL');

    if (!isOpen) return null;

    const departments = ['ALL', ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))];

    const filtered = employees.filter(emp => {
        const matchesSearch = 
            emp.name?.toLowerCase().includes(search.toLowerCase()) ||
            emp.id?.toLowerCase().includes(search.toLowerCase());
        const matchesLop = !lopOnly || (emp.lop_days > 0 || emp.absent_days > 0);
        const matchesDept = departmentFilter === 'ALL' || emp.department === departmentFilter;
        return matchesSearch && matchesLop && matchesDept;
    });

    const totalLopStaff = employees.filter(e => e.lop_days > 0).length;
    const totalLopDays = employees.reduce((sum, e) => sum + (e.lop_days || 0), 0);
    const totalLopAmount = employees.reduce((sum, e) => sum + (e.lop_deduction || 0), 0);

    const handleLopDayChange = (empId, newDays) => {
        const parsed = Math.max(0, Math.min(31, Number(newDays) || 0));
        onUpdateEmployeeLop(empId, parsed);
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
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                            {totalLopStaff}
                        </div>
                        <div>
                            <p className="text-xs text-amber-800 font-medium">Employees with LOP</p>
                            <p className="text-sm font-bold text-amber-950">Loss of Pay Applied</p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                            {totalLopDays}
                        </div>
                        <div>
                            <p className="text-xs text-indigo-800 font-medium">Total LOP Days</p>
                            <p className="text-sm font-bold text-indigo-950">Unapproved Absences</p>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center gap-3">
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
                        Show only employees with LOP / Absences
                    </label>
                </div>

                {/* Employee LOP Table */}
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm max-h-[380px] overflow-y-auto">
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        No employees matching current filter.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(emp => {
                                    const perDayRate = Math.round((emp.gross_salary || 0) / (emp.working_days || 30));
                                    return (
                                        <tr key={emp.id} className="hover:bg-gray-50/80 transition-colors">
                                            <td className="py-2.5 px-3">
                                                <div className="font-semibold text-gray-900">{emp.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono">{emp.id}</div>
                                            </td>
                                            <td className="py-2.5 px-3 text-gray-600">{emp.department}</td>
                                            <td className="py-2.5 px-3 text-center text-gray-600">{emp.working_days || 30}</td>
                                            <td className="py-2.5 px-3 text-center text-emerald-600 font-medium">{emp.present_days}</td>
                                            <td className="py-2.5 px-3 text-center text-blue-600 font-medium">{emp.leave_days || 0}</td>
                                            <td className="py-2.5 px-3 text-center bg-amber-50/30">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="31"
                                                    value={emp.lop_days || 0}
                                                    onChange={(e) => handleLopDayChange(emp.id, e.target.value)}
                                                    className="w-14 text-center py-1 border border-amber-300 rounded font-semibold text-amber-900 bg-amber-50/80 focus:bg-white focus:ring-1 focus:ring-amber-500"
                                                />
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-bold text-rose-600 bg-rose-50/30">
                                                ₹{(emp.lop_deduction || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
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
