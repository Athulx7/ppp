import React from 'react'
import { Send, Info, Upload } from 'lucide-react'
import Modal from './Modal'
import { calculateLeaveDays } from '../hooks/useCalendarState'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'

function LeaveModal({ isOpen, onClose, leaveForm, setLeaveForm, handleLeaveSubmit, leaveBalance = [] }) {
    const leaveTypeOptions = (leaveBalance || []).map(item => ({
        value: item.leave_code,
        label: `${item.leave_name} (${item.available} days available)`
    }));

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave"
            footer={<>
                <button onClick={onClose}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer">
                    Cancel
                </button>
                <button onClick={handleLeaveSubmit}
                    className="px-6 py-2.5 bg-indigo-600 text-white rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 cursor-pointer">
                    <Send size={14} /> Submit Request
                </button>
            </>}>

            <div className="space-y-5">
                <CommonDropDown
                    required
                    label="Leave Type"
                    value={leaveForm.leave_type}
                    onChange={(val) => setLeaveForm(f => ({ ...f, leave_type: val }))}
                    options={leaveTypeOptions}
                    placeholder="Select leave type"
                />

                <div className="grid grid-cols-2 gap-4">
                    <CommonDatePicker
                        label='From Date'
                        required
                        value={leaveForm.from_date}
                        onChange={(value) => setLeaveForm(f => ({ ...f, from_date: value }))}
                        placeholder='Select Date'
                    />

                    <CommonDatePicker
                        label='To Date'
                        required
                        value={leaveForm.to_date}
                        onChange={(value) => setLeaveForm(f => ({ ...f, to_date: value }))}
                        placeholder='Select Date'
                    />
                </div>

                {leaveForm.from_date && leaveForm.to_date && (
                    <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-700">
                        <strong>{calculateLeaveDays(leaveForm.from_date, leaveForm.to_date)} working days</strong> selected
                        ({leaveForm.from_date} → {leaveForm.to_date})
                    </div>
                )}

                {leaveForm.from_date && leaveForm.to_date && leaveForm.from_date === leaveForm.to_date && (
                    <div className="p-4 bg-gray-50 rounded-md">
                        <label className="flex items-center gap-2 cursor-pointer mb-3">
                            <input type="checkbox" checked={leaveForm.half_day}
                                onChange={e => setLeaveForm(f => ({ ...f, half_day: e.target.checked }))}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">Apply for Half Day</span>
                        </label>
                        {leaveForm.half_day && (
                            <div className="flex gap-3">
                                {['first_half', 'second_half'].map(h => (
                                    <label key={h} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="half_day_type" value={h}
                                            checked={leaveForm.half_day_type === h}
                                            onChange={e => setLeaveForm(f => ({ ...f, half_day_type: e.target.value }))}
                                            className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm">{h === 'first_half' ? 'First Half' : 'Second Half'}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={leaveForm.urgent}
                        onChange={e => setLeaveForm(f => ({ ...f, urgent: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-red-500" />
                    <span className="text-sm text-gray-700">Mark as Urgent</span>
                    {leaveForm.urgent && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Will be prioritised</span>}
                </label>

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Reason *</p>
                    <textarea value={leaveForm.reason}
                        onChange={e => setLeaveForm(f => ({ ...f, reason: e.target.value }))}
                        rows={3} placeholder="Brief reason for leave..."
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" />
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Work Handover Notes</p>
                    <textarea value={leaveForm.handover_notes}
                        onChange={e => setLeaveForm(f => ({ ...f, handover_notes: e.target.value }))}
                        rows={2} placeholder="Who will handle your work?"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none" />
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-md p-5 text-center">
                    <Upload size={20} className="text-gray-400 mx-auto mb-1" />
                    <p className="text-sm text-gray-500">Upload supporting documents</p>
                    <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                    <button className="mt-2 px-4 py-1.5 border border-gray-300 rounded-md text-xs hover:bg-gray-50">Browse</button>
                </div>

                <div className="flex gap-3 p-3.5 bg-amber-50 border border-amber-100 rounded-md">
                    <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                        Your request will be sent to your reporting manager for approval. You can track status in the Leave Request page.
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default LeaveModal
