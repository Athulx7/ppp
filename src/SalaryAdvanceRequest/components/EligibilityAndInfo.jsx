import { ChevronRight, CreditCard, Edit, HelpCircle, History, Info, ShieldCheck, Wallet, AlertCircle } from 'lucide-react'
import React from 'react'
import StatusBadge from '../../MyCalendar/components/StatusBadge';

function EligibilityAndInfo({ eligibilityStatus, eligibility,
    existingRequests, setSelectedRequest, setShowDetailsModal
}) {
    return (
        <>
            <div className="space-y-4">
                <div className="bg-white rounded-md shadow-sm p-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        Eligibility Status
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Eligibility:</span>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${eligibilityStatus.color === 'green' ? 'bg-green-100 text-green-800' :
                                eligibilityStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                {eligibilityStatus.text}
                            </span>
                        </div>

                        {eligibility.eligibility_message && !eligibility.is_eligible && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-semibold block mb-0.5 text-red-900">Ineligibility Reason:</span>
                                    <span className="text-red-700 leading-relaxed">{eligibility.eligibility_message}</span>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600">Used: ₹{(eligibility.used_advances || 0).toLocaleString()}</span>
                                <span className="text-gray-600">Remaining: ₹{(eligibility.remaining_limit || 0).toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 rounded-full h-2"
                                    style={{
                                        width: `${((eligibility.used_advances || 0) / (eligibility.max_eligible_amount || 1)) * 100}%`
                                    }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Max Limit: ₹{(eligibility.max_eligible_amount || 0).toLocaleString()}
                            </p>
                        </div>

                        <div className="border-t pt-3 mt-2">
                            <div className="flex items-start gap-2 text-xs">
                                <Info className="w-3 h-3 text-gray-400 mt-0.5" />
                                <p className="text-gray-600">
                                    Salary advance is interest-free. The amount will be deducted from your salary in {(eligibility.tenure_options || []).join('/')} monthly installments.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 bg-white rounded-md shadow-sm p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" />
                        Your Salary Advance Requests
                    </h3>

                    {existingRequests.length === 0 ? (
                        <div className="text-center py-8">
                            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No salary advance requests found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {existingRequests.map(request => (
                                <div
                                    key={request.id}
                                    className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => {
                                        setSelectedRequest(request);
                                        setShowDetailsModal(true);
                                    }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            <div className={`shrink-0 p-2 rounded-lg ${request.status === 'approved' ? 'bg-green-100' :
                                                request.status === 'pending' ? 'bg-yellow-100' :
                                                    request.status === 'rejected' ? 'bg-red-100' :
                                                        request.status === 'completed' ? 'bg-blue-100' :
                                                            'bg-gray-100'
                                                }`}>
                                                <Wallet className={`w-4 h-4 ${request.status === 'approved' ? 'text-green-600' :
                                                    request.status === 'pending' ? 'text-yellow-600' :
                                                        request.status === 'rejected' ? 'text-red-600' :
                                                            request.status === 'completed' ? 'text-blue-600' :
                                                                'text-gray-600'
                                                    }`} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-medium">{request.id}</span>
                                                    <StatusBadge status={request.status} />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1 truncate">
                                                    Requested: {request.request_date} • Purpose: {request.purpose}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6 pl-9 sm:pl-0">
                                            <div className="text-left sm:text-right">
                                                <p className="font-semibold">₹{request.amount.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">{request.tenure} months</p>
                                            </div>
                                            <div className="text-left sm:text-right">
                                                <p className="text-sm">Monthly: ₹{request.monthly_deduction}</p>
                                                <p className="text-xs text-gray-500">Balance: ₹{request.remaining_balance}</p>
                                            </div>
                                            <ChevronRight className="hidden sm:block w-4 h-4 text-gray-400 shrink-0" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-blue-50 rounded-md p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
                        <HelpCircle className="w-4 h-4" />
                        Quick Tips
                    </h4>
                    <ul className="space-y-2 text-xs text-blue-800">
                        <li className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                            <span>Maximum advance is 2 months of your basic salary</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                            <span>Choose longer tenure for lower monthly deductions</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                            <span>Processing takes 2-3 working days after approval</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1 h-1 bg-blue-800 rounded-full mt-1.5"></div>
                            <span>You can track request status in the list below</span>
                        </li>
                    </ul>
                </div>
            </div>

        </>
    )
}

export default EligibilityAndInfo