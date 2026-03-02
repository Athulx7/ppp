import React from 'react';

function UploadHistory({ filteredData, historyData, uploadStats }) {
    return (

        <div className="bg-white rounded-xl shadow-sm  overflow-hidden">
            <div className="p-4 flex justify-between items-center">
                <div>
                    <h2 className="font-semibold text-gray-900">Upload History</h2>
                    <p className="text-sm text-gray-500">
                        Showing {filteredData.length} of {historyData.length} uploads
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 p-3">
                {uploadStats.map((stat) => (
                    <div key={stat.id} className="bg-white p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-2">{stat.name}</h3>

                                {stat.status === 'completed' && (
                                    <div className="space-y-1 bg-cyan-100 rounded-lg p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Upload Completed:</span>
                                            <span className="font-medium text-indigo-700">View</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-green-500 rounded-full"
                                                    style={{ width: `${stat.completed}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-green-600">{stat.completed}% completed</span>
                                        </div>
                                    </div>
                                )}

                                {stat.status === 'partial' && (
                                    <div className="space-y-2 bg-yellow-100 rounded-lg p-4">
                                        <div className="text-sm">
                                            <span className="text-green-600 font-medium">Upload Complete: </span>
                                            <span className="text-gray-900">{stat.success} data has been uploaded successfully.</span>

                                        </div>
                                        <span className="font-medium text-indigo-700 text-end">View</span>
                                        <div className="text-sm">
                                            <span className="text-red-600 font-medium">Upload Error: </span>
                                            <span className="text-gray-900">{stat.error} data failed to upload</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-500 rounded-full"
                                                    style={{ width: `${(stat.success / stat.total) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-green-600">
                                                {Math.round((stat.success / stat.total) * 100)}% completed
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {stat.status === 'pending' && (
                                    <div className="space-y-1 bg-gray-100 rounded-lg p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Upload Completed:</span>
                                            <span className="font-medium text-indigo-700">View</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-gray-300 rounded-full w-0" />
                                            </div>
                                            <span className="text-xs font-medium text-gray-500">0% completed</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UploadHistory;