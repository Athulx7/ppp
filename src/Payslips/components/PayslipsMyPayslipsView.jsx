import React from 'react'
import { Download, Eye } from 'lucide-react'

function PayslipsMyPayslipsView({ payslipData, currentUser, handleViewPayslip }) {
    const myPayslips = payslipData
        .filter(p => p.emp_code === currentUser.user_id)
        .sort((a, b) => b.year - a.year || b.month - a.month);

    return (
        <>
            <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">My Payslips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto scrollbar pr-1">
                        {myPayslips.map(payslip => (
                            <div key={payslip.id} className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-lg font-semibold text-gray-900">
                                            {payslip.month_name} {payslip.year}
                                        </div>
                                        <div className="text-sm text-gray-500">Generated: {payslip.generated_date}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${payslip.status === 'generated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {payslip.status === 'generated' ? 'Draft' : 'Processed'}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gross Pay:</span>
                                        <span className="font-medium">₹ {payslip.earnings.total_earnings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Deductions:</span>
                                        <span className="font-medium text-red-600">- ₹ {payslip.deductions.total_deductions.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-t-gray-300">
                                        <span className="font-semibold">Net Pay:</span>
                                        <span className="font-bold text-green-600">₹ {payslip.net_pay.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewPayslip(payslip)}
                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => alert('exporting pdf')}
                                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1"
                                    >
                                        <Download className="w-3 h-3" />
                                        PDF
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PayslipsMyPayslipsView