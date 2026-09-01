import React from 'react';
import { 
    CheckCircle2, Download, FileSpreadsheet, FileText, Send, 
    Printer, ArrowLeft, Eye, ShieldCheck, Sparkles, Building2, Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasePath } from '../../library/constants';

export default function PayrollSuccessView({
    runResult,
    onResetToNewRun
}) {
    const navigate = useNavigate();
    const basePath = getRoleBasePath();

    return (
        <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
            {/* Main Success Hero Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white text-center shadow-xl relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 text-emerald-300 mx-auto flex items-center justify-center mb-4 shadow-inner">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Payroll Successfully Finalized & Locked
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Payroll Run Finalized for {runResult.periodName || 'Selected Month'}
                </h2>
                <p className="text-xs sm:text-sm text-emerald-200/90 mt-2 max-w-xl mx-auto">
                    All LOP deductions, attendance adjustments, statutory compliance calculations, and employee payslips have been safely committed to the tenant database.
                </p>

                {/* KPI Highlight Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-left">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Run Batch ID</span>
                        <span className="text-sm font-mono font-bold text-white">{runResult.run_id}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Processed Staff</span>
                        <span className="text-sm font-bold text-white">{runResult.employee_count} Employees</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Total Net Payout</span>
                        <span className="text-sm font-bold text-emerald-300">₹{(runResult.total_net || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Disbursement Date</span>
                        <span className="text-sm font-bold text-white">{runResult.payment_date}</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bank Disbursement file */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Bank Disbursement File</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Download direct bank payment format (NEFT/RTGS batch file with IFSC & Account Numbers).
                        </p>
                    </div>
                    <button
                        onClick={() => alert('Downloading Bank Payout Sheet (CSV/Excel)...')}
                        className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        Download Bank Sheet (.XLSX)
                    </button>
                </div>

                {/* Payslips module redirect */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">Publish & View Payslips</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Make payslips visible in Employee Self Service (ESS) portal and send email alerts.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`${basePath}/payslip`)}
                        className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <Eye className="w-4 h-4" />
                        Go to Payslips Module
                    </button>
                </div>

                {/* Audit & CTC Reports */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">CTC & Statutory Reports</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            Generate PF ECR, ESI return sheets, and complete department-wise CTC reports.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate(`${basePath}/ctcreport`)}
                        className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <FileText className="w-4 h-4" />
                        View CTC & Tax Reports
                    </button>
                </div>
            </div>

            {/* Back or Start New Run Button */}
            <div className="flex justify-center pt-4">
                <button
                    onClick={onResetToNewRun}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-gray-300"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Configure Another Payroll Period
                </button>
            </div>
        </div>
    );
}
