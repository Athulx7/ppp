import { DownloadCloud } from 'lucide-react'
import React from 'react'

function CtcReportMyCtcView({ ctcData, currentUser }) {
    const myData = ctcData.find(emp => emp.emp_code === currentUser.user_id);
    if (!myData) return null;

    const monthlyGross = myData.basic_salary + myData.hra + myData.special_allowance +
        myData.conveyance + myData.medical + myData.lta;
    const monthlyDeductions = myData.pf_employee || 0;
    const monthlyNet = monthlyGross - monthlyDeductions;
    const annualGross = monthlyGross * 12;
    const annualNet = monthlyNet * 12;
    const annualCTC = myData.total_ctc;
    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-b-gray-300">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{myData.emp_name}</h2>
                        <p className="text-gray-600">{myData.emp_code} | {myData.designation}</p>
                        <p className="text-sm text-gray-500">{myData.department} • {myData.grade}</p>
                    </div>

                    <button
                        onClick={() => console.log('exporting')}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                    >
                        <DownloadCloud className="w-4 h-4" />
                        Export
                    </button>
                </div>

                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Gross Salary</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualGross.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Employer Contributions</div>
                            <div className="text-xl font-bold text-gray-900">₹{(myData.pf_employer * 12).toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual Net Salary</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualNet.toLocaleString()}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Annual CTC</div>
                            <div className="text-xl font-bold text-gray-900">₹{annualCTC.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-semibold text-gray-900">Earnings</h4>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">OVERTIME</span>
                                    <span className="font-medium">₹{myData.overtime?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">BASIC</span>
                                    <span className="font-medium">₹{myData.basic_salary.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">HRA</span>
                                    <span className="font-medium">₹{myData.hra.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Special Allowance</span>
                                    <span className="font-medium">₹{myData.special_allowance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Conveyance</span>
                                    <span className="font-medium">₹{myData.conveyance.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Medical</span>
                                    <span className="font-medium">₹{myData.medical.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">LTA</span>
                                    <span className="font-medium">₹{myData.lta.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                    <span className="text-gray-900">Total Earnings</span>
                                    <span className="text-gray-900">₹{monthlyGross.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-semibold text-gray-900">Deductions</h4>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">PF Employee</span>
                                    <span className="font-medium">₹{myData.pf_employee?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                    <span className="text-gray-900">Total Deductions</span>
                                    <span className="text-gray-900">₹{monthlyDeductions.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-t-gray-300">
                            <div className="bg-gray-50 px-4 py-3">
                                <h4 className="font-semibold text-gray-900">Employer Contributions</h4>
                                <p className="text-xs text-gray-500 mt-1">Not shown on payslip, included in CTC</p>
                            </div>
                            <div className="p-4">
                                {myData.pf_employer > 0 || myData.gratuity > 0 || myData.insurance > 0 ? (
                                    <div className="space-y-3">
                                        {myData.pf_employer > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">PF Employer</span>
                                                <span className="font-medium">₹{myData.pf_employer.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {myData.gratuity > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Gratuity</span>
                                                <span className="font-medium">₹{myData.gratuity.toLocaleString()}</span>
                                            </div>
                                        )}
                                        {myData.insurance > 0 && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Insurance</span>
                                                <span className="font-medium">₹{myData.insurance.toLocaleString()}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                            <span className="text-gray-900">Total Employer Contributions</span>
                                            <span className="text-gray-900">₹{(myData.pf_employer + myData.gratuity + myData.insurance).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">No employer contributions</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CtcReportMyCtcView