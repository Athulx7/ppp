import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

function UploadHistory({ historyData, isLoading }) {
    const navigate = useNavigate()

    const statusConfig = {
        completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Completed', icon: CheckCircle },
        partial_success: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Partial Success', icon: AlertCircle },
        failed: { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed', icon: XCircle },
        processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Processing', icon: Clock },
        queued: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Queued', icon: Clock },
    }

    return (
        <div className="bg-white rounded-md shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-gray-900">Upload History</h2>
                    <p className="text-sm text-gray-500">{historyData.length} uploads found</p>
                </div>
            </div>

            {historyData.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                    No upload history found
                </div>
            ) : (
                <div className="divide-y">
                    {historyData.map((batch) => {
                        const cfg = statusConfig[batch.status] || statusConfig.queued
                        const Icon = cfg.icon
                        const successPct = batch.total_records > 0
                            ? Math.round((batch.success_records / batch.total_records) * 100)
                            : 0

                        return (
                            <div key={batch.batch_id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-medium text-gray-900">{batch.upload_name}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                                                <Icon className="w-3 h-3" />
                                                {cfg.label}
                                            </span>
                                        </div>

                                        <div className="text-xs text-gray-500 mb-3">
                                            {batch.file_name} • {(batch.file_size / 1024).toFixed(1)} KB • {batch.uploaded_at}
                                        </div>

                                        <div className="flex gap-4 text-sm mb-3">
                                            <span className="text-gray-600">
                                                Total: <strong>{batch.total_records}</strong>
                                            </span>
                                            <span className="text-green-600">
                                                Success: <strong>{batch.success_records}</strong>
                                            </span>
                                            <span className="text-red-600">
                                                Errors: <strong>{batch.error_records}</strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${batch.status === 'completed' ? 'bg-green-500' :
                                                            batch.status === 'partial_success' ? 'bg-yellow-500' :
                                                                batch.status === 'failed' ? 'bg-red-500' :
                                                                    'bg-blue-500'
                                                        }`}
                                                    style={{ width: `${successPct}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-500 w-12">{successPct}%</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/admin/uploadProgress/${batch.batch_id}`)}
                                        className="px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default UploadHistory