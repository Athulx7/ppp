import { Gift } from "lucide-react";
import { StatusBadge } from "../../JobTracking/components/commonFunc";

const getExpiryInfo = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date(new Date().toDateString());
    const target = new Date(dateStr);
    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;
    if (diffDays <= 30) return { label: `Expires in ${diffDays} days`, className: 'text-red-600' };
    if (diffDays <= 90) return { label: `Expires on ${dateStr}`, className: 'text-orange-600' };
    return { label: `Expires on ${dateStr}`, className: 'text-gray-400' };
};

const ProgressRing = ({ percentage = 0, size = 56, strokeWidth = 5, color = '#4f46e5', trackColor = '#e5e7eb' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const clamped = Math.max(0, Math.min(100, percentage));
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-gray-700">
                {clamped}%
            </span>
        </div>
    );
};
const getDaysUntilLabel = (dateStr) => {
    const today = new Date(new Date().toDateString());
    const target = new Date(dateStr);
    const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return null;
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
};

function MyLeaveOverView({
    leaveBalance,
    leaveTypes,
    holidays,
    leav,
    sortedUpcomingLeaves ,
    upcomingHolidays,
    recentActivity
}) {

    return (
        <>
            <div className="space-y-6 p-4">
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {leaveBalance && leaveBalance.length > 0 ? (
                            leaveBalance.map(item => {
                                const leaveType = leaveTypes.find(l => l.code === item.leave_code);
                                const usedPct = item.total > 0 ? Math.round((item.used / item.total) * 100) : 0;
                                const expiryInfo = getExpiryInfo(item.expiring_on);
                                return (
                                    <div key={item.leave_code} className={`bg-white border rounded-xl p-4 md:p-5 flex flex-col gap-4 ${leaveType?.borderColor || 'border-gray-200'}`}>
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`p-2 rounded-lg shrink-0 ${leaveType?.color || 'bg-gray-100'}`}>
                                                    {leaveType?.icon}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{item.leave_name}</h4>
                                                    <p className="text-xs text-gray-500 truncate">{leaveType?.description || ''}</p>
                                                </div>
                                            </div>
                                            <ProgressRing percentage={usedPct} color={leaveType?.hex || '#4f46e5'} />
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-100 pt-3">
                                            <div>
                                                <div className="text-lg md:text-xl font-bold text-indigo-600">{item.available}</div>
                                                <div className="text-[11px] text-gray-500">Available</div>
                                            </div>
                                            <div>
                                                <div className="text-lg md:text-xl font-bold text-gray-900">{item.used}</div>
                                                <div className="text-[11px] text-gray-500">Used</div>
                                            </div>
                                            <div>
                                                <div className="text-lg md:text-xl font-bold text-orange-600">{item.pending}</div>
                                                <div className="text-[11px] text-gray-500">Pending</div>
                                            </div>
                                        </div>

                                        {(item.carry_forward > 0 || expiryInfo) && (
                                            <div className="flex flex-col gap-1 -mt-1">
                                                {item.carry_forward > 0 && (
                                                    <p className="text-xs text-green-600">
                                                        +{item.carry_forward} days carried forward
                                                    </p>
                                                )}
                                                {expiryInfo && (
                                                    <p className={`text-xs ${expiryInfo.className}`}>
                                                        {expiryInfo.label}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center col-span-full py-4 bg-gray-50 rounded-lg">No leave balance records found</p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-medium text-gray-900">Upcoming Leaves</h4>
                        </div>
                        <div className="p-4">
                            {sortedUpcomingLeaves.length > 0 ? (
                                <div className="space-y-3">
                                    {sortedUpcomingLeaves.map(leave => {
                                        const leaveType = leaveTypes.find(l => l.code === leave.leave_type);
                                        const daysUntil = getDaysUntilLabel(leave.from_date);
                                        return (
                                            <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className={`p-2 rounded-lg shrink-0 ${leaveType?.color}`}>
                                                        {leaveType?.icon}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate">{leave.leave_name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{leave.from_date} to {leave.to_date} • {leave.days} days</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <StatusBadge status={leave.status} />
                                                    {daysUntil && (
                                                        <span className="text-[11px] text-indigo-600 font-medium">{daysUntil}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No upcoming leaves</p>
                            )}
                        </div>
                    </div>

                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-b-gray-300">
                            <h4 className="font-medium text-gray-900">Upcoming Holidays</h4>
                        </div>
                        <div className="p-4">
                            {upcomingHolidays.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingHolidays.map((holiday, index) => {
                                        const daysUntil = getDaysUntilLabel(holiday.date);
                                        return (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                                                        <Gift className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-sm truncate">{holiday.name}</p>
                                                        <p className="text-xs text-gray-500">{holiday.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                                        {holiday.type}
                                                    </span>
                                                    {daysUntil && (
                                                        <span className="text-[11px] text-gray-500">{daysUntil}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No upcoming holidays</p>
                            )}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                    <div className="space-y-3">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map(leave => {
                                const leaveType = leaveTypes.find(l => l.code === leave.leave_type);
                                return (
                                    <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`p-2 rounded-lg shrink-0 ${leaveType?.color || 'bg-gray-100'}`}>
                                                {leaveType?.icon}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-sm truncate">{leave.leave_name}</p>
                                                <p className="text-xs text-gray-500 truncate">{leave.from_date} to {leave.to_date} • {leave.days} days</p>
                                            </div>
                                        </div>
                                        <StatusBadge status={leave.status} />
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4 bg-gray-50 rounded-lg">No recent activity</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
export default MyLeaveOverView