import React from 'react'
import { Send } from 'lucide-react'
import Modal from './Modal'
import StatusBadge from './StatusBadge'
import { STANDARD_WORK_MINS, parseHHMM, minutesToHHMM } from '../hooks/useCalendarState'

function RegularizeModal({ isOpen, onClose, regForm, setRegForm, regRequests, handleRegSubmit }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Attendance Regularization"
            footer={<>
                <button onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancel
                </button>
                <button onClick={handleRegSubmit}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-emerald-700">
                    <Send size={14} /> Submit
                </button>
            </>}>

            <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700">
                    Use this to correct missing or wrong punch-in / punch-out times. Your manager will review and approve.
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Date *</p>
                    <input type="date" value={regForm.date}
                        onChange={e => setRegForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Punch In Time *</p>
                        <input type="time" value={regForm.punch_in}
                            onChange={e => setRegForm(f => ({ ...f, punch_in: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Punch Out Time *</p>
                        <input type="time" value={regForm.punch_out}
                            onChange={e => setRegForm(f => ({ ...f, punch_out: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none" />
                    </div>
                </div>

                {/* Duration preview */}
                {regForm.punch_in && regForm.punch_out && (
                    <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-700">
                        Total: <strong>{minutesToHHMM(parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in))}</strong>
                        {parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in) > STANDARD_WORK_MINS && (
                            <span className="ml-2 text-emerald-600 text-xs font-medium">
                                (+{minutesToHHMM(parseHHMM(regForm.punch_out) - parseHHMM(regForm.punch_in) - STANDARD_WORK_MINS)} extra)
                            </span>
                        )}
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason *</p>
                    <textarea value={regForm.reason}
                        onChange={e => setRegForm(f => ({ ...f, reason: e.target.value }))}
                        rows={3} placeholder="Reason for regularization (e.g., Forgot to punch out, system error)..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none" />
                </div>

                {/* Past requests */}
                {regRequests.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Recent Regularization Requests</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar">
                            {regRequests.map(r => (
                                <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs">
                                    <div>
                                        <p className="font-semibold text-gray-900">{r.date}</p>
                                        <p className="text-gray-500">{r.punch_in} → {r.punch_out} · {r.reason}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}

export default RegularizeModal
