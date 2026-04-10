import React from 'react'
import { Timer } from 'lucide-react'
import { MONTH_NAMES, STANDARD_WORK_MINS, parseHHMM, minutesToHHMM } from '../hooks/useCalendarState'

function HoursSummary({ month, attendance, totalExtraMins, totalDeficitMins, openModal, setRegForm }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Timer size={18} className="text-indigo-600" />
                Hours Summary — {MONTH_NAMES[month]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Extra Hours', value: minutesToHHMM(totalExtraMins), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Deficit Hours', value: minutesToHHMM(totalDeficitMins), color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
                    { label: 'Carry Forward', value: minutesToHHMM(Math.max(0, totalExtraMins - totalDeficitMins)), color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                    { label: 'Working Days', value: attendance.filter(a => a.status === 'present').length + 'd', color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
                ].map(s => (
                    <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-3.5 text-center`}>
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-xs font-semibold text-gray-500">Date</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">In</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Out</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Hours</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Extra / Deficit</th>
                            <th className="text-center py-2 px-3 text-xs font-semibold text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {attendance.map(a => {
                            const worked = a.punch_in && a.punch_out
                                ? parseHHMM(a.punch_out) - parseHHMM(a.punch_in)
                                : 0
                            const extra = worked - STANDARD_WORK_MINS
                            return (
                                <tr key={a.date} className="hover:bg-gray-50">
                                    <td className="py-2 px-3 text-xs text-gray-700 font-medium">{a.date}</td>
                                    <td className="py-2 px-3 text-xs text-center text-gray-600">{a.punch_in || '—'}</td>
                                    <td className="py-2 px-3 text-xs text-center text-gray-600">{a.punch_out || '—'}</td>
                                    <td className="py-2 px-3 text-xs text-center font-medium text-gray-900">
                                        {worked > 0 ? minutesToHHMM(worked) : '—'}
                                    </td>
                                    <td className="py-2 px-3 text-xs text-center">
                                        {a.status === 'absent' ? (
                                            <span className="text-rose-600 font-medium">Absent</span>
                                        ) : extra > 0 ? (
                                            <span className="text-emerald-600 font-semibold">+{minutesToHHMM(extra)}</span>
                                        ) : extra < 0 ? (
                                            <span className="text-rose-600 font-semibold">−{minutesToHHMM(Math.abs(extra))}</span>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-3 text-center">
                                        {(a.status === 'absent' || !a.punch_in || !a.punch_out) && (
                                            <button
                                                onClick={() => {
                                                    setRegForm(f => ({ ...f, date: a.date }))
                                                    openModal('regularize')
                                                }}
                                                className="text-xs text-indigo-600 hover:underline font-medium">
                                                Regularize
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HoursSummary
