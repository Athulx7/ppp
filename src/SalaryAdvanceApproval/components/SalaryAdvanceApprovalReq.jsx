import { ChevronRight, CheckCircle, Loader, XCircle, CreditCard, ThumbsDown, ThumbsUp, Wallet } from 'lucide-react';
import React from 'react'

function SalaryAdvanceApprovalReq({ filteredRequests, handleViewDetails,
    handleApprove, handleReject, handleDisburse
}) {
    const StatusBadge = ({ status }) => {
        const config = {
            'approved': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Approved' },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Loader, label: 'Pending' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
            'disbursed': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CreditCard, label: 'Disbursed' }
        };
        const cfg = config[status] || config.pending;
        const Icon = cfg.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.bg} ${cfg.text}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}
            </span>
        );
    };
    return (
        <>
            <div className="p-3 md:p-4">
                {filteredRequests.length === 0 ? (
                    <div className="text-center py-8">
                        <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No salary advance requests found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredRequests.map(request => (
                            <div
                                key={request.id}
                                className="border border-gray-300 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleViewDetails(request)}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${request.status === 'approved' ? 'bg-green-100' :
                                            request.status === 'pending' ? 'bg-yellow-100' :
                                                request.status === 'rejected' ? 'bg-red-100' :
                                                    'bg-blue-100'
                                            }`}>
                                            <Wallet className={`w-4 h-4 ${request.status === 'approved' ? 'text-green-600' :
                                                request.status === 'pending' ? 'text-yellow-600' :
                                                    request.status === 'rejected' ? 'text-red-600' :
                                                        'text-blue-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{request.emp_name}</span>
                                                <span className="text-xs text-gray-500">{request.emp_code}</span>
                                                <StatusBadge status={request.status} />
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{request.department} • {request.designation}</p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{request.purpose}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 ml-9 lg:ml-0">
                                        <div className="text-right">
                                            <p className="font-semibold text-indigo-600">₹{request.amount.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">{request.tenure} months</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">Monthly: ₹{request.monthly_deduction}</p>
                                            <p className="text-xs text-gray-500">Requested: {request.request_date}</p>
                                        </div>

                                        {request.status === 'pending' && (
                                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleApprove(request)}
                                                    className="cursor-pointer p-1.5 text-green-600 hover:bg-green-50 rounded-md"
                                                    title="Approve"
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleReject(request)}
                                                    className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                                    title="Reject"
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        {request.status === 'approved' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDisburse(request);
                                                }}
                                                className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 flex items-center gap-1"
                                            >
                                                <CreditCard className="w-3 h-3" />
                                                Disburse
                                            </button>
                                        )}

                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default SalaryAdvanceApprovalReq