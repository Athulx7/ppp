import { Download, FileText, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import React from 'react'
import StatusBadge from '../../MyCalendar/components/StatusBadge';

function LeaveApprovalDetailModal({ setShowDetailsModal, selectedRequest, handleApprove, handleReject }) {
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Leave Request Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <XCircle className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <StatusBadge status={selectedRequest.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Request ID</p>
                                <p className="font-medium">{selectedRequest.id}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Applied On</p>
                                <p className="font-medium">{selectedRequest.applied_on}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Employee</p>
                                <p className="font-medium">{selectedRequest.emp_name}</p>
                                <p className="text-xs text-gray-500">{selectedRequest.emp_code}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Department</p>
                                <p className="font-medium">{selectedRequest.department}</p>
                                <p className="text-xs text-gray-500">{selectedRequest.designation}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Leave Type</p>
                                <p className="font-medium">{selectedRequest.leave_name}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-medium">{selectedRequest.days} days</p>
                                <p className="text-xs text-gray-500">{selectedRequest.from_date} to {selectedRequest.to_date}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Reporting Manager</p>
                                <p className="font-medium">{selectedRequest.reporting_manager}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Contact Number</p>
                                <p className="font-medium">{selectedRequest.contact_number}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Reason for Leave</h4>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">{selectedRequest.reason}</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Address During Leave</h4>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm">{selectedRequest.address}</p>
                            </div>
                        </div>

                        {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Attached Documents</h4>
                                <div className="space-y-2">
                                    {selectedRequest.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                            <FileText className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm">{doc}</span>
                                            <button className="ml-auto text-indigo-600 hover:text-indigo-800">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(selectedRequest.approved_by || selectedRequest.rejected_by) && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    {selectedRequest.status === 'approved' ? 'Approval' : 'Rejection'} Details
                                </h4>
                                <p className="text-sm">
                                    <span className="font-medium">
                                        {selectedRequest.status === 'approved' ? 'Approved by:' : 'Rejected by:'}
                                    </span>{' '}
                                    {selectedRequest.approved_by || selectedRequest.rejected_by}
                                </p>
                                <p className="text-sm">
                                    <span className="font-medium">Date:</span>{' '}
                                    {selectedRequest.approved_on || selectedRequest.rejected_on}
                                </p>
                                {selectedRequest.comments && (
                                    <p className="text-sm mt-1">
                                        <span className="font-medium">Comments:</span> {selectedRequest.comments}
                                    </p>
                                )}
                            </div>
                        )}

                        {selectedRequest.status === 'pending' && (
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false)
                                        handleReject(selectedRequest)
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                >
                                    <ThumbsDown className="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false)
                                        handleApprove(selectedRequest)
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
                                >
                                    <ThumbsUp className="w-4 h-4" />
                                    Approve
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeaveApprovalDetailModal