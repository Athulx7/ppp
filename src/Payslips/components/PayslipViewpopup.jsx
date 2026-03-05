import React from 'react'
import { X, Download } from 'lucide-react';

function PayslipViewpopup({ selectedPayslip, closeModal, handleDownloadPayslip }) {
    return (
        <>
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar">
                    <div className="sticky top-0 bg-white border-b border-gray-300 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">Payslip - {selectedPayslip.month_name} {selectedPayslip.year}</h3>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Company Header */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-indigo-600">ACME Corp</h1>
                            <p className="text-gray-600">123 Business Park, Bangalore - 560001</p>
                            <p className="text-sm text-gray-500">GST: 29ABCDE1234F1Z5</p>
                        </div>

                        {/* Payslip Title */}
                        <div className="border-t border-b border-gray-300 py-3 mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">SALARY SLIP</h2>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Month: <span className="font-semibold">{selectedPayslip.month_name} {selectedPayslip.year}</span></p>
                                <p className="text-sm text-gray-600">Generated: {selectedPayslip.generated_date}</p>
                            </div>
                        </div>

                        {/* Employee Details */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">Employee Details</h3>
                                <p><span className="text-gray-600">Name:</span> {selectedPayslip.emp_name}</p>
                                <p><span className="text-gray-600">Employee ID:</span> {selectedPayslip.emp_code}</p>
                                <p><span className="text-gray-600">Designation:</span> {selectedPayslip.designation}</p>
                                <p><span className="text-gray-600">Department:</span> {selectedPayslip.department}</p>
                                <p><span className="text-gray-600">Grade:</span> {selectedPayslip.grade}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">Bank Details</h3>
                                <p><span className="text-gray-600">Bank Name:</span> {selectedPayslip.bank_name}</p>
                                <p><span className="text-gray-600">Account No:</span> {selectedPayslip.bank_account}</p>
                                <p><span className="text-gray-600">IFSC Code:</span> {selectedPayslip.ifsc}</p>
                                <p><span className="text-gray-600">PAN:</span> {selectedPayslip.pan}</p>
                            </div>
                        </div>

                        {/* Salary Details Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Earnings */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 font-semibold">Earnings</div>
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-300">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Basic</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.basic.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">HRA</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.hra.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Special Allowance</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.special_allowance.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Conveyance</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.conveyance.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Medical</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.medical.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">LTA</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.lta.toLocaleString()}</td>
                                        </tr>
                                        {selectedPayslip.earnings.overtime > 0 && (
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Overtime</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.overtime.toLocaleString()}</td>
                                            </tr>
                                        )}
                                        {selectedPayslip.earnings.bonus > 0 && (
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Bonus</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.bonus.toLocaleString()}</td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-4 py-2">Total Earnings</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.earnings.total_earnings.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Deductions */}
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 font-semibold">Deductions</div>
                                <table className="w-full">
                                    <tbody className="divide-y divide-gray-300">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">PF (Employee)</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.pf_employee.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Professional Tax</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.professional_tax.toLocaleString()}</td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-2">Income Tax</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.income_tax.toLocaleString()}</td>
                                        </tr>
                                        {selectedPayslip.deductions.loan_recovery > 0 && (
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-2">Loan Recovery</td>
                                                <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.loan_recovery.toLocaleString()}</td>
                                            </tr>
                                        )}
                                        <tr className="bg-gray-50 font-semibold">
                                            <td className="px-4 py-2">Total Deductions</td>
                                            <td className="px-4 py-2 text-right">₹ {selectedPayslip.deductions.total_deductions.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Employer Contributions */}
                        <div className="border border-gray-300 rounded-lg overflow-hidden mb-6">
                            <div className="bg-gray-100 px-4 py-2 font-semibold">Employer Contributions (Not deducted from salary)</div>
                            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="text-gray-600 text-sm">PF (Employer)</span>
                                    <div className="font-semibold">₹ {selectedPayslip.employer_contributions.pf_employer.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600 text-sm">Gratuity</span>
                                    <div className="font-semibold">₹ {selectedPayslip.employer_contributions.gratuity.toLocaleString()}</div>
                                </div>
                                <div>
                                    <span className="text-gray-600 text-sm">Insurance</span>
                                    <div className="font-semibold">₹ {selectedPayslip.employer_contributions.insurance.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-indigo-800 font-medium">NET PAY (Amount payable)</span>
                                    <p className="text-sm text-indigo-600">Rupees {numberToWords(selectedPayslip.net_pay)} only</p>
                                </div>
                                <div className="text-3xl font-bold text-indigo-800">
                                    ₹ {selectedPayslip.net_pay.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-xs text-gray-500 border-t border-t-gray-300 pt-4 flex justify-between">
                            <div>This is a computer generated statement, signature not required</div>
                            <div>© ACME Corp - All rights reserved</div>
                        </div>
                    </div>
                    <div className="sticky bottom-0 bg-gray-50 border-t border-t-gray-300 px-6 py-3 flex justify-end gap-3">
                        <button
                            onClick={() => handleDownloadPayslip(selectedPayslip)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

function numberToWords(num) {

    if (num === 0) return 'Zero';

    const numStr = num.toString();
    const numLength = numStr.length;

    if (numLength > 7) return num.toLocaleString();

    return num.toLocaleString() + ' Rupees';
}

export default PayslipViewpopup