import React from 'react';
import { Download, Eye, Calendar, DollarSign, ArrowUpRight, FileCheck, CheckCircle2 } from 'lucide-react';

function PayslipsMyPayslipsView({ payslipData = [], currentUser, handleViewPayslip }) {
    const myPayslips = payslipData
        .filter(p => !currentUser?.user_id || p.emp_code === currentUser.user_id)
        .sort((a, b) => b.year - a.year || b.month - a.month)

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <FileCheck className="w-5 h-5 text-indigo-600" />
                            My Payslips & Monthly Pay Statements
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Access official compensation slips, verified earnings breakdowns, and tax deduction certificates.
                        </p>
                    </div>

                    {myPayslips.length > 0 && (
                        <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Latest: {myPayslips[0].month_name} {myPayslips[0].year}
                        </div>
                    )}
                </div>

                {myPayslips.length === 0 ? (
                    <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Calendar className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-gray-800">No Payslips Generated Yet</h3>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
                            Payslips will appear here as soon as HR or payroll runs are calculated and finalized for your account ({currentUser?.user_id || 'Staff'}).
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {myPayslips.map(payslip => {
                            const gross = payslip.earnings?.total_earnings || 0;
                            const deductions = payslip.deductions?.total_deductions || 0;
                            const net = payslip.net_pay || 0;

                            return (
                                <div 
                                    key={payslip.id} 
                                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                                >
                                    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-slate-50 border-b border-indigo-100 p-4 text-gray-900">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-bold tracking-widest uppercase text-indigo-700">
                                                    Salary Slip
                                                </span>
                                                <h3 className="text-lg font-extrabold text-gray-900 mt-0.5">
                                                    {payslip.month_name} {payslip.year}
                                                </h3>
                                            </div>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                                                payslip.status === 'generated' 
                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                                                    : 'bg-blue-100 text-blue-800 border-blue-300'
                                            }`}>
                                                {payslip.status === 'generated' ? 'Finalized' : 'Processed'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-gray-600 mt-3 pt-2 border-t border-indigo-100/60">
                                            <span>Generated: {payslip.generated_date || 'Current Cycle'}</span>
                                            <span className="font-mono font-semibold text-indigo-700">{payslip.emp_code}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Gross Earnings:</span>
                                            <span className="font-semibold text-gray-900">₹{gross.toLocaleString('en-IN')}</span>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-600">
                                            <span>Total Deductions:</span>
                                            <span className="font-semibold text-rose-600">-₹{deductions.toLocaleString('en-IN')}</span>
                                        </div>

                                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-3 flex items-center justify-between mt-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                                    Net Take-Home Pay
                                                </p>
                                                <p className="text-xl font-black text-emerald-950 mt-0.5">
                                                    ₹{net.toLocaleString('en-IN')}
                                                </p>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                ₹
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleViewPayslip(payslip)}
                                            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => handleViewPayslip(payslip)}
                                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Print / PDF
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PayslipsMyPayslipsView