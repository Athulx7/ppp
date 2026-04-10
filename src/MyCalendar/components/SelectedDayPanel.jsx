import React from 'react'
import { CalendarDays, BellPlus } from 'lucide-react'

function SelectedDayPanel({ selectedDate, selDs, getEvents, openModal }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">
                    {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </h3>
                <button onClick={() => openModal('reminder')}
                    className="flex items-center gap-1 text-xs text-amber-600 font-medium bg-amber-50 px-2.5 py-1 rounded-xl">
                    <BellPlus size={12} /> Remind
                </button>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                {getEvents(selDs).length === 0 ? (
                    <div className="text-center py-5 text-gray-400">
                        <CalendarDays size={28} className="mx-auto mb-1 opacity-30" />
                        <p className="text-xs">No events</p>
                    </div>
                ) : getEvents(selDs).map((ev, i) => (
                    <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl border ${ev.color || 'bg-gray-50 text-gray-700'}`}>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate">{ev.title || ev.name || ev.type}</p>
                            <p className="text-[10px] opacity-70 mt-0.5">{ev.category}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectedDayPanel
