import React, { useState, useEffect } from 'react'
import {
    X, Check, ArrowRight, ArrowLeft, Shield, Sparkles, Sliders, Database,
    Lock, AlertCircle, Copy, CheckCircle2, RefreshCw, Key, Building2
} from 'lucide-react'
import axios from 'axios'
import CommonDropDown from '../../../basicComponents/CommonDropDown'

const PLAN_OPTIONS = [
    { label: 'Free Trial', value: 'TRIAL' },
    { label: 'Basic Paid Plan', value: 'BASIC' },
    { label: 'Pro Business Plan', value: 'PRO' },
    { label: 'Enterprise Plan', value: 'ENTERPRISE' },
]

const TRIAL_DURATION_OPTIONS = [
    { label: '7 Days Trial', value: '7' },
    { label: '14 Days Trial (Standard)', value: '14' },
    { label: '30 Days Trial', value: '30' },
    { label: '60 Days Extended Trial', value: '60' },
]

const MAX_EMPLOYEES_OPTIONS = [
    { label: '25 Employees', value: '25' },
    { label: '50 Employees', value: '50' },
    { label: '100 Employees', value: '100' },
    { label: '250 Employees', value: '250' },
    { label: '500 Employees', value: '500' },
    { label: 'Unlimited', value: '999999' },
]

