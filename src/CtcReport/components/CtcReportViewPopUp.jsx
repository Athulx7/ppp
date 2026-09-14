import { DownloadCloud, X, CheckCircle2, PieChart } from 'lucide-react';
import React from 'react';

function CtcReportViewPopUp({ closePopup, selectedEmployeeData }) {
    if (!selectedEmployeeData) return null;

    const earningsList = selectedEmployeeData.earnings_list || [];
    const deductionsList = selectedEmployeeData.deductions_list || [];
    const employerList = selectedEmployeeData.employer_contributions_list || [];

    const monthlyGross = selectedEmployeeData.monthly_gross || earningsList.reduce((sum, e) => sum + (e.amount || 0), 0);
    const monthlyDeductions = deductionsList.reduce((sum, d) => sum + (d.amount || 0), 0) || (selectedEmployeeData.pf_employee || 0);
    const monthlyNet = monthlyGross - monthlyDeductions;
    const annualGross = selectedEmployeeData.annual_gross || (monthlyGross * 12);
    const annualNet = monthlyNet * 12;

    const monthlyEmployer = employerList.reduce((sum, c) => sum + (c.amount || 0), 0) ||
        ((selectedEmployeeData.pf_employer || 0) + (selectedEmployeeData.gratuity || 0) + (selectedEmployeeData.insurance || 0));
    const annualEmployer = monthlyEmployer * 12;
    const annualCTC = selectedEmployeeData.total_ctc || selectedEmployeeData.annual_ctc || (annualGross + annualEmployer);

    const grossPercent = annualCTC > 0 ? Math.round((annualGross / annualCTC) * 100) : 85;
    const employerPercent = 100 - grossPercent;

    const handleExport = () => {
        const rows = [
            ["Cost To Company (CTC) Statement"],
            ["Employee Code", selectedEmployeeData.emp_code],
            ["Employee Name", `"${selectedEmployeeData.emp_name}"`],
            ["Designation", `"${selectedEmployeeData.designation}"`],
            ["Department", `"${selectedEmployeeData.department}"`],
            ["Salary Structure", `"${selectedEmployeeData.structure_name || selectedEmployeeData.grade || ''}"`],
            ["Date of Joining", selectedEmployeeData.doj],
            [],
            ["Earnings Component", "Monthly (INR)", "Annual (INR)"],
            ...earningsList.map(e => [`"${e.component_name || e.component_code}"`, e.amount || 0, (e.amount || 0) * 12]),
            ["Total Gross Earnings", monthlyGross, annualGross],
            [],
            ["Employee Deductions", "Monthly (INR)", "Annual (INR)"],
            ...deductionsList.map(d => [`"${d.component_name || d.component_code}"`, d.amount || 0, (d.amount || 0) * 12]),
            ["Total Deductions", monthlyDeductions, monthlyDeductions * 12],
            [],
            ["Employer Contributions (Benefits)", "Monthly (INR)", "Annual (INR)"],
            ...employerList.map(c => [`"${c.component_name || c.component_code}"`, c.amount || 0, (c.amount || 0) * 12]),
            ["Total Employer Benefits", monthlyEmployer, annualEmployer],
            [],
            ["Total Annual CTC", "", annualCTC]
        ];

        const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `CTC_Statement_${selectedEmployeeData.emp_code}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto scrollbar border border-gray-200 flex flex-col justify-between">
                <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                            CTC
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">Cost to Company (CTC) Detailed Breakdown</h3>
                            <p className="text-[11px] text-gray-500 font-mono">Employee #{selectedEmployeeData.emp_code}</p>
                        </div>
                    </div>
                    <button
                        onClick={closePopup}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-slate-50 border border-indigo-100 text-gray-900 p-5 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">{selectedEmployeeData.emp_name}</h2>
                                <span className="px-3 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Mapped Structure
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                <span className="font-mono font-bold text-indigo-600">{selectedEmployeeData.emp_code}</span> &bull; {selectedEmployeeData.designation} &bull; {selectedEmployeeData.department}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                Structure: <span className="font-semibold text-gray-800">{selectedEmployeeData.structure_name || selectedEmployeeData.grade}</span> &bull; DOJ: <span className="font-mono">{selectedEmployeeData.doj || '—'}</span>
                            </p>
                        </div>

                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-gray-800 flex items-center gap-1.5">
                                <PieChart className="w-3.5 h-3.5 text-indigo-600" />
                                Compensation Distribution
                            </span>
                            <span className="text-gray-500">
                                Total Annual Cost: <strong className="text-emerald-700">₹{annualCTC.toLocaleString('en-IN')}</strong>
                            </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex">
                            <div className="bg-indigo-600 h-full" style={{ width: `${grossPercent}%` }} />
                            <div className="bg-purple-500 h-full" style={{ width: `${employerPercent}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-600">
                            <span>Direct Gross Salary: <strong>₹{annualGross.toLocaleString('en-IN')} ({grossPercent}%)</strong></span>
                            <span>Employer Benefits: <strong>₹{annualEmployer.toLocaleString('en-IN')} ({employerPercent}%)</strong></span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-800">Annual Gross Salary</div>
                            <div className="text-xl font-black text-indigo-950 mt-1">₹{annualGross.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-indigo-600 mt-0.5">₹{Math.round(monthlyGross).toLocaleString('en-IN')} / mo</div>
                        </div>
                        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-lg">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-800">Annual Employer Benefits</div>
                            <div className="text-xl font-black text-purple-950 mt-1">₹{annualEmployer.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-purple-600 mt-0.5">₹{Math.round(monthlyEmployer).toLocaleString('en-IN')} / mo</div>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Annual Net Take-Home</div>
                            <div className="text-xl font-black text-blue-950 mt-1">₹{annualNet.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-blue-600 mt-0.5">₹{Math.round(monthlyNet).toLocaleString('en-IN')} / mo</div>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-lg">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Total Annual CTC</div>
                            <div className="text-xl font-black text-emerald-950 mt-1">₹{annualCTC.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-emerald-600 mt-0.5">Full Cost To Company</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-4 py-2.5 font-bold text-gray-900 border-b border-gray-200 text-xs">
                                Monthly Earnings (From Salary Structure)
                            </div>
                            <div className="p-4">
                                <div className="space-y-2 text-xs">
                                    {earningsList.length > 0 ? (
                                        earningsList.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50">
                                                <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                                <span className="font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                            <span className="text-gray-700 font-medium">Gross Salary</span>
                                            <span className="font-semibold text-gray-900">₹{monthlyGross.toLocaleString('en-IN')}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 font-bold text-sm">
                                        <span className="text-gray-900">Total Monthly Earnings</span>
                                        <span className="text-emerald-700 font-extrabold">₹{monthlyGross.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {deductionsList.length > 0 && (
                                <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <div className="bg-gray-50 px-4 py-2.5 font-bold text-gray-900 border-b border-gray-200 text-xs">
                                        Employee Deductions (Recoveries)
                                    </div>
                                    <div className="p-4">
                                        <div className="space-y-2 text-xs">
                                            {deductionsList.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50">
                                                    <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                                    <span className="font-semibold text-rose-600">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                            <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 font-bold text-sm">
                                                <span className="text-gray-900">Total Deductions</span>
                                                <span className="text-rose-600 font-extrabold">₹{monthlyDeductions.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-4 py-2.5 font-bold text-gray-900 border-b border-gray-200 text-xs flex justify-between items-center">
                                    <span>Employer Contributions (CTC Benefits)</span>
                                    <span className="text-[10px] text-gray-400 font-normal">Paid by Company</span>
                                </div>
                                <div className="p-4">
                                    <div className="space-y-2 text-xs">
                                        {employerList.length > 0 ? (
                                            employerList.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50">
                                                    <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                                    <span className="font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <>
                                                {selectedEmployeeData.pf_employer > 0 && (
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                                        <span className="text-gray-700 font-medium">PF Employer (12%)</span>
                                                        <span className="font-semibold text-gray-900">₹{selectedEmployeeData.pf_employer.toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                                {selectedEmployeeData.gratuity > 0 && (
                                                    <div className="flex justify-between items-center py-1 border-b border-gray-50">
                                                        <span className="text-gray-700 font-medium">Gratuity (4.17%)</span>
                                                        <span className="font-semibold text-gray-900">₹{selectedEmployeeData.gratuity.toLocaleString('en-IN')}</span>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 font-bold text-sm">
                                            <span className="text-gray-900">Total Employer Benefits</span>
                                            <span className="text-purple-700 font-extrabold">₹{monthlyEmployer.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50/95 backdrop-blur border-t border-gray-200 px-6 py-3.5 flex justify-end gap-3 rounded-b-lg">
                    <button
                        onClick={closePopup}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 text-xs font-semibold transition-all shadow-sm"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-indigo-100"
                    >
                        <DownloadCloud className="w-4 h-4" />
                        Download Statement
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CtcReportViewPopUp