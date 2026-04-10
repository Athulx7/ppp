import React from 'react'
import { BellRing, Check, Trash2 } from 'lucide-react'

function RemindersPanel({ upcomingReminders, handleReminderComplete, handleReminderDelete }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <BellRing size={15} className="text-amber-500" /> Reminders
                </h3>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {upcomingReminders.length}
                </span>
            </div>
            <div className="space-y-2 max-h-52 overflow-y-auto scrollbar pr-1">
                {upcomingReminders.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No upcoming reminders</p>
                ) : upcomingReminders.map(r => (
                    <div key={r.id} className="p-2.5 border border-amber-100 bg-amber-50 rounded-xl">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-gray-900 truncate">{r.title}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{r.date} · {r.time}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <button onClick={() => handleReminderComplete(r.id)}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded-lg">
                                    <Check size={12} />
                                </button>
                                <button onClick={() => handleReminderDelete(r.id)}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-1.5">
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full
                                ${r.priority === 'high' ? 'bg-red-100 text-red-700' : r.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                {r.priority}
                            </span>
                            <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                                {r.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RemindersPanel
