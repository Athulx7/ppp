import React, { useEffect, useState, useMemo } from 'react'
import {
    Shield, Coins, FileText, Plus, Trash2, Edit, X, Save,
    CheckCircle, Search, Loader2, AlertCircle, Building, Users,
    Sliders, Clock, ChevronRight, Info, Check, RefreshCw
} from 'lucide-react'
import CommonSwitch from '../../basicComponents/CommonSwitch'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonAccordion from '../../basicComponents/CommonAccordion'
import { ApiCall } from '../../library/constants'

const FREQUENCY_OPTIONS = [
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Half-Yearly (June & Dec)', value: 'Half-Yearly' },
    { label: 'Yearly (December)', value: 'Yearly' }
]

const GENDER_OPTIONS = [
    { label: 'All Employees', value: 'All' },
    { label: 'Male Only', value: 'Male' },
    { label: 'Female Only', value: 'Female' }
]

function getValueFromInput(e) {
    if (e && typeof e === 'object' && e.target !== undefined) {
        return e.target.value
    }
    return e
}

function CustomStatutoryConfig({ isTabLoading, currentTitle }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [stateOption, setStateOption] = useState([])

    async function getStates() {
        try {
            const res = await ApiCall("GET", "/payrollsettings/statutory/states")
            if (res.data?.success) {
                const data = res.data.data.map(item => {
                    return {
                        label: item.label,
                        value: item.value
                    }
                })
                setStateOption(data)
            }
        }
        catch (err) {
            console.log('err', err)
        }
    }

    const [statutoryConfig, setStatutoryConfig] = useState({
        enable_professional_tax: true,
        enable_lwf: true,
        enable_esi: true,
        enable_pf: true,
        enable_tds: true,
        enable_gratuity: false
    })

    const [ptSlabs, setPtSlabs] = useState([])
    const [lwfMasters, setLwfMasters] = useState([])
    const [esiMasters, setEsiMasters] = useState([])
    const [pfConfig, setPfConfig] = useState({
        wage_ceiling: 15000,
        employee_rate: 12.0,
        employer_rate: 12.0,
        allow_vpf: true,
        restrict_employer_pf: true
    })

    const [ptSearch, setPtSearch] = useState('')
    const [lwfSearch, setLwfSearch] = useState('')

    const [editingPt, setEditingPt] = useState(null)
    const [isAddPtOpen, setIsAddPtOpen] = useState(false)
    const [newPtForm, setNewPtForm] = useState({
        state_code: '-1',
        from_amount: 0,
        to_amount: 10000,
        deduction_amount: 200,
        gender: 'All'
    })

    const [editingLwf, setEditingLwf] = useState(null)
    const [isAddLwfOpen, setIsAddLwfOpen] = useState(false)
    const [newLwfForm, setNewLwfForm] = useState({
        state_code: '-1',
        employee_contribution: 12,
        employer_contribution: 36,
        deduction_frequency: 'Half-Yearly',
        effective_from: new Date().toISOString().split('T')[0],
        is_active: 1
    })

    const [editingEsi, setEditingEsi] = useState(null)
    const [isAddEsiOpen, setIsAddEsiOpen] = useState(false)
    const [newEsiForm, setNewEsiForm] = useState({
        wage_ceiling: 21000,
        employee_rate: 0.75,
        employer_rate: 3.25,
        effective_from: new Date().toISOString().split('T')[0],
        is_active: 1
    })

    const loadStatutoryData = async () => {
        setLoading(true)
        setErrorMessage('')
        try {
            const res = await ApiCall('get', '/payrollsettings/fields/statutory')
            if (res.data?.success) {
                const values = res.data.data.values || {}
                setStatutoryConfig({
                    enable_professional_tax: Boolean(values.enable_professional_tax ?? 1),
                    enable_lwf: Boolean(values.enable_lwf ?? 1),
                    enable_esi: Boolean(values.enable_esi ?? 1),
                    enable_pf: Boolean(values.enable_pf ?? 1),
                    enable_tds: Boolean(values.enable_tds ?? 1),
                    enable_gratuity: Boolean(values.enable_gratuity ?? 0)
                })

                setPtSlabs(res.data.data.ptSlabs || [])
                setLwfMasters(res.data.data.lwfMasters || [])
                setEsiMasters(res.data.data.esiMasters || [])
                if (res.data.data.pfConfig) setPfConfig(res.data.data.pfConfig)
            }
        } catch (err) {
            console.error('Error loading statutory data:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to fetch statutory data from API')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStates()
        loadStatutoryData()
    }, [])

    const handleToggleStatutory = async (key, val) => {
        const updated = { ...statutoryConfig, [key]: val }
        setStatutoryConfig(updated)
        try {
            await ApiCall('post', '/payrollsettings/save-module', {
                moduleKey: 'statutory',
                data: updated
            })
            setSaveSuccess('Statutory configuration updated!')
            setTimeout(() => setSaveSuccess(''), 3000)
        } catch (err) {
            console.error('Error saving statutory toggles:', err)
            setErrorMessage('Failed to update statutory configuration')
        }
    }

    const handleSaveNewPt = async () => {
        setErrorMessage('')
        if (newPtForm.from_amount < 0 || newPtForm.to_amount <= newPtForm.from_amount) {
            setErrorMessage('Invalid PT Slab amount range.')
            return
        }
        setSaving(true)
        try {
            const res = await ApiCall('post', '/payrollsettings/statutory/pt-slabs', newPtForm)
            if (res.data?.success) {
                setSaveSuccess('PT Slab added successfully!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setIsAddPtOpen(false)
                setNewPtForm({ state_code: '-1', from_amount: 0, to_amount: 10000, deduction_amount: 200, gender: 'All' })
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error saving PT slab:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to add PT Slab')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdatePt = async () => {
        if (!editingPt) return
        setSaving(true)
        setErrorMessage('')
        try {
            const res = await ApiCall('put', `/payrollsettings/statutory/pt-slabs/${editingPt.id}`, editingPt)
            if (res.data?.success) {
                setSaveSuccess('PT Slab updated successfully!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setEditingPt(null)
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error updating PT slab:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to update PT Slab')
        } finally {
            setSaving(false)
        }
    }

    const handleDeletePt = async (id) => {
        if (!window.confirm('Are you sure you want to delete this PT slab?')) return
        setErrorMessage('')
        try {
            const res = await ApiCall('delete', `/payrollsettings/statutory/pt-slabs/${id}`)
            if (res.data?.success) {
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error deleting PT slab:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to delete PT Slab')
        }
    }

    const handleSaveNewLwf = async () => {
        setSaving(true)
        setErrorMessage('')
        try {
            const res = await ApiCall('post', '/payrollsettings/statutory/lwf', newLwfForm)
            if (res.data?.success) {
                setSaveSuccess('LWF entry added successfully!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setIsAddLwfOpen(false)
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error saving LWF:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to add LWF entry')
        } finally {
            setSaving(false)
        }
    }

    const handleUpdateLwf = async () => {
        if (!editingLwf) return
        setSaving(true)
        setErrorMessage('')
        try {
            const res = await ApiCall('put', `/payrollsettings/statutory/lwf/${editingLwf.id}`, editingLwf)
            if (res.data?.success) {
                setSaveSuccess('LWF entry updated!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setEditingLwf(null)
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error updating LWF:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to update LWF entry')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteLwf = async (id) => {
        if (!window.confirm('Delete this LWF master record?')) return
        setErrorMessage('')
        try {
            const res = await ApiCall('delete', `/payrollsettings/statutory/lwf/${id}`)
            if (res.data?.success) {
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error deleting LWF:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to delete LWF entry')
        }
    }

    const handleSaveNewEsi = async () => {
        setSaving(true)
        setErrorMessage('')
        try {
            const res = await ApiCall('post', '/payrollsettings/statutory/esi', newEsiForm)
            if (res.data?.success) {
                setSaveSuccess('ESI configuration added!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setIsAddEsiOpen(false)
                await loadStatutoryData()
            }
        } catch (err) {
            console.error('Error saving ESI:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to add ESI configuration')
        } finally {
            setSaving(false)
        }
    }

    const filteredPtSlabs = useMemo(() => {
        if (!ptSearch) return ptSlabs
        const q = ptSearch.toLowerCase()
        return ptSlabs.filter(s => s.state_code?.toLowerCase().includes(q) || s.gender?.toLowerCase().includes(q))
    }, [ptSlabs, ptSearch])

    const filteredLwfMasters = useMemo(() => {
        if (!lwfSearch) return lwfMasters
        const q = lwfSearch.toLowerCase()
        return lwfMasters.filter(l => l.state_code?.toLowerCase().includes(q) || l.deduction_frequency?.toLowerCase().includes(q))
    }, [lwfMasters, lwfSearch])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm font-medium">Loading Statutory Configurations...</span>
            </div>
        )
    }

    return (
        <div className="space-y-5 overflow-y-auto max-h-[82vh] hide-scrollbar pr-1">
            {!isTabLoading && (
                <div className="flex items-start gap-3 mb-5">
                    <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{currentTitle || 'Statutory Components'}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Enable and manage statutory master rules (PT, LWF, ESI, PF, TDS & Gratuity)
                        </p>
                    </div>
                </div>
            )}

            {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-md flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {saveSuccess}
                </div>
            )}

            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    {errorMessage}
                </div>
            )}

            <CommonAccordion
                title="Statutory Master Modules Enable / Disable"
                icon={<Sliders className="w-4 h-4 text-indigo-600" />}
                defaultOpen={true}
            >
                <div className="py-2 space-y-4">
                    <p className="text-xs text-gray-500">
                        Toggle statutory rules active in your organization. Enabled components will render below with full slab matrix & configuration settings.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100">
                        <CommonSwitch
                            checked={statutoryConfig.enable_professional_tax}
                            onChange={(chk) => handleToggleStatutory('enable_professional_tax', chk)}
                            label="Professional Tax (PT)"
                        />
                        <CommonSwitch
                            checked={statutoryConfig.enable_lwf}
                            onChange={(chk) => handleToggleStatutory('enable_lwf', chk)}
                            label="Labour Welfare Fund (LWF)"
                        />
                        <CommonSwitch
                            checked={statutoryConfig.enable_esi}
                            onChange={(chk) => handleToggleStatutory('enable_esi', chk)}
                            label="Employees State Insurance (ESI)"
                        />
                        <CommonSwitch
                            checked={statutoryConfig.enable_pf}
                            onChange={(chk) => handleToggleStatutory('enable_pf', chk)}
                            label="Provident Fund (PF)"
                        />
                        <CommonSwitch
                            checked={statutoryConfig.enable_tds}
                            onChange={(chk) => handleToggleStatutory('enable_tds', chk)}
                            label="Tax Deducted at Source (TDS)"
                        />
                        <CommonSwitch
                            checked={statutoryConfig.enable_gratuity}
                            onChange={(chk) => handleToggleStatutory('enable_gratuity', chk)}
                            label="Gratuity (Future Rules)"
                        />
                    </div>
                </div>
            </CommonAccordion>

            {statutoryConfig.enable_professional_tax && (
                <CommonAccordion
                    title="Professional Tax (PT) Slabs Matrix"
                    icon={<Building className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={true}
                >
                    <div className="space-y-4 py-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">
                                State-wise Professional Tax gross wage slabs & deduction amounts (`tbl_professional_tax_slab`)
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-56">
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="Search by state code..."
                                        value={ptSearch}
                                        onChange={(e) => setPtSearch(getValueFromInput(e))}
                                        className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddPtOpen(true)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add PT Slab
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto overflow-y-auto max-h-[40vh] scrollbar border border-gray-100 rounded-md">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3">State Code</th>
                                        <th className="px-4 py-3">Monthly Wage Range (₹)</th>
                                        <th className="px-4 py-3">Deduction (₹)</th>
                                        <th className="px-4 py-3">Gender Applicability</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredPtSlabs.map((slab) => (
                                        <tr key={slab.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-4 py-3 font-bold text-indigo-700">
                                                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-xs">
                                                    {slab.state_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-800 font-medium">
                                                ₹{Number(slab.from_amount).toLocaleString()} — {slab.to_amount >= 999999 ? 'Above' : `₹${Number(slab.to_amount).toLocaleString()}`}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                ₹{Number(slab.deduction_amount).toLocaleString()} / month
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${slab.gender === 'Male' ? 'bg-blue-50 text-blue-700' :
                                                    slab.gender === 'Female' ? 'bg-pink-50 text-pink-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {slab.gender || 'All'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingPt(slab)}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                                                        title="Edit PT Slab"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeletePt(slab.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                        title="Delete PT Slab"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPtSlabs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                                                No PT Slabs defined. Click "Add PT Slab" to create one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CommonAccordion>
            )}

            {statutoryConfig.enable_lwf && (
                <CommonAccordion
                    title="Labour Welfare Fund (LWF) Master Rules"
                    icon={<Coins className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={false}
                >
                    <div className="space-y-4 py-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                            <p className="text-xs text-gray-500">
                                State-wise LWF employee & employer contributions (`tbl_lwf_mst`)
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="relative w-full md:w-56">
                                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                                    <input
                                        type="text"
                                        placeholder="Search by state code..."
                                        value={lwfSearch}
                                        onChange={(e) => setLwfSearch(getValueFromInput(e))}
                                        className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md w-full focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsAddLwfOpen(true)}
                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    Add LWF Rule
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto overflow-y-auto max-h-[40vh] scrollbar border border-gray-100 rounded-md">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-3">State Code</th>
                                        <th className="px-4 py-3">Employee Contribution (₹)</th>
                                        <th className="px-4 py-3">Employer Contribution (₹)</th>
                                        <th className="px-4 py-3">Deduction Frequency</th>
                                        <th className="px-4 py-3">Effective Date</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredLwfMasters.map((lwf) => (
                                        <tr key={lwf.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-4 py-3 font-bold text-indigo-700">
                                                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-xs">
                                                    {lwf.state_name}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                ₹{Number(lwf.employee_contribution).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                ₹{Number(lwf.employer_contribution).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700 font-medium">
                                                {lwf.deduction_frequency}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {lwf.effective_from ? new Date(lwf.effective_from).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingLwf(lwf)}
                                                        className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                                                        title="Edit LWF"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteLwf(lwf.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                                        title="Delete LWF"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredLwfMasters.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                                                No LWF rules defined. Click "Add LWF Rule" to create one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CommonAccordion>
            )}

            {statutoryConfig.enable_esi && (
                <CommonAccordion
                    title="Employees State Insurance (ESI) Master Rules"
                    icon={<Shield className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={false}
                >
                    <div className="space-y-4 py-2">
                        <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                            <p className="text-xs text-gray-500">
                                ESI Wage Ceiling limits & Contribution percentage rates (`tbl_esi_mst`)
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsAddEsiOpen(true)}
                                className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Add ESI Rate Revision
                            </button>
                        </div>

                        <div className="overflow-x-auto border border-gray-100 rounded-md">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th className="px-4 py-3">Wage Ceiling Limit (₹)</th>
                                        <th className="px-4 py-3">Employee Contribution Rate (%)</th>
                                        <th className="px-4 py-3">Employer Contribution Rate (%)</th>
                                        <th className="px-4 py-3">Total ESI Contribution (%)</th>
                                        <th className="px-4 py-3">Effective Date</th>
                                        <th className="px-4 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {esiMasters.map((esi) => (
                                        <tr key={esi.id} className="hover:bg-gray-50/70 transition-colors">
                                            <td className="px-4 py-3 font-bold text-gray-900">
                                                ₹{Number(esi.wage_ceiling).toLocaleString()} / month
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-emerald-700">
                                                {esi.employee_rate}%
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-indigo-700">
                                                {esi.employer_rate}%
                                            </td>
                                            <td className="px-4 py-3 font-bold text-gray-900">
                                                {(Number(esi.employee_rate) + Number(esi.employer_rate)).toFixed(2)}%
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {esi.effective_from ? new Date(esi.effective_from).toLocaleDateString() : 'Immediate'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                                                    Active Rule
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {esiMasters.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                                                No ESI master records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CommonAccordion>
            )}

            {statutoryConfig.enable_pf && (
                <CommonAccordion
                    title="Employees Provident Fund (EPF) Rules"
                    icon={<FileText className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={false}
                >
                    <div className="space-y-4 py-2">
                        <p className="text-xs text-gray-500">
                            EPF statutory contribution percentages, wage ceiling limits, and VPF options
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CommonInputField
                                label="Statutory Wage Ceiling (₹)"
                                type="number"
                                value={pfConfig.wage_ceiling}
                                onChange={(e) => setPfConfig(prev => ({ ...prev, wage_ceiling: getValueFromInput(e) }))}
                            />

                            <CommonInputField
                                label="Employee EPF Rate (%)"
                                type="number"
                                value={pfConfig.employee_rate}
                                onChange={(e) => setPfConfig(prev => ({ ...prev, employee_rate: getValueFromInput(e) }))}
                            />

                            <CommonInputField
                                label="Employer EPF Rate (%)"
                                type="number"
                                value={pfConfig.employer_rate}
                                onChange={(e) => setPfConfig(prev => ({ ...prev, employer_rate: getValueFromInput(e) }))}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <CommonSwitch
                                checked={pfConfig.restrict_employer_pf}
                                onChange={(chk) => setPfConfig(prev => ({ ...prev, restrict_employer_pf: chk }))}
                                label="Restrict Employer PF Contribution to Ceiling Limit (₹15,000)"
                            />

                            <CommonSwitch
                                checked={pfConfig.allow_vpf}
                                onChange={(chk) => setPfConfig(prev => ({ ...prev, allow_vpf: chk }))}
                                label="Allow Voluntary Provident Fund (VPF) for Employees"
                            />
                        </div>
                    </div>
                </CommonAccordion>
            )}

            {statutoryConfig.enable_tds && (
                <CommonAccordion
                    title="Tax Deducted at Source (TDS) & Income Tax Settings"
                    icon={<Coins className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={false}
                >
                    <div className="space-y-4 py-2">
                        <p className="text-xs text-gray-500">
                            Configure income tax regimes, declaration windows, and standard deductions for TDS calculation
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CommonDropDown
                                placeholder
                                label="Default Tax Regime for New Joiners"
                                value="new_regime"
                                options={[
                                    { label: 'New Tax Regime (u/s 115BAC)', value: 'new_regime' },
                                    { label: 'Old Tax Regime (With Exemptions)', value: 'old_regime' }
                                ]}
                                onChange={() => { }}
                            />

                            <CommonInputField
                                label="Standard Deduction Amount (₹)"
                                type="number"
                                value={75000}
                                onChange={() => { }}
                            />

                            <CommonInputField
                                label="Investment Declaration Cut-off Day"
                                type="number"
                                value={20}
                                onChange={() => { }}
                            />
                        </div>
                    </div>
                </CommonAccordion>
            )}

            {statutoryConfig.enable_gratuity && (
                <CommonAccordion
                    title="Gratuity Rules Engine (Future Ready)"
                    icon={<Info className="w-4 h-4 text-indigo-600" />}
                    defaultOpen={false}
                >
                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-2">
                        <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Gratuity Calculation Policy</h4>
                        <p className="text-xs text-gray-600">
                            Eligible for employees completing 5+ continuous years of service. Formula: (15 * Basic Salary * Tenure Years) / 26.
                        </p>
                    </div>
                </CommonAccordion>
            )}

            {(isAddPtOpen || editingPt) && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {editingPt ? `Edit PT Slab (ID: ${editingPt.id})` : 'Add New PT Slab'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAddPtOpen(false)
                                    setEditingPt(null)
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <CommonDropDown
                                placeholder
                                label="State Code"
                                value={editingPt ? editingPt.state_code : newPtForm.state_code}
                                options={stateOption}
                                onChange={(val) => {
                                    if (editingPt) setEditingPt({ ...editingPt, state_code: val })
                                    else setNewPtForm({ ...newPtForm, state_code: val })
                                }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="From Amount (₹)"
                                    type="number"
                                    value={editingPt ? editingPt.from_amount : newPtForm.from_amount}
                                    onChange={(e) => {
                                        const v = parseFloat(getValueFromInput(e)) || 0
                                        if (editingPt) setEditingPt({ ...editingPt, from_amount: v })
                                        else setNewPtForm({ ...newPtForm, from_amount: v })
                                    }}
                                />
                                <CommonInputField
                                    label="To Amount (₹)"
                                    type="number"
                                    value={editingPt ? editingPt.to_amount : newPtForm.to_amount}
                                    onChange={(e) => {
                                        const v = parseFloat(getValueFromInput(e)) || 0
                                        if (editingPt) setEditingPt({ ...editingPt, to_amount: v })
                                        else setNewPtForm({ ...newPtForm, to_amount: v })
                                    }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Deduction Amount (₹)"
                                    type="number"
                                    value={editingPt ? editingPt.deduction_amount : newPtForm.deduction_amount}
                                    onChange={(e) => {
                                        const v = parseFloat(getValueFromInput(e)) || 0
                                        if (editingPt) setEditingPt({ ...editingPt, deduction_amount: v })
                                        else setNewPtForm({ ...newPtForm, deduction_amount: v })
                                    }}
                                />
                                <CommonDropDown
                                    placeholder
                                    label="Gender"
                                    value={editingPt ? editingPt.gender || 'All' : newPtForm.gender}
                                    options={GENDER_OPTIONS}
                                    onChange={(val) => {
                                        if (editingPt) setEditingPt({ ...editingPt, gender: val })
                                        else setNewPtForm({ ...newPtForm, gender: val })
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddPtOpen(false)
                                    setEditingPt(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={editingPt ? handleUpdatePt : handleSaveNewPt}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                {editingPt ? 'Update PT Slab' : 'Save PT Slab'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(isAddLwfOpen || editingLwf) && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">
                                {editingLwf ? `Edit LWF Config (ID: ${editingLwf.id})` : 'Add New LWF Rule'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsAddLwfOpen(false)
                                    setEditingLwf(null)
                                }}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <CommonDropDown
                                placeholder
                                label="State Code"
                                value={editingLwf ? editingLwf.state_code : newLwfForm.state_code}
                                options={stateOption}
                                onChange={(val) => {
                                    if (editingLwf) setEditingLwf({ ...editingLwf, state_code: val })
                                    else setNewLwfForm({ ...newLwfForm, state_code: val })
                                }}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Employee Contribution (₹)"
                                    type="number"
                                    value={editingLwf ? editingLwf.employee_contribution : newLwfForm.employee_contribution}
                                    onChange={(e) => {
                                        const v = parseFloat(getValueFromInput(e)) || 0
                                        if (editingLwf) setEditingLwf({ ...editingLwf, employee_contribution: v })
                                        else setNewLwfForm({ ...newLwfForm, employee_contribution: v })
                                    }}
                                />
                                <CommonInputField
                                    label="Employer Contribution (₹)"
                                    type="number"
                                    value={editingLwf ? editingLwf.employer_contribution : newLwfForm.employer_contribution}
                                    onChange={(e) => {
                                        const v = parseFloat(getValueFromInput(e)) || 0
                                        if (editingLwf) setEditingLwf({ ...editingLwf, employer_contribution: v })
                                        else setNewLwfForm({ ...newLwfForm, employer_contribution: v })
                                    }}
                                />
                            </div>

                            <CommonDropDown
                                placeholder
                                label="Deduction Frequency"
                                value={editingLwf ? editingLwf.deduction_frequency : newLwfForm.deduction_frequency}
                                options={FREQUENCY_OPTIONS}
                                onChange={(val) => {
                                    if (editingLwf) setEditingLwf({ ...editingLwf, deduction_frequency: val })
                                    else setNewLwfForm({ ...newLwfForm, deduction_frequency: val })
                                }}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsAddLwfOpen(false)
                                    setEditingLwf(null)
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={editingLwf ? handleUpdateLwf : handleSaveNewLwf}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                {editingLwf ? 'Update LWF Rule' : 'Save LWF Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAddEsiOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900">Add ESI Rate Revision</h3>
                            <button onClick={() => setIsAddEsiOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <CommonInputField
                                label="Wage Ceiling Limit (₹)"
                                type="number"
                                value={newEsiForm.wage_ceiling}
                                onChange={(e) => setNewEsiForm({ ...newEsiForm, wage_ceiling: parseFloat(getValueFromInput(e)) || 0 })}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Employee Rate (%)"
                                    type="number"
                                    value={newEsiForm.employee_rate}
                                    onChange={(e) => setNewEsiForm({ ...newEsiForm, employee_rate: parseFloat(getValueFromInput(e)) || 0 })}
                                />
                                <CommonInputField
                                    label="Employer Rate (%)"
                                    type="number"
                                    value={newEsiForm.employer_rate}
                                    onChange={(e) => setNewEsiForm({ ...newEsiForm, employer_rate: parseFloat(getValueFromInput(e)) || 0 })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsAddEsiOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveNewEsi}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Save ESI Rate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomStatutoryConfig
