import React from 'react'
import { Plus, AlarmClock, BellPlus, CalendarDays } from 'lucide-react'
import Modal from './Modal'
import StatusBadge from './StatusBadge'
import { minutesToHHMM } from '../hooks/useCalendarState'

function DateDetailModal({ isOpen, onClose, detailDate, openModal }) {
    return (
        <Modal isOpen={isOpen && !!detailDate} onClose={onClose}
            title={`${detailDate?.ds} — Day Details`}
            footer={
                <div className="flex gap-2">
                    <button onClick={() => { onClose(); openModal('leave') }}
                        className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                        <Plus size={12} /> Leave
                    </button>
                    <button onClick={() => { onClose(); openModal('regularize') }}
                        className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                        <AlarmClock size={12} /> Regularize
                    </button>
                    <button onClick={() => { onClose(); openModal('reminder') }}
                        className="px-3 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1">
                        <BellPlus size={12} /> Remind
                    </button>
                    <button onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-50 ml-auto">
                        Close
                    </button>
                </div>
            }>
            {detailDate && (
                <div className="space-y-4">
                    {/* Attendance */}
                    {detailDate.attRec && (
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs font-semibold text-gray-500 mb-2">Attendance</p>
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p className="text-xs text-gray-400">Punch In</p>
                                    <p className="text-sm font-bold text-gray-900">{detailDate.attRec.punch_in || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Punch Out</p>
                                    <p className="text-sm font-bold text-gray-900">{detailDate.attRec.punch_out || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Extra</p>
                                    <p className={`text-sm font-bold ${detailDate.extra > 0 ? 'text-emerald-600' : detailDate.extra < 0 ? 'text-rose-600' : 'text-gray-400'}`}>
                                        {detailDate.extra !== 0 ? (detailDate.extra > 0 ? '+' : '−') + minutesToHHMM(Math.abs(detailDate.extra)) : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Events */}
                    {detailDate.events.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 mb-2">Events & Leaves</p>
                            <div className="space-y-2">
                                {detailDate.events.map((ev, i) => (
                                    <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border ${ev.color || 'bg-gray-50 text-gray-700'}`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold">{ev.title || ev.name || ev.type}</p>
                                            <p className="text-[10px] opacity-70 mt-0.5">{ev.category}</p>
                                        </div>
                                        {ev.status && <StatusBadge status={ev.status} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {!detailDate.attRec && detailDate.events.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <CalendarDays size={32} className="mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No records for this date</p>
                        </div>
                    )}
                </div>
            )}
        </Modal>
    )
}

export default DateDetailModal
