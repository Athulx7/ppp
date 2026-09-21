import React, { useState } from 'react'
import { X, Calendar, RefreshCw, AlertCircle, CheckCircle2, Shield } from 'lucide-react'
import axios from 'axios'
import CommonDropDown from '../../../basicComponents/CommonDropDown'

const PLAN_OPTIONS = [
    { label: 'Free Trial', value: 'TRIAL' },
    { label: 'Basic Plan', value: 'BASIC' },
    { label: 'Pro Business Plan', value: 'PRO' },
    { label: 'Enterprise Plan', value: 'ENTERPRISE' },
]

const EMPLOYEE_LIMIT_OPTIONS = [
    { label: '25 Employees', value: 25 },
    { label: '50 Employees', value: 50 },
    { label: '100 Employees', value: 100 },
    { label: '250 Employees', value: 250 },
    { label: '500 Employees', value: 500 },
    { label: 'Unlimited', value: 999999 },
]

export default function RenewClientModal({ isOpen, client, onClose, onSuccess }) {
    if (!isOpen || !client) return null

    const [subscriptionPlan, setSubscriptionPlan] = useState(client.subscription_plan || 'PRO')
    const [extensionChoice, setExtensionChoice] = useState('30') // '14', '30', '90', '365', 'custom'
    const [customEndDate, setCustomEndDate] = useState('')
    const [maxEmployees, setMaxEmployees] = useState(client.max_employees || 100)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRenew = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const token = sessionStorage.getItem('token')
            const payload = {
                subscription_plan: subscriptionPlan,
                max_employees: Number(maxEmployees)
            }

            if (extensionChoice === 'custom') {
                if (!customEndDate) {
                    setError('Please select a custom end date.')
                    setLoading(false)
                    return
                }
                payload.subscription_end_date = customEndDate
            } else {
                payload.extend_days = parseInt(extensionChoice)
            }

            const res = await axios.put(`http://localhost:3000/api/system/clients/${client.company_code}/renew`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data?.success) {
                if (onSuccess) onSuccess()
                onClose()
            } else {
                setError(res.data?.message || 'Failed to update subscription')
            }
        } catch (err) {
            console.error('Renew error:', err)
            setError(err.response?.data?.message || err.message || 'Error renewing subscription')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto scrollbar">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Renew / Extend Subscription</h3>
                            <p className="text-xs text-gray-500 font-mono">Client: {client.company_code} • {client.company_name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleRenew} className="p-6 space-y-5 overflow-y-auto scrollbar flex-1">
                    {error && (
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Current Status Pill */}
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">Current Status:</span>
                        <span className="font-semibold text-gray-800 px-2.5 py-0.5 rounded-full bg-white border border-gray-200 uppercase text-[11px]">
                            {client.calculatedStatus || client.subscription_status || 'ACTIVE'}
                        </span>
                    </div>

                    <div>
                        <CommonDropDown
                            label="Select Plan"
                            options={PLAN_OPTIONS}
                            value={subscriptionPlan}
                            onChange={(val) => setSubscriptionPlan(val)}
                            showSearch={false}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Validity Extension
                        </label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {[
                                { id: '14', label: '+14 Days' },
                                { id: '30', label: '+30 Days' },
                                { id: '90', label: '+90 Days' },
                                { id: '365', label: '+1 Year' },
                            ].map((btn) => (
                                <button
                                    key={btn.id}
                                    type="button"
                                    onClick={() => setExtensionChoice(btn.id)}
                                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${extensionChoice === btn.id
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="radio"
                                id="custom-end"
                                checked={extensionChoice === 'custom'}
                                onChange={() => setExtensionChoice('custom')}
                                className="text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <label htmlFor="custom-end" className="text-xs text-gray-700 font-medium cursor-pointer">
                                Or set specific end date:
                            </label>
                        </div>

                        {extensionChoice === 'custom' && (
                            <input
                                type="date"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="w-full mt-2 bg-white border border-indigo-500 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                required={extensionChoice === 'custom'}
                            />
                        )}
                    </div>

                    <div>
                        <CommonDropDown
                            label="Employee Limit"
                            options={EMPLOYEE_LIMIT_OPTIONS}
                            value={maxEmployees}
                            onChange={(val) => setMaxEmployees(val)}
                            showSearch={false}
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            Update & Activate
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

