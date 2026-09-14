import { Download, X, Printer, ShieldCheck, Building2 } from 'lucide-react';
import React from 'react';

function PayslipViewpopup({ closePopup, closeModal, selectedPayslip, handleDownloadPayslip }) {
    const handleClose = closePopup || closeModal;
    if (!selectedPayslip) return null;

    const earningsBreakdown = selectedPayslip.earnings?.breakdown || [];
    const deductionsBreakdown = selectedPayslip.deductions?.breakdown || [];
    const employerContribs = selectedPayslip.employer_contributions || {};

    const hasOvertimeInBreakdown = earningsBreakdown.some(e => e.component_code === 'OVERTIME');
    const hasBonusInBreakdown = earningsBreakdown.some(e => e.component_code === 'BONUS');

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto scrollbar border border-gray-200 flex flex-col justify-between">
                {/* Header Bar */}
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            PPP
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Official Payslip & Compensation Certificate</h3>
                            <p className="text-[11px] text-gray-500 font-mono">Reference #{selectedPayslip.payslip_code || 'PAY-REF'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                            title="Print Payslip"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleClose}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Organization & Period Header (Light Corporate Styling) */}
                    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-slate-50 border border-indigo-100 p-5 rounded-lg text-gray-900 shadow-sm">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                                    Salary Slip for the Month of
                                </span>
                                <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-0.5">
                                    {selectedPayslip.month_name} {selectedPayslip.year}
                                </h1>
                                <p className="text-xs text-gray-500 mt-1">
                                    Finalized & Generated on {selectedPayslip.generated_date || new Date().toISOString().slice(0, 10)}
                                </p>
                            </div>
                            <div className="text-left sm:text-right bg-white border border-emerald-200 px-4 py-2.5 rounded-lg shadow-sm">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Net Take-Home Pay</span>
                                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                                    ₹{(selectedPayslip.net_pay || 0).toLocaleString('en-IN')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employee Profile Card */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs">
                        <div>
                            <span className="text-gray-400 font-medium">Employee Name</span>
                            <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedPayslip.emp_name}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">Employee Code</span>
                            <p className="font-mono font-bold text-indigo-700 text-sm mt-0.5">{selectedPayslip.emp_code}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">Department</span>
                            <p className="font-semibold text-gray-800 text-xs mt-0.5">{selectedPayslip.department || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">Designation</span>
                            <p className="font-semibold text-gray-800 text-xs mt-0.5">{selectedPayslip.designation || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">Salary Structure</span>
                            <p className="font-semibold text-gray-800 text-xs mt-0.5">{selectedPayslip.grade || 'Standard Structure'}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">Bank Account</span>
                            <p className="font-mono font-medium text-gray-800 text-xs mt-0.5">{selectedPayslip.bank_account || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">IFSC Code</span>
                            <p className="font-mono font-medium text-gray-800 text-xs mt-0.5">{selectedPayslip.ifsc || '—'}</p>
                        </div>
                        <div>
                            <span className="text-gray-400 font-medium">PAN Number</span>
                            <p className="font-mono font-medium text-gray-800 text-xs mt-0.5">{selectedPayslip.pan || '—'}</p>
                        </div>
                    </div>

                    {/* Attendance / Working Days Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/40 p-3.5 rounded-lg border border-indigo-100 text-xs">
                        <div className="text-center p-2 rounded-lg bg-white border border-indigo-100">
                            <span className="text-gray-500 font-medium">Working Days</span>
                            <div className="font-extrabold text-gray-900 text-base mt-0.5">{selectedPayslip.working_days ?? 30}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white border border-indigo-100">
                            <span className="text-gray-500 font-medium">Present Days</span>
                            <div className="font-extrabold text-emerald-700 text-base mt-0.5">{selectedPayslip.present_days ?? 0}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white border border-indigo-100">
                            <span className="text-gray-500 font-medium">Paid Leaves</span>
                            <div className="font-extrabold text-blue-700 text-base mt-0.5">{selectedPayslip.paid_leaves ?? 0}</div>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-white border border-indigo-100">
                            <span className="text-gray-500 font-medium">Loss of Pay (LOP)</span>
                            <div className="font-extrabold text-rose-600 text-base mt-0.5">{selectedPayslip.lop_days ?? 0}</div>
                        </div>
                    </div>

                    {/* Salary Breakdown: Earnings & Deductions strictly from DB */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Dynamic Earnings from Structure */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-4 py-2.5 font-bold text-gray-900 border-b border-gray-200 flex justify-between items-center text-xs">
                                <span>Earnings (Additions)</span>
                                <span className="text-[11px] font-normal text-gray-500">Structure Components</span>
                            </div>
                            <table className="w-full text-xs">
                                <tbody className="divide-y divide-gray-100">
                                    {earningsBreakdown.length > 0 ? (
                                        earningsBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/60">
                                                <td className="px-4 py-2 text-gray-700 font-medium">{item.component_name || item.component_code}</td>
                                                <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                                    ₹{(item.amount || 0).toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="hover:bg-gray-50/60">
                                            <td className="px-4 py-2 text-gray-700 font-medium">Gross Earnings</td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                                ₹{(selectedPayslip.earnings?.total_earnings || 0).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    )}

                                    {!hasOvertimeInBreakdown && (selectedPayslip.earnings?.overtime > 0) && (
                                        <tr className="hover:bg-gray-50/60">
                                            <td className="px-4 py-2 text-gray-700 font-medium">Overtime Payout</td>
                                            <td className="px-4 py-2 text-right font-semibold text-emerald-700">
                                                ₹{Number(selectedPayslip.earnings.overtime).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    )}

                                    {!hasBonusInBreakdown && (selectedPayslip.earnings?.bonus > 0) && (
                                        <tr className="hover:bg-gray-50/60">
                                            <td className="px-4 py-2 text-gray-700 font-medium">Bonus / Incentives</td>
                                            <td className="px-4 py-2 text-right font-semibold text-indigo-700">
                                                ₹{Number(selectedPayslip.earnings.bonus).toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    )}

                                    <tr className="bg-emerald-50/60 font-bold border-t border-gray-200">
                                        <td className="px-4 py-2.5 text-gray-900">Total Gross Earnings</td>
                                        <td className="px-4 py-2.5 text-right text-emerald-800 font-black">
                                            ₹{(selectedPayslip.earnings?.total_earnings || 0).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Dynamic Deductions from Structure & Payroll calculations */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-4 py-2.5 font-bold text-gray-900 border-b border-gray-200 flex justify-between items-center text-xs">
                                <span>Deductions (Recoveries)</span>
                                <span className="text-[11px] font-normal text-gray-500">Statutory & Structure</span>
                            </div>
                            <table className="w-full text-xs">
                                <tbody className="divide-y divide-gray-100">
                                    {deductionsBreakdown.length > 0 ? (
                                        deductionsBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/60">
                                                <td className="px-4 py-2 text-gray-700 font-medium">{item.component_name || item.component_code}</td>
                                                <td className="px-4 py-2 text-right font-semibold text-rose-600">
                                                    ₹{(item.amount || 0).toLocaleString('en-IN')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="hover:bg-gray-50/60">
                                            <td className="px-4 py-2 text-gray-500 italic">No deductions applied</td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-900">₹0</td>
                                        </tr>
                                    )}

                                    <tr className="bg-rose-50/60 font-bold border-t border-gray-200">
                                        <td className="px-4 py-2.5 text-gray-900">Total Deductions</td>
                                        <td className="px-4 py-2.5 text-right text-rose-700 font-black">
                                            ₹{(selectedPayslip.deductions?.total_deductions || 0).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Net Pay in Words Banner */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                                Net Payable Take-Home Salary
                            </span>
                            <p className="text-xs text-emerald-950 font-semibold mt-0.5 capitalize">
                                {inWords(selectedPayslip.net_pay || 0)} Only
                            </p>
                        </div>
                        <div className="text-2xl font-black text-emerald-900">
                            ₹{(selectedPayslip.net_pay || 0).toLocaleString('en-IN')}
                        </div>
                    </div>

                    {/* Digital Seal / Security footer */}
                    <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-400 border-t border-gray-200 pt-3 gap-2">
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Digitally verified system record &bull; No physical signature required
                        </div>
                        <div>Confidential &bull; Proprietary Payroll Document</div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur border-t border-gray-200 px-6 py-3.5 flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-xs font-semibold transition-all shadow-sm"
                    >
                        Close
                    </button>
                    {handleDownloadPayslip && (
                        <button
                            onClick={() => handleDownloadPayslip(selectedPayslip)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
                        >
                            <Download className="w-4 h-4" />
                            Download / Print Slip
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// Indian Currency Number to Words
function inWords(num) {
    if (!num || num === 0) return 'Zero Rupees';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const n = ('000000000' + Math.round(num)).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees ' : 'Rupees ';
    return str.trim();
}

export default PayslipViewpopup;