import React from 'react'
import { CalendarDays } from 'lucide-react'

function UpcomingEvents({ upcomingEvents }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                <CalendarDays size={15} className="text-indigo-600" /> Upcoming (14 days)
            </h3>
            <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No upcoming events</p>
                ) : upcomingEvents.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                        <div className={`text-center min-w-[36px] p-1.5 rounded-lg ${ev.color || 'bg-indigo-100 text-indigo-700'}`}>
                            <p className="text-xs font-bold leading-none">
                                {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit' })}
                            </p>
                            <p className="text-[9px] leading-none mt-0.5">
                                {new Date(ev.date).toLocaleDateString('en-IN', { month: 'short' })}
                            </p>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-900 truncate">{ev.title || ev.name}</p>
                            <p className="text-[10px] text-gray-500">{ev.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UpcomingEvents