export default function NewClientWizardModal({ isOpen, onClose, onSuccess }) {
    if (!isOpen) return null

    const [currentStep, setCurrentStep] = useState(1) // 1: Info, 2: Mode/Customization, 3: Provisioning/Success
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Step 1: Basic & Subscription Data
    const [formData, setFormData] = useState({
        company_code: '',
        company_name: '',
        contact_person: '',
        contact_email: '',
        contact_phone: '',
        admin_email: '',
        admin_password: '',
        subscription_plan: 'TRIAL',
        trial_duration_days: '14',
        subscription_end_date: '',
        max_employees: '50'
    })

    // Step 2: Mode Choice: 'DEFAULT' or 'CUSTOM'
    const [configMode, setConfigMode] = useState('DEFAULT')

    // Customization state
    const [templateConfig, setTemplateConfig] = useState({
        roles: [],
        masterHeaders: [],
        masterFields: [],
        empControls: []
    })
    const [activeCustomTab, setActiveCustomTab] = useState('roles') // 'roles', 'masters', 'labels'
    const [customRoles, setCustomRoles] = useState([])
    const [customMasterHeaders, setCustomMasterHeaders] = useState([])
    const [customEmpControls, setCustomEmpControls] = useState([])

    // Step 3: Provisioning progress / Result
    const [provisionResult, setProvisionResult] = useState(null)
    const [copied, setCopied] = useState(false)

    // Fetch template config on mount
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const token = sessionStorage.getItem('token')
                const res = await axios.get('http://localhost:3000/api/system/template-config', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.data?.success) {
                    const cfg = res.data.data
                    setTemplateConfig(cfg)
                    setCustomRoles(cfg.roles?.map(r => ({ ...r })) || [])
                    setCustomMasterHeaders(cfg.masterHeaders?.map(h => ({ ...h })) || [])
                    setCustomEmpControls(cfg.empControls?.map(c => ({ ...c })) || [])
                }
            } catch (err) {
                console.error('Failed to fetch template config:', err)
            }
        }
        fetchConfig()
    }, [])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*'
        let pass = ''
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        handleInputChange('admin_password', pass)
    }

    const validateStep1 = () => {
        const code = formData.company_code.trim().toUpperCase()
        if (!code) return 'Company Code is required.'
        if (!/^[A-Z0-9]{3,10}$/.test(code)) return 'Company Code must be 3-10 alphanumeric characters (e.g. ACME, CMP01).'
        if (!formData.company_name.trim()) return 'Company Name is required.'
        if (!formData.admin_email.trim() || !formData.admin_email.includes('@')) return 'A valid Administrator Email is required.'
        if (!formData.admin_password || formData.admin_password.length < 4) return 'Admin password must be at least 4 characters.'
        return null
    }

    const handleNext = () => {
        if (currentStep === 1) {
            const err = validateStep1()
            if (err) {
                setError(err)
                return
            }
            setError('')
            setCurrentStep(2)
        }
    }

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1)
            setError('')
        }
    }

    const handleProvision = async () => {
        setLoading(true)
        setError('')

        try {
            const token = sessionStorage.getItem('token')
            const payload = {
                ...formData,
                company_code: formData.company_code.trim().toUpperCase(),
                is_customized: configMode === 'CUSTOM',
                customizations: configMode === 'CUSTOM' ? {
                    roles: customRoles.map(r => ({ role_code: r.role_code, role_name: r.role_name })),
                    master_headers: customMasterHeaders.map(h => ({ master_code: h.master_code, header_name: h.header_name, list_title: h.list_title })),
                    emp_controls: customEmpControls.map(c => ({ column_name: c.column_name, label: c.label }))
                } : null
            }

            const res = await axios.post('http://localhost:3000/api/system/clients', payload, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data?.success) {
                setProvisionResult({
                    ...res.data,
                    admin_password: formData.admin_password
                })
                setCurrentStep(3)
                if (onSuccess) onSuccess()
            } else {
                setError(res.data?.message || 'Provisioning failed')
            }
        } catch (err) {
            console.error('Provisioning error:', err)
            setError(err.response?.data?.message || err.message || 'Failed to provision client database')
        } finally {
            setLoading(false)
        }
    }

    const copyCredentials = () => {
        const text = `PPP Client Credentials:\nCompany Code: ${formData.company_code.toUpperCase()}\nAdmin Email: ${formData.admin_email}\nPassword: ${formData.admin_password}\nPortal URL: http://localhost:5173/login`
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto scrollbar">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Client Onboarding Wizard</h2>
                            <p className="text-xs text-gray-500">Automated Multi-Tenant Database Provisioning</p>
                        </div>
                    </div>
                    {currentStep !== 3 && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Stepper Bar */}
                <div className="px-8 py-3 bg-gray-50/50 border-b border-gray-200 flex items-center justify-center gap-4 text-xs font-semibold">
                    <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            1
                        </span>
                        Organization & Plan
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200" />
                    <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            2
                        </span>
                        Master & Role Setup
                    </div>
                    <div className="w-8 h-0.5 bg-gray-200" />
                    <div className={`flex items-center gap-2 ${currentStep === 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            3
                        </span>
                        Provisioning & Live
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto scrollbar flex-1 space-y-6">
                    {error && (
                        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1: ORGANIZATION & SUBSCRIPTION */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                    Company Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Company Code *</label>
                                        <input
                                            type="text"
                                            value={formData.company_code}
                                            onChange={(e) => handleInputChange('company_code', e.target.value.toUpperCase())}
                                            placeholder="e.g. ACME, CORP01"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                        <p className="text-[11px] text-gray-500 mt-1">Unique tenant identifier for database and client login.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name *</label>
                                        <input
                                            type="text"
                                            value={formData.company_name}
                                            onChange={(e) => handleInputChange('company_name', e.target.value)}
                                            placeholder="e.g. Acme Corporation Pvt Ltd"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Person</label>
                                        <input
                                            type="text"
                                            value={formData.contact_person}
                                            onChange={(e) => handleInputChange('contact_person', e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={formData.contact_phone}
                                            onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                    Initial Client Administrator Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Admin Email Address *</label>
                                        <input
                                            type="email"
                                            value={formData.admin_email}
                                            onChange={(e) => handleInputChange('admin_email', e.target.value)}
                                            placeholder="admin@company.com"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="text-xs font-semibold text-gray-700">Admin Initial Password *</label>
                                            <button
                                                type="button"
                                                onClick={generateRandomPassword}
                                                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
                                            >
                                                <Key className="w-3 h-3" /> Auto-Generate
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.admin_password}
                                            onChange={(e) => handleInputChange('admin_password', e.target.value)}
                                            placeholder="Enter strong password"
                                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                                    Subscription & Plan Configuration
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div>
                                        <CommonDropDown
                                            label="Plan Type"
                                            options={PLAN_OPTIONS}
                                            value={formData.subscription_plan}
                                            onChange={(val) => handleInputChange('subscription_plan', val)}
                                            showSearch={false}
                                        />
                                    </div>

                                    {formData.subscription_plan === 'TRIAL' ? (
                                        <div>
                                            <CommonDropDown
                                                label="Trial Duration"
                                                options={TRIAL_DURATION_OPTIONS}
                                                value={formData.trial_duration_days}
                                                onChange={(val) => handleInputChange('trial_duration_days', val)}
                                                showSearch={false}
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-gray-700">Subscription End Date</label>
                                            <input
                                                type="date"
                                                value={formData.subscription_end_date}
                                                onChange={(e) => handleInputChange('subscription_end_date', e.target.value)}
                                                className="w-full bg-white border border-indigo-500 rounded-lg p-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <CommonDropDown
                                            label="Max Employees Allowed"
                                            options={MAX_EMPLOYEES_OPTIONS}
                                            value={formData.max_employees}
                                            onChange={(val) => handleInputChange('max_employees', val)}
                                            showSearch={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: MASTER & ROLE CONFIGURATION MODE */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Choose Configuration Mode
                                </h3>
                                <p className="text-xs text-gray-500 mb-4">
                                    Decide whether to use standard system defaults or customize display titles, roles, and field labels for this client.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Option 1: Default */}
                                    <div
                                        onClick={() => setConfigMode('DEFAULT')}
                                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${configMode === 'DEFAULT'
                                            ? 'bg-indigo-50/50 border-indigo-600 shadow-xs'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5" />
                                                </div>
                                                {configMode === 'DEFAULT' && (
                                                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Set as Default (Standard)</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Provisions standard role names (Administrator, HR Manager, Payroll Manager, Employee), default master headers, and standard field labels. Recommended for standard implementations.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-indigo-700 font-semibold">
                                            ⚡ Instant 1-Click Provisioning
                                        </div>
                                    </div>

                                    {/* Option 2: Customize */}
                                    <div
                                        onClick={() => setConfigMode('CUSTOM')}
                                        className={`p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${configMode === 'CUSTOM'
                                            ? 'bg-purple-50/50 border-purple-600 shadow-xs'
                                            : 'bg-white border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                                    <Sliders className="w-5 h-5" />
                                                </div>
                                                {configMode === 'CUSTOM' && (
                                                    <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </div>
                                                )}
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-900 mb-1">Customize Master & Role Names</h4>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                Customize role names, master header titles, and field labels to match the client's internal nomenclature.
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-purple-700 font-semibold flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> System Codes & IDs Strictly Preserved
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Customization Panel (Only if CUSTOM selected) */}
                            {configMode === 'CUSTOM' && (
                                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveCustomTab('roles')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeCustomTab === 'roles' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                Role Names ({customRoles.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCustomTab('masters')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeCustomTab === 'masters' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                Master Headers ({customMasterHeaders.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveCustomTab('labels')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${activeCustomTab === 'labels' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                            >
                                                Employee Form Labels ({customEmpControls.length})
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium flex items-center gap-1">
                                            <Lock className="w-3 h-3" /> System IDs & Codes Locked
                                        </span>
                                    </div>

                                    {/* TAB 1: ROLES */}
                                    {activeCustomTab === 'roles' && (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-64 overflow-y-auto scrollbar">
                                            <table className="w-full text-left text-xs text-gray-700">
                                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold sticky top-0 border-b border-gray-200">
                                                    <tr>
                                                        <th className="py-2.5 px-4">System Role Code (Locked)</th>
                                                        <th className="py-2.5 px-4">Custom Role Display Name</th>
                                                        <th className="py-2.5 px-4">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {customRoles.map((role, idx) => (
                                                        <tr key={role.role_code} className="hover:bg-gray-50/80">
                                                            <td className="py-2.5 px-4">
                                                                <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                                                                    <Lock className="w-2.5 h-2.5 text-gray-400" />
                                                                    {role.role_code}
                                                                </span>
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={role.role_name}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value
                                                                        setCustomRoles(prev => prev.map((r, i) => i === idx ? { ...r, role_name: val } : r))
                                                                    }}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-gray-500 truncate max-w-xs">{role.description}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* TAB 2: MASTER HEADERS */}
                                    {activeCustomTab === 'masters' && (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-64 overflow-y-auto scrollbar">
                                            <table className="w-full text-left text-xs text-gray-700">
                                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold sticky top-0 border-b border-gray-200">
                                                    <tr>
                                                        <th className="py-2.5 px-4">Master Code (Locked)</th>
                                                        <th className="py-2.5 px-4">Master Title / Header Name</th>
                                                        <th className="py-2.5 px-4">List Title</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {customMasterHeaders.map((master, idx) => (
                                                        <tr key={master.master_code} className="hover:bg-gray-50/80">
                                                            <td className="py-2.5 px-4">
                                                                <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                                                                    <Lock className="w-2.5 h-2.5 text-gray-400" />
                                                                    {master.master_code}
                                                                </span>
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={master.header_name}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value
                                                                        setCustomMasterHeaders(prev => prev.map((m, i) => i === idx ? { ...m, header_name: val } : m))
                                                                    }}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={master.list_title || `${master.header_name} List`}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value
                                                                        setCustomMasterHeaders(prev => prev.map((m, i) => i === idx ? { ...m, list_title: val } : m))
                                                                    }}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* TAB 3: EMPLOYEE FORM LABELS */}
                                    {activeCustomTab === 'labels' && (
                                        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-64 overflow-y-auto scrollbar">
                                            <table className="w-full text-left text-xs text-gray-700">
                                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold sticky top-0 border-b border-gray-200">
                                                    <tr>
                                                        <th className="py-2.5 px-4">Column Name (Locked)</th>
                                                        <th className="py-2.5 px-4">Field Label</th>
                                                        <th className="py-2.5 px-4">Required</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {customEmpControls.map((ctl, idx) => (
                                                        <tr key={ctl.column_name} className="hover:bg-gray-50/80">
                                                            <td className="py-2.5 px-4">
                                                                <span className="inline-flex items-center gap-1 font-mono font-bold text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-[11px]">
                                                                    <Lock className="w-2.5 h-2.5 text-gray-400" />
                                                                    {ctl.column_name}
                                                                </span>
                                                            </td>
                                                            <td className="py-2.5 px-4">
                                                                <input
                                                                    type="text"
                                                                    value={ctl.label}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value
                                                                        setCustomEmpControls(prev => prev.map((c, i) => i === idx ? { ...c, label: val } : c))
                                                                    }}
                                                                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1 text-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                                                />
                                                            </td>
                                                            <td className="py-2.5 px-4 text-gray-500">
                                                                {ctl.required ? (
                                                                    <span className="text-amber-700 font-semibold text-[10px] uppercase bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Yes</span>
                                                                ) : 'Optional'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: PROVISIONING SUCCESS */}
                    {currentStep === 3 && provisionResult && (
                        <div className="text-center py-6 space-y-6">
                            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    Client Database Successfully Provisioned!
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Database <span className="font-mono text-indigo-600 font-semibold">[{provisionResult.company_code}]</span> was created and seed tables verified.
                                </p>
                            </div>

                            {/* Credentials Summary Box */}
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 max-w-lg mx-auto text-left space-y-3 relative shadow-xs">
                                <button
                                    onClick={copyCredentials}
                                    className="absolute top-4 right-4 flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 bg-white px-2.5 py-1 rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer shadow-xs font-semibold"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied!' : 'Copy Info'}
                                </button>

                                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                                    Client Admin Access Details
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-500">Company Code:</div>
                                    <div className="font-mono font-bold text-gray-900">{provisionResult.company_code}</div>

                                    <div className="text-gray-500">Database Name:</div>
                                    <div className="font-mono text-indigo-700 font-semibold">{provisionResult.db_name}</div>

                                    <div className="text-gray-500">Administrator Email:</div>
                                    <div className="text-gray-900 font-medium">{provisionResult.admin_email}</div>

                                    <div className="text-gray-500">Administrator Password:</div>
                                    <div className="font-mono text-emerald-700 font-bold">{formData.admin_password}</div>

                                    <div className="text-gray-500">Subscription Status:</div>
                                    <div>
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase">
                                            {provisionResult.subscription_status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-gray-500 max-w-md mx-auto">
                                The client can now log into the application using their Company Code, Administrator Email, and Password.
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/70 flex items-center justify-between">
                    {currentStep === 1 && (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleNext}
                                className="px-5 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                            >
                                Next: Master Setup
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <button
                                onClick={handleBack}
                                disabled={loading}
                                className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button
                                onClick={handleProvision}
                                disabled={loading}
                                className="px-6 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Provisioning Database...
                                    </>
                                ) : (
                                    <>
                                        <Database className="w-4 h-4" />
                                        Provision Client Database Now
                                    </>
                                )}
                            </button>
                        </>
                    )}

                    {currentStep === 3 && (
                        <div className="w-full flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-lg text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer shadow-xs"
                            >
                                Done & View in Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
