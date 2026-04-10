import React from 'react'
import { Bell, User, Users, UserPlus } from 'lucide-react'
import Modal from './Modal'
import { TEAM_MEMBERS } from '../hooks/useCalendarState'

function ReminderModal({ isOpen, onClose, selectedDate, reminderForm, setReminderForm, handleReminderSubmit, isManager }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}
            title={`Add Reminder — ${selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            footer={<>
                <button onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">
                    Cancel
                </button>
                <button onClick={handleReminderSubmit}
                    className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-amber-600">
                    <Bell size={14} /> Save Reminder
                </button>
            </>}>

            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Title *</p>
                    <input type="text" value={reminderForm.title}
                        onChange={e => setReminderForm(f => ({ ...f, title: e.target.value }))}
                        placeholder="e.g., Submit report, Team meeting..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Time</p>
                        <input type="time" value={reminderForm.time}
                            onChange={e => setReminderForm(f => ({ ...f, time: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Priority</p>
                        <select value={reminderForm.priority}
                            onChange={e => setReminderForm(f => ({ ...f, priority: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Reminder Type</p>
                    <div className={`grid gap-2 ${isManager ? 'grid-cols-3' : 'grid-cols-1'}`}>
                        {[
                            { id: 'personal', label: 'Personal', icon: User },
                            ...(isManager ? [
                                { id: 'team', label: 'Team', icon: Users },
                                { id: 'employee', label: 'Employee', icon: UserPlus },
                            ] : [])
                        ].map(t => (
                            <button key={t.id} type="button"
                                onClick={() => setReminderForm(f => ({ ...f, type: t.id, forUserId: t.id === 'personal' ? null : f.forUserId }))}
                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all
                                    ${reminderForm.type === t.id ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <t.icon size={16} className={reminderForm.type === t.id ? 'text-amber-600' : 'text-gray-500'} />
                                <span className="text-xs font-medium">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {reminderForm.type === 'employee' && isManager && (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Select Employee</p>
                        <select value={reminderForm.forUserId || ''}
                            onChange={e => setReminderForm(f => ({ ...f, forUserId: e.target.value }))}
                            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none">
                            <option value="">Select employee...</option>
                            {TEAM_MEMBERS.map(m => (
                                <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes</p>
                    <textarea value={reminderForm.note}
                        onChange={e => setReminderForm(f => ({ ...f, note: e.target.value }))}
                        rows={3} placeholder="Additional notes..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none resize-none" />
                </div>
            </div>
        </Modal>
    )
}

export default ReminderModal
