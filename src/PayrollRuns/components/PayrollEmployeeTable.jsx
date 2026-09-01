import React, { useState, useMemo } from 'react';
import { 
    Search, Filter, Eye, ChevronDown, ChevronUp, CheckSquare, 
    Square, CheckCircle2, AlertCircle, Ban, RefreshCw, SlidersHorizontal, ArrowUpDown
} from 'lucide-react';

export default function PayrollEmployeeTable({
    employees,
    onToggleSelectEmployee,
    onSelectAll,
    selectAll,
    onViewDetail,
    onToggleHoldStatus
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('name');
    const [sortAsc, setSortAsc] = useState(true);

    const departments = useMemo(() => {
        return ['ALL', ...Array.from(new Set(employees.map(e => e.department).filter(Boolean)))];
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        let list = employees.filter(emp => {
            const matchesSearch = 
                emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.designation?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = selectedDept === 'ALL' || emp.department === selectedDept;
            const matchesStatus = selectedStatus === 'ALL' || emp.status === selectedStatus;
            return matchesSearch && matchesDept && matchesStatus;
        });

        // Sorting
        list.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            if (typeof valA === 'string') {
                return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return sortAsc ? (valA - valB) : (valB - valA);
        });

        return list;
    }, [employees, searchTerm, selectedDept, selectedStatus, sortField, sortAsc]);

    const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
    const paginatedEmployees = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredEmployees.slice(start, start + pageSize);
    }, [filteredEmployees, currentPage, pageSize]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        } else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            {/* Table Controls Header */}
            <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-gray-50/50">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employee, ID, title..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                        />
                    </div>

                    {/* Department Dropdown */}
                    <select
                        value={selectedDept}
                        onChange={(e) => {
                            setSelectedDept(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                        {departments.map(d => (
                            <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                        ))}
                    </select>

                    {/* Status Dropdown */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => {
                            setSelectedStatus(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="active">Active Staff</option>
                        <option value="hold">Salary On-Hold</option>
                        <option value="on_leave">On Extended Leave</option>
                        <option value="resigned">Resigned / Notice</option>
                    </select>
                </div>

                {/* Page Size & Counts */}
                <div className="flex items-center gap-3 text-xs text-gray-600 self-end md:self-center">
                    <span>Showing <strong className="text-gray-900">{filteredEmployees.length}</strong> employees</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-xs bg-white"
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </select>
                </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-gray-100/80 border-b border-gray-200 text-gray-600">
                        <tr>
                            <th className="py-3 px-3 w-10 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={onSelectAll}
                                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                />
                            </th>
                            <th 
                                onClick={() => handleSort('name')}
                                className="py-3 px-3 font-semibold cursor-pointer hover:text-indigo-600 select-none"
                            >
                                <div className="flex items-center gap-1">
                                    Employee Name & Code
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-3 px-3 font-semibold">Department & Role</th>
                            <th className="py-3 px-3 font-semibold text-center">Attendance / LOP</th>
                            <th 
                                onClick={() => handleSort('gross_salary')}
                                className="py-3 px-3 font-semibold text-right cursor-pointer hover:text-indigo-600 select-none"
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Gross Pay
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-3 px-3 font-semibold text-right text-rose-700 bg-rose-50/40">
                                LOP Deduction
                            </th>
                            <th className="py-3 px-3 font-semibold text-right text-emerald-700 bg-emerald-50/40">
                                Overtime Pay
                            </th>
                            <th className="py-3 px-3 font-semibold text-right text-purple-700 bg-purple-50/40">
                                Total Deductions
                            </th>
                            <th 
                                onClick={() => handleSort('net_pay')}
                                className="py-3 px-3 font-bold text-right text-indigo-900 bg-indigo-50/60 cursor-pointer hover:text-indigo-600 select-none"
                            >
                                <div className="flex items-center justify-end gap-1">
                                    Net Payable
                                    <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="py-3 px-3 font-semibold text-center">Status</th>
                            <th className="py-3 px-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {paginatedEmployees.length === 0 ? (
                            <tr>
                                <td colSpan={11} className="py-10 text-center text-gray-400">
                                    No employee records found matching your filters.
                                </td>
                            </tr>
                        ) : (
                            paginatedEmployees.map(emp => (
                                <tr 
                                    key={emp.id} 
                                    className={`hover:bg-indigo-50/30 transition-colors ${
                                        emp.status === 'hold' ? 'bg-amber-50/30 opacity-80' : ''
                                    } ${emp.selected ? '' : 'bg-gray-50/50 text-gray-400'}`}
                                >
                                    <td className="py-3 px-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={Boolean(emp.selected)}
                                            onChange={() => onToggleSelectEmployee(emp.id)}
                                            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                        />
                                    </td>

                                    <td className="py-3 px-3">
                                        <div className="font-semibold text-gray-900">{emp.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{emp.id}</div>
                                    </td>

                                    <td className="py-3 px-3">
                                        <div className="text-gray-800">{emp.department}</div>
                                        <div className="text-[10px] text-gray-500">{emp.designation}</div>
                                    </td>

                                    <td className="py-3 px-3 text-center">
                                        <div className="text-gray-700">
                                            <span className="font-semibold text-emerald-600">{emp.present_days}</span> / {emp.working_days || 30}d
                                        </div>
                                        {emp.lop_days > 0 ? (
                                            <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                                {emp.lop_days} LOP Days
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-gray-400">0 LOP</span>
                                        )}
                                    </td>

                                    <td className="py-3 px-3 text-right font-medium text-gray-800">
                                        ₹{emp.gross_salary?.toLocaleString('en-IN')}
                                    </td>

                                    <td className="py-3 px-3 text-right font-semibold text-rose-600 bg-rose-50/20">
                                        {emp.lop_deduction > 0 ? `₹${emp.lop_deduction.toLocaleString('en-IN')}` : '-'}
                                    </td>

                                    <td className="py-3 px-3 text-right font-semibold text-emerald-600 bg-emerald-50/20">
                                        {emp.overtime_pay > 0 ? `₹${emp.overtime_pay.toLocaleString('en-IN')}` : '-'}
                                    </td>

                                    <td className="py-3 px-3 text-right font-semibold text-purple-700 bg-purple-50/20">
                                        ₹{emp.total_deductions?.toLocaleString('en-IN')}
                                    </td>

                                    <td className="py-3 px-3 text-right font-extrabold text-indigo-900 bg-indigo-50/40">
                                        ₹{emp.net_pay?.toLocaleString('en-IN')}
                                    </td>

                                    <td className="py-3 px-3 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                            emp.status === 'active' 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : emp.status === 'hold'
                                                    ? 'bg-rose-100 text-rose-800'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {emp.status?.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="py-3 px-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => onViewDetail(emp)}
                                                className="p-1.5 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
                                                title="View Itemized Breakdown"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onToggleHoldStatus(emp.id)}
                                                className={`p-1.5 rounded-lg transition-colors ${
                                                    emp.status === 'hold'
                                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                        : 'hover:bg-rose-100 text-rose-600'
                                                }`}
                                                title={emp.status === 'hold' ? 'Release Salary' : 'Hold Salary'}
                                            >
                                                <Ban className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
                <div className="text-gray-500">
                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className="px-3 py-1 bg-white border border-gray-300 rounded text-gray-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
