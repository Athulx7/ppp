import { DownloadCloud, X } from 'lucide-react';
import React from 'react'

function CtcReportViewPopUp({ closePopup, selectedEmployeeData }) {
    return (
        <><div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-2 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Employee CTC Details</h3>
                    <button
                        onClick={closePopup}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-b-gray-300">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{selectedEmployeeData.emp_name}</h2>
                            <p className="text-gray-600">{selectedEmployeeData.emp_code} | {selectedEmployeeData.designation}</p>
                            <p className="text-sm text-gray-500">{selectedEmployeeData.department} • {selectedEmployeeData.grade}</p>
                        </div>

                        <button
                            onClick={() => alert('exporting')}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1"
                        >
                            <DownloadCloud className="w-4 h-4" />
                            Export
                        </button>
                    </div>

                    {(() => {
                        const monthlyGross = selectedEmployeeData.basic_salary + selectedEmployeeData.hra +
                            selectedEmployeeData.special_allowance + selectedEmployeeData.conveyance +
                            selectedEmployeeData.medical + selectedEmployeeData.lta;
                        const monthlyDeductions = selectedEmployeeData.pf_employee || 0;
                        const monthlyNet = monthlyGross - monthlyDeductions;
                        const annualGross = monthlyGross * 12;
                        const annualNet = monthlyNet * 12;
                        const annualCTC = selectedEmployeeData.total_ctc;

                        return (
                            <>
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Annual Summary</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500">Annual Gross Salary</div>
                                            <div className="text-xl font-bold text-gray-900">₹{annualGross.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-sm text-gray-500">Annual Employer Contributions</div>
                                            <div className="text-xl font-bold text-gray-900">₹{(selectedEmployeeData.pf_employer * 12).toLocaleString()}</div>
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
                                                    <span className="font-medium">₹{selectedEmployeeData.overtime?.toLocaleString() || '0'}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">BASIC</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.basic_salary.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">HRA</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.hra.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Special Allowance</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.special_allowance.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Conveyance</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.conveyance.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">Medical</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.medical.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600">LTA</span>
                                                    <span className="font-medium">₹{selectedEmployeeData.lta.toLocaleString()}</span>
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
                                                    <span className="font-medium">₹{selectedEmployeeData.pf_employee?.toLocaleString() || '0'}</span>
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
                                                {selectedEmployeeData.pf_employer > 0 || selectedEmployeeData.gratuity > 0 || selectedEmployeeData.insurance > 0 ? (
                                                    <div className="space-y-3">
                                                        {selectedEmployeeData.pf_employer > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">PF Employer</span>
                                                                <span className="font-medium">₹{selectedEmployeeData.pf_employer.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {selectedEmployeeData.gratuity > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Gratuity</span>
                                                                <span className="font-medium">₹{selectedEmployeeData.gratuity.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        {selectedEmployeeData.insurance > 0 && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-gray-600">Insurance</span>
                                                                <span className="font-medium">₹{selectedEmployeeData.insurance.toLocaleString()}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex justify-between items-center pt-3 border-t border-t-gray-300 font-semibold">
                                                            <span className="text-gray-900">Total Employer Contributions</span>
                                                            <span className="text-gray-900">₹{(selectedEmployeeData.pf_employer + selectedEmployeeData.gratuity + selectedEmployeeData.insurance).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No employer contributions</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })()}
                </div>
            </div>
        </div>

        </>
    )
}

export default CtcReportViewPopUp