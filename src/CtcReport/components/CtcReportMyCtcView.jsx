import React from 'react';
import { DownloadCloud, Shield, CheckCircle2, Award, PieChart, DollarSign, Briefcase, FileSpreadsheet } from 'lucide-react';

function CtcReportMyCtcView({ ctcData, currentUser }) {
    const myData = ctcData?.find(emp => emp.emp_code === currentUser?.user_id)
        || (ctcData?.length === 1 ? ctcData[0] : null);

    if (!myData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <Shield className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Salary Structure Assigned</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6 text-xs leading-relaxed">
                    Your CTC (Cost to Company) breakdown can only be calculated once an active salary structure is assigned to your employee profile. Please contact HR or your Administrator to configure your structure.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                    <span>Employee Code:</span>
                    <span className="font-mono font-bold text-indigo-600">{currentUser?.user_id || 'N/A'}</span>
                </div>
            </div>
        );
    }

    const earningsList = myData.earnings_list || [];
    const deductionsList = myData.deductions_list || [];
    const employerList = myData.employer_contributions_list || [];

    const monthlyGross = myData.monthly_gross || earningsList.reduce((sum, e) => sum + (e.amount || 0), 0);
    const monthlyDeductions = deductionsList.reduce((sum, d) => sum + (d.amount || 0), 0) || (myData.pf_employee || 0);
    const monthlyNet = monthlyGross - monthlyDeductions;
    const annualGross = myData.annual_gross || (monthlyGross * 12);
    const annualNet = monthlyNet * 12;

    const monthlyEmployer = employerList.reduce((sum, c) => sum + (c.amount || 0), 0) ||
        ((myData.pf_employer || 0) + (myData.gratuity || 0) + (myData.insurance || 0));
    const annualEmployer = monthlyEmployer * 12;
    const annualCTC = myData.total_ctc || myData.annual_ctc || (annualGross + annualEmployer);

    const grossPercent = annualCTC > 0 ? Math.round((annualGross / annualCTC) * 100) : 85;
    const employerPercent = 100 - grossPercent;

    const handleExport = () => {
        const rows = [
            ["Cost To Company (CTC) Statement"],
            ["Employee Code", myData.emp_code],
            ["Employee Name", `"${myData.emp_name}"`],
            ["Designation", `"${myData.designation}"`],
            ["Department", `"${myData.department}"`],
            ["Salary Structure", `"${myData.structure_name || myData.grade || ''}"`],
            ["Date of Joining", myData.doj],
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
        link.setAttribute("download", `CTC_Statement_${myData.emp_code}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">{myData.emp_name}</h2>
                        <span className="px-3 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mapped Structure
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                        <span className="font-mono font-bold text-indigo-600">{myData.emp_code}</span> &bull; {myData.designation} &bull; {myData.department}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                        Structure: <span className="font-semibold text-gray-800">{myData.structure_name || myData.grade}</span> &bull; Joined: <span className="font-mono">{myData.doj || '—'}</span>
                    </p>
                </div>

                <button
                    onClick={handleExport}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm shrink-0"
                >
                    <DownloadCloud className="w-4 h-4" />
                    Export CTC Statement (CSV)
                </button>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <PieChart className="w-4 h-4 text-indigo-600" />
                            Cost to Company (CTC) Distribution
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Visual breakdown between direct gross salary and employer statutory contributions.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs text-gray-500">Total Annual CTC:</span>
                        <div className="text-xl font-black text-emerald-700">₹{annualCTC.toLocaleString('en-IN')}</div>
                    </div>
                </div>

                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div 
                        className="bg-indigo-600 h-full transition-all duration-500" 
                        style={{ width: `${grossPercent}%` }} 
                        title={`Gross Salary: ${grossPercent}%`} 
                    />
                    <div 
                        className="bg-purple-500 h-full transition-all duration-500" 
                        style={{ width: `${employerPercent}%` }} 
                        title={`Employer Benefits: ${employerPercent}%`} 
                    />
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                        <span className="text-gray-700 font-medium">Direct Gross Salary:</span>
                        <span className="font-bold text-gray-900">₹{annualGross.toLocaleString('en-IN')} ({grossPercent}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                        <span className="text-gray-700 font-medium">Employer Benefits (PF/Gratuity/ESIC):</span>
                        <span className="font-bold text-gray-900">₹{annualEmployer.toLocaleString('en-IN')} ({employerPercent}%)</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-800">Annual Gross Salary</span>
                    <div className="text-2xl font-black text-indigo-950 mt-1">₹{annualGross.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-indigo-600 mt-0.5">₹{Math.round(monthlyGross).toLocaleString('en-IN')} / month</div>
                </div>

                <div className="bg-purple-50/50 border border-purple-100 rounded-lg p-4 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-800">Annual Employer Perks</span>
                    <div className="text-2xl font-black text-purple-950 mt-1">₹{annualEmployer.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-purple-600 mt-0.5">₹{Math.round(monthlyEmployer).toLocaleString('en-IN')} / month</div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">Annual Net Take-Home</span>
                    <div className="text-2xl font-black text-blue-950 mt-1">₹{annualNet.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-blue-600 mt-0.5">₹{Math.round(monthlyNet).toLocaleString('en-IN')} / month</div>
                </div>

                <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Total Annual CTC</span>
                    <div className="text-2xl font-black text-emerald-950 mt-1">₹{annualCTC.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-emerald-600 mt-0.5">Full Cost To Company</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className="bg-gray-50/90 px-5 py-3 border-b border-gray-200 flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-900">Monthly Earnings (Gross)</span>
                        <span className="text-gray-500 font-mono">Structure: {myData.structure_code || 'STD'}</span>
                    </div>
                    <div className="p-5">
                        <div className="space-y-2.5 text-xs">
                            {earningsList.length > 0 ? (
                                earningsList.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                        <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                        <span className="font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                    <span className="text-gray-700 font-medium">Base Salary</span>
                                    <span className="font-semibold text-gray-900">₹{monthlyGross.toLocaleString('en-IN')}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm font-bold">
                                <span className="text-gray-900">Total Monthly Earnings</span>
                                <span className="text-emerald-700 font-extrabold">₹{monthlyGross.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {deductionsList.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                            <div className="bg-gray-50/90 px-5 py-3 border-b border-gray-200 text-xs font-bold text-gray-900">
                                Employee Deductions (Recoveries)
                            </div>
                            <div className="p-5">
                                <div className="space-y-2.5 text-xs">
                                    {deductionsList.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                            <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                            <span className="font-semibold text-rose-600">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm font-bold">
                                        <span className="text-gray-900">Total Monthly Deductions</span>
                                        <span className="text-rose-600 font-extrabold">₹{monthlyDeductions.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                        <div className="bg-gray-50/90 px-5 py-3 border-b border-gray-200 text-xs flex justify-between items-center">
                            <span className="font-bold text-gray-900">Employer Contributions (CTC Benefits)</span>
                            <span className="text-gray-400 font-normal">Paid by company</span>
                        </div>
                        <div className="p-5">
                            <div className="space-y-2.5 text-xs">
                                {employerList.length > 0 ? (
                                    employerList.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                            <span className="text-gray-700 font-medium">{item.component_name || item.component_code}</span>
                                            <span className="font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        {myData.pf_employer > 0 && (
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                <span className="text-gray-700 font-medium">PF Employer Contribution</span>
                                                <span className="font-semibold text-gray-900">₹{myData.pf_employer.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                        {myData.gratuity > 0 && (
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
                                                <span className="text-gray-700 font-medium">Gratuity Accrual</span>
                                                <span className="font-semibold text-gray-900">₹{myData.gratuity.toLocaleString('en-IN')}</span>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div className="flex justify-between items-center pt-3 border-t border-gray-200 text-sm font-bold">
                                    <span className="text-gray-900">Total Employer Benefits</span>
                                    <span className="text-purple-700 font-extrabold">₹{monthlyEmployer.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CtcReportMyCtcView