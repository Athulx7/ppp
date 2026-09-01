import React from 'react';
import { 
    User, Building, Calendar, DollarSign, CreditCard, 
    ShieldCheck, Clock, FileText, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';

export default function EmployeePayrollDetailModal({
    isOpen,
    onClose,
    employee
}) {
    if (!isOpen || !employee) return null;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            title={`Payroll Breakdown - ${employee.name} (${employee.id})`}
        >
            <div className="p-5 space-y-5">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl p-4 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-base flex items-center justify-center shadow-md">
                            {employee.name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900">{employee.name}</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                                    {employee.id}
                                </span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    employee.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {employee.status?.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {employee.designation} • {employee.department} • {employee.location}
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">Net Payout</p>
                        <p className="text-xl font-extrabold text-emerald-600">
                            ₹{employee.net_pay?.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Attendance Summary Strip */}
                <div className="grid grid-cols-4 gap-2 text-center bg-gray-50 rounded-lg p-2.5 border border-gray-200 text-xs">
                    <div>
                        <span className="text-gray-400 block text-[10px]">Working Days</span>
                        <span className="font-bold text-gray-800">{employee.working_days || 30}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-[10px]">Present</span>
                        <span className="font-bold text-emerald-600">{employee.present_days}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-[10px]">Paid Leaves</span>
                        <span className="font-bold text-blue-600">{employee.leave_days || 0}</span>
                    </div>
                    <div>
                        <span className="text-gray-400 block text-[10px]">LOP Days</span>
                        <span className="font-bold text-rose-600">{employee.lop_days || 0}</span>
                    </div>
                </div>

                {/* Earnings & Deductions Breakdown 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Earnings */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-emerald-50/60 px-3.5 py-2.5 border-b border-emerald-100 flex items-center justify-between">
                            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-emerald-600" />
                                Gross Earnings
                            </span>
                            <span className="font-extrabold text-emerald-700">
                                ₹{((employee.gross_salary || 0) + (employee.overtime_pay || 0)).toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="p-3 space-y-2 divide-y divide-gray-100">
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Basic Salary</span>
                                <span className="font-semibold text-gray-900">₹{employee.basic?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">House Rent Allowance (HRA)</span>
                                <span className="font-semibold text-gray-900">₹{employee.hra?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Conveyance Allowance</span>
                                <span className="font-semibold text-gray-900">₹{employee.conveyance?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Medical Allowance</span>
                                <span className="font-semibold text-gray-900">₹{employee.medical?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Special Allowance</span>
                                <span className="font-semibold text-gray-900">₹{employee.special?.toLocaleString('en-IN')}</span>
                            </div>
                            {employee.variable_pay > 0 && (
                                <div className="flex justify-between py-1">
                                    <span className="text-gray-600">Performance / Variable Pay</span>
                                    <span className="font-semibold text-gray-900">₹{employee.variable_pay?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            {employee.overtime_pay > 0 && (
                                <div className="flex justify-between py-1 bg-emerald-50/40 px-1 rounded">
                                    <span className="text-emerald-800 font-medium">Overtime ({employee.overtime_hours} hrs)</span>
                                    <span className="font-bold text-emerald-700">₹{employee.overtime_pay?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Deductions */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-rose-50/60 px-3.5 py-2.5 border-b border-rose-100 flex items-center justify-between">
                            <span className="font-bold text-rose-900 flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-rose-600" />
                                Total Deductions
                            </span>
                            <span className="font-extrabold text-rose-700">
                                ₹{employee.total_deductions?.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="p-3 space-y-2 divide-y divide-gray-100">
                            {employee.lop_deduction > 0 && (
                                <div className="flex justify-between py-1 bg-rose-50/40 px-1 rounded">
                                    <span className="text-rose-800 font-medium">Loss of Pay (LOP {employee.lop_days}d)</span>
                                    <span className="font-bold text-rose-700">₹{employee.lop_deduction?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Provident Fund (PF - 12%)</span>
                                <span className="font-semibold text-gray-900">₹{employee.pf?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">ESI (0.75%)</span>
                                <span className="font-semibold text-gray-900">₹{employee.esi?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Professional Tax (PT)</span>
                                <span className="font-semibold text-gray-900">₹{employee.professional_tax || 0}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span className="text-gray-600">Income Tax (TDS)</span>
                                <span className="font-semibold text-gray-900">₹{employee.tds?.toLocaleString('en-IN')}</span>
                            </div>
                            {employee.advance_recovery > 0 && (
                                <div className="flex justify-between py-1">
                                    <span className="text-purple-700">Salary Advance Recovery</span>
                                    <span className="font-semibold text-purple-900">₹{employee.advance_recovery?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            {employee.loan_recovery > 0 && (
                                <div className="flex justify-between py-1">
                                    <span className="text-purple-700">Loan Recovery EMI</span>
                                    <span className="font-semibold text-purple-900">₹{employee.loan_recovery?.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Employer Statutory Contributions */}
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs">
                    <span className="font-semibold text-gray-700 block mb-2">Employer Cost & Statutory Contributions (CTC Portion)</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-gray-600">
                        <div>Employer PF (12%): <strong className="text-gray-900">₹{employee.employer_pf?.toLocaleString('en-IN')}</strong></div>
                        <div>Employer ESI (3.25%): <strong className="text-gray-900">₹{employee.employer_esi?.toLocaleString('en-IN')}</strong></div>
                        <div>Gratuity: <strong className="text-gray-900">₹{employee.employer_gratuity?.toLocaleString('en-IN')}</strong></div>
                        <div>Total Employer Cost: <strong className="text-indigo-700">₹{employee.employer_total?.toLocaleString('en-IN')}</strong></div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow"
                    >
                        Close Breakdown
                    </button>
                </div>
            </div>
        </CommonModal>
    );
}
