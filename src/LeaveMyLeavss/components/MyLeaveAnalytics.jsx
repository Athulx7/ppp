import { Line, Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

function MyLeaveAnalytics({
    leaveBalance,
    leaveTypes,
    barChartData,
    pieChartData,
    leaveStats,
}) {
    return (
        <>
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Monthly Leave Trend</h4>
                        <div className="h-64">
                            <Bar
                                data={barChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-gray-300 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-4">Leave Distribution</h4>
                        <div className="h-64">
                            <Pie
                                data={pieChartData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom'
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Average per Month</p>
                        <p className="text-2xl font-bold text-gray-900">{leaveStats?.averagePerMonth || '0.0'} days</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Most Used Leave</p>
                        <p className="text-lg font-bold text-gray-900">{leaveStats?.mostUsedLeave?.leave_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{leaveStats?.mostUsedLeave?.used ?? 0} days used</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Least Used Leave</p>
                        <p className="text-lg font-bold text-gray-900">{leaveStats?.leastUsedLeave?.leave_name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{leaveStats?.leastUsedLeave?.used ?? 0} days used</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Utilization Rate</p>
                        <p className="text-2xl font-bold text-indigo-600">{leaveStats?.utilizationRate || '0.0'}%</p>
                    </div>
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                        <h4 className="font-medium text-gray-900">Leave Balance Summary</h4>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left">Leave Type</th>
                                    <th className="px-4 py-2 text-right">Total</th>
                                    <th className="px-4 py-2 text-right">Used</th>
                                    <th className="px-4 py-2 text-right">Pending</th>
                                    <th className="px-4 py-2 text-right">Available</th>
                                    <th className="px-4 py-2 text-right">Carry Forward</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                {leaveBalance && leaveBalance.length > 0 ? (
                                    leaveBalance.map(item => (
                                        <tr key={item.leave_code} className="hover:bg-gray-50">
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${leaveTypes.find(l => l.code === item.leave_code)?.color || 'bg-gray-100'}`}>
                                                    {item.leave_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right">{item.total}</td>
                                            <td className="px-4 py-2 text-right">{item.used}</td>
                                            <td className="px-4 py-2 text-right">{item.pending}</td>
                                            <td className="px-4 py-2 text-right font-semibold text-green-600">{item.available}</td>
                                            <td className="px-4 py-2 text-right">{item.carry_forward}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                            No summary data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyLeaveAnalytics