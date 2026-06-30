import React, { useState, useEffect, useCallback } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import { Coffee, Eye, Plus } from 'lucide-react'
import CommonButton from '../../basicComponents/CommonButton'
import CommonModal from '../../basicComponents/CommonModal'
import { useNavigate } from 'react-router-dom'
import JobtrackingMain from '../components/JobtrackingMain'
import jobApi from '../components/jobApi'
import { getRoleBasePath } from '../../library/constants'
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp'

function JobTrackingEntry() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState({ normal: false, spinner: false })
    const [showLunchModal, setShowLunchModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [lunchBreak, setLunchBreak] = useState({ is_enabled: false, start_time: '13:00:00', end_time: '14:00:00' })
    const [currentUser, setCurrentUser] = useState(null)

    const loadLunchBreak = useCallback(async (empCode) => {
        try {
            const data = await jobApi.fetchLunchBreak(empCode)
            if (data) setLunchBreak(data)
        } catch (err) {
            console.error('Failed to load lunch break setting', err)
        }
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(p => ({ ...p, normal: true }))
            try {
                const sessionUser = JSON.parse(sessionStorage.getItem('user'))
                if (sessionUser?.user_code) {
                    const data = await jobApi.fetchEmployeeByCode(sessionUser.user_code)
                    if (data) {
                        const user = {
                            emp_code: data.emp_code,
                            emp_name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                            depart_code: data.department_code,
                            designation_code: data.designation_code
                        }
                        setCurrentUser(user)
                        loadLunchBreak(user.emp_code)
                    }
                }
            } catch (err) {
                console.error("Failed to load user", err)
            } finally {
                setIsLoading(p => ({ ...p, normal: false }))
            }
        }
        fetchUser()
    }, [loadLunchBreak])

    const handleSaveLunch = async (form) => {
        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            const res = await jobApi.saveLunchBreak({
                emp_code: currentUser.emp_code,
                is_enabled: form.is_enabled,
                start_time: form.start_time,
                end_time: form.end_time,
            })
            if (res?.success) {
                setLunchBreak(form)
                setShowLunchModal(false)
                showStatusToast('success', res.message || 'Lunch break setting saved')
            } else {
                showStatusToast('error', res?.message || 'Failed to save lunch break setting')
            }
        } catch (err) {
            console.error('Failed to save lunch break setting', err)
            showStatusToast('error', 'Failed to save lunch break setting. Please try again.')
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const isLunchActive = () => {
        if (!lunchBreak?.is_enabled || !lunchBreak.start_time || !lunchBreak.end_time) return false
        const now = new Date()
        const [sh, sm] = lunchBreak.start_time.split(':').map(Number)
        const [eh, em] = lunchBreak.end_time.split(':').map(Number)
        const nowMins = now.getHours() * 60 + now.getMinutes()
        return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em
    }
    const lunchActive = isLunchActive()

    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Jobs' }]}
                title="My Jobs"
                description="Create, run, and track your job sessions — manage time with precision"
                actions={
                    <div className="flex flex-wrap items-center justify-end gap-3 mb-5">
                        {lunchActive && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium animate-pulse">
                                <Coffee className="w-4 h-4" />Lunch Break Active – Timer Paused
                            </span>
                        )}
                        <button onClick={() => setShowLunchModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-all font-semibold">
                            <Coffee className="w-4 h-4" />
                            {lunchBreak?.is_enabled
                                ? `Lunch ${lunchBreak.start_time?.slice(0, 5)}–${lunchBreak.end_time?.slice(0, 5)}`
                                : 'Set Lunch Break'}
                        </button>

                        <button onClick={() => setShowCreateModal(true)}
                            className="flex items-center font-semibold gap-1.5 px-3 py-2 text-sm text-white border border-blue-500 bg-indigo-500 rounded-md cursor-pointer hover:bg-indigo-600 transition-all">
                            <Plus className="w-4 h-4" />
                            Create Job
                        </button>

                        <button onClick={() => navigate(`${getRoleBasePath()}/jobcalendar`)}
                            className="flex items-center font-semibold gap-1.5 px-3 py-2 text-sm text-white border border-green-500 bg-green-500 rounded-md cursor-pointer hover:bg-green-600 transition-all">
                            <Eye className="w-4 h-4" />
                            View Job Calendar
                        </button>
                    </div>
                }
                loading={isLoading.normal}
            />

            {currentUser && (
                <JobtrackingMain
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    setShowCreateModal={setShowCreateModal}
                    showCreateModal={showCreateModal}
                    currentUser={currentUser}
                />
            )}

            <LunchBreakModal
                isOpen={showLunchModal}
                onClose={() => setShowLunchModal(false)}
                lunchBreak={lunchBreak}
                onSave={handleSaveLunch}
            />
        </>
    )
}

function LunchBreakModal({ isOpen, onClose, lunchBreak, onSave }) {
    const [form, setForm] = useState({ ...lunchBreak })
    useEffect(() => { setForm({ ...lunchBreak }) }, [lunchBreak, isOpen])

    const toTimeInput = (t) => (t ? t.slice(0, 5) : '')

    return (
        <CommonModal isOpen={isOpen} onClose={onClose} title="Lunch Break Settings" size="sm" animation="slide"
            customFooter={
                <div className="flex justify-end gap-2">
                    <CommonButton label="Cancel" variant="outline" size="small" onClick={onClose} />
                    <CommonButton label="Save" variant="success" size="small" onClick={() => onSave(form)} />
                </div>
            }>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Enable Lunch Break</span>
                    </div>
                    <button onClick={() => setForm((p) => ({ ...p, is_enabled: !p.is_enabled }))}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${form.is_enabled ? 'bg-amber-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                </div>
                {form.is_enabled && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" value={toTimeInput(form.start_time)}
                                onChange={(e) => setForm((p) => ({ ...p, start_time: `${e.target.value}:00` }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" value={toTimeInput(form.end_time)}
                                onChange={(e) => setForm((p) => ({ ...p, end_time: `${e.target.value}:00` }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                    </div>
                )}
                <p className="text-xs text-gray-500">
                    When lunch break is active, the indicator above will show — wire this into your timer display logic to pause elapsed-time calculations during this window.
                </p>
            </div>
        </CommonModal>
    );
}

export default JobTrackingEntry