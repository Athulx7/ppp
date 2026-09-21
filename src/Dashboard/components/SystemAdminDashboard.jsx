import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ShieldCheck, Building2, Database, Users, Clock, AlertTriangle, CheckCircle2,
    Plus, Search, RefreshCw, Power, LogOut, HardDrive, AlertCircle, Calendar, Key, Check
} from 'lucide-react'
import axios from 'axios'
import NewClientWizardModal from './systemAdmin/NewClientWizardModal'
import RenewClientModal from './systemAdmin/RenewClientModal'
import TemplateDbGuideModal from './systemAdmin/TemplateDbGuideModal'

export default function SystemAdminDashboard() {
    const navigate = useNavigate()
    const [metrics, setMetrics] = useState({
        totalClients: 0,
        activeClients: 0,
        trialClients: 0,
        suspendedClients: 0,
        expiredClients: 0,
        expiringSoonClients: 0
    })

    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('ALL')

    // Modals
    const [isNewClientOpen, setIsNewClientOpen] = useState(false)
    const [renewModalClient, setRenewModalClient] = useState(null)
    const [isGuideOpen, setIsGuideOpen] = useState(false)

    // Current Admin User
    const adminUser = JSON.parse(sessionStorage.getItem('user') || '{}')

    // Live Clock
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const token = sessionStorage.getItem('token')
            const headers = { Authorization: `Bearer ${token}` }

            const [metricsRes, clientsRes] = await Promise.all([
                axios.get('http://localhost:3000/api/system/metrics', { headers }),
                axios.get(`http://localhost:3000/api/system/clients?search=${encodeURIComponent(searchTerm)}&status=${statusFilter}`, { headers })
            ])

            if (metricsRes.data?.success) setMetrics(metricsRes.data.data)
            if (clientsRes.data?.success) setClients(clientsRes.data.data)
        } catch (err) {
            console.error('Failed to load system admin data:', err)
            if (err.response?.status === 401 || err.response?.status === 403) {
                sessionStorage.clear()
                navigate('/system-admin/login')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [statusFilter])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        fetchDashboardData()
    }

    const handleLogout = () => {
        sessionStorage.clear()
        navigate('/system-admin/login')
    }

    const handleToggleStatus = async (companyCode, currentActive) => {
        const confirmMsg = currentActive
            ? `Are you sure you want to suspend client ${companyCode}? Their users will be temporarily unable to log in.`
            : `Reactivate client ${companyCode}?`

        if (!window.confirm(confirmMsg)) return

        try {
            const token = sessionStorage.getItem('token')
            await axios.put(`http://localhost:3000/api/system/clients/${companyCode}/status`, {
                active: !currentActive
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchDashboardData()
        } catch (err) {
            console.error('Toggle status error:', err)
            alert(err.response?.data?.message || 'Failed to update client status')
        }
    }

    const getStatusBadge = (client) => {
        const status = client.calculatedStatus || client.subscription_status || 'ACTIVE'

        switch (status) {
            case 'ACTIVE':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                    </span>
                )
            case 'TRIAL':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Trial
                    </span>
                )
            case 'EXPIRING_SOON':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Expiring Soon
                    </span>
                )
            case 'EXPIRED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Expired
                    </span>
                )
            case 'SUSPENDED':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                        Suspended
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs bg-gray-100 text-gray-700 font-medium">
                        {status}
                    </span>
                )
        }
    }

    const getValidityDisplay = (client) => {
        if (!client.effectiveEndDate) return <span className="text-gray-400 text-xs">Continuous</span>

        const days = client.daysRemaining
        const formattedDate = new Date(client.effectiveEndDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

        if (days < 0) {
            return (
                <div>
                    <span className="text-xs font-bold text-rose-600">Expired ({Math.abs(days)}d ago)</span>
                    <p className="text-[11px] text-gray-500">{formattedDate}</p>
                </div>
            )
        }

        if (days <= 7) {
            return (
                <div>
                    <span className="text-xs font-bold text-amber-600">{days} days remaining</span>
                    <p className="text-[11px] text-gray-500">{formattedDate}</p>
                </div>
            )
        }

        return (
            <div>
                <span className="text-xs font-medium text-gray-900">{days} days left</span>
                <p className="text-[11px] text-gray-500">{formattedDate}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col font-sans">
            {/* Top Header - Matching Application TopHeader */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-xs">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-base text-gray-900 tracking-tight">PPP Admin Console</span>
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Super Admin
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-500">Central Platform & Tenant Management</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Live Clock Chip */}
                    <div className="hidden md:flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}</span>
                    </div>

                    {/* Admin User Chip */}
                    <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            {adminUser.full_name?.charAt(0) || 'S'}
                        </div>
                        <div className="hidden sm:block text-left text-xs">
                            <p className="font-semibold text-gray-900 leading-tight">{adminUser.full_name || 'Platform Admin'}</p>
                            <p className="text-[11px] text-gray-500">{adminUser.email || 'sysadmin@ppp.com'}</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title="Sign Out"
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
                {/* Hero / Action Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200/80 shadow-xs">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            Client Organizations & Tenant Databases
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Provision isolated client databases, manage trial periods, customize roles and labels, and extend subscriptions.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsGuideOpen(true)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                            <Database className="w-4 h-4 text-indigo-600" />
                            Template DB & Backup Guide
                        </button>

                        <button
                            onClick={() => setIsNewClientOpen(true)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add New Client
                        </button>
                    </div>
                </div>

                {/* KPI Metrics Cards - Matching AdminDashboard Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Total Clients</span>
                            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <Building2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{metrics.totalClients}</div>
                        <span className="text-[11px] text-gray-500">Provisioned tenants</span>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
                            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600">{metrics.activeClients}</div>
                        <span className="text-[11px] text-gray-500">Active accounts</span>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Trials</span>
                            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-sky-600">{metrics.trialClients}</div>
                        <span className="text-[11px] text-gray-500">Under evaluation</span>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Expiring Soon</span>
                            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                                <AlertTriangle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-amber-600">{metrics.expiringSoonClients}</div>
                        <span className="text-[11px] text-gray-500">Next 7 days</span>
                    </div>

                    <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 p-4 col-span-2 md:col-span-1">
                        <div className="flex items-center justify-between text-gray-500 mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider">Expired / Susp.</span>
                            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-rose-600">
                            {(metrics.expiredClients || 0) + (metrics.suspendedClients || 0)}
                        </div>
                        <span className="text-[11px] text-gray-500">Action required</span>
                    </div>
                </div>

                {/* Clients Directory Table Card */}
                <div className="bg-white rounded-xl shadow-xs border border-gray-200/80 overflow-hidden">
                    {/* Search & Filter Header */}
                    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/60">
                        {/* Status Filter Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar w-full md:w-auto pb-1 md:pb-0">
                            {[
                                { id: 'ALL', label: 'All Clients' },
                                { id: 'ACTIVE', label: 'Active' },
                                { id: 'TRIAL', label: 'Trials' },
                                { id: 'EXPIRING_SOON', label: 'Expiring Soon' },
                                { id: 'EXPIRED', label: 'Expired' },
                                { id: 'SUSPENDED', label: 'Suspended' },
                            ].map((pill) => (
                                <button
                                    key={pill.id}
                                    onClick={() => setStatusFilter(pill.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${statusFilter === pill.id
                                            ? 'bg-indigo-600 text-white shadow-xs'
                                            : 'bg-white text-gray-600 hover:text-gray-900 border border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-72">
                            <div className="relative w-full">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search code, name, email..."
                                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Directory Table */}
                    <div className="overflow-x-auto scrollbar">
                        <table className="w-full text-left text-xs text-gray-700">
                            <thead className="bg-gray-50 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200">
                                <tr>
                                    <th className="py-3 px-5">Client / Organization</th>
                                    <th className="py-3 px-5">Database Instance</th>
                                    <th className="py-3 px-5">Contact Details</th>
                                    <th className="py-3 px-5">Plan & Limit</th>
                                    <th className="py-3 px-5">Status</th>
                                    <th className="py-3 px-5">Validity</th>
                                    <th className="py-3 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                                                <span>Loading client directory...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-12 text-center text-gray-400">
                                            No clients found matching the search criteria.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.company_code} className="hover:bg-gray-50/80 transition-colors">
                                            {/* Client / Organization */}
                                            <td className="py-3.5 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-mono font-bold text-xs text-indigo-600 shadow-xs">
                                                        {client.company_code.substring(0, 4)}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 text-sm block">
                                                            {client.company_name}
                                                        </span>
                                                        <span className="font-mono text-xs text-gray-500">
                                                            Code: {client.company_code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Database */}
                                            <td className="py-3.5 px-5">
                                                <div className="font-mono text-xs text-gray-900 font-semibold flex items-center gap-1.5">
                                                    <Database className="w-3.5 h-3.5 text-indigo-600" />
                                                    {client.db_name}
                                                </div>
                                                <p className="text-[11px] text-gray-500">{client.db_host}:{client.db_port || 1433}</p>
                                            </td>

                                            {/* Contact */}
                                            <td className="py-3.5 px-5">
                                                <span className="text-gray-900 block font-medium">
                                                    {client.contact_person || 'Not specified'}
                                                </span>
                                                <span className="text-gray-500 text-[11px] block">
                                                    {client.contact_email || 'No email'}
                                                </span>
                                            </td>

                                            {/* Plan & Limit */}
                                            <td className="py-3.5 px-5">
                                                <span className="font-semibold text-gray-900 uppercase text-[11px]">
                                                    {client.subscription_plan || 'TRIAL'}
                                                </span>
                                                <p className="text-[11px] text-gray-500">
                                                    Max: {client.max_employees || 50} users
                                                </p>
                                            </td>

                                            {/* Status */}
                                            <td className="py-3.5 px-5">
                                                {getStatusBadge(client)}
                                            </td>

                                            {/* Validity */}
                                            <td className="py-3.5 px-5">
                                                {getValidityDisplay(client)}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setRenewModalClient(client)}
                                                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 transition-colors cursor-pointer shadow-xs"
                                                        title="Renew or extend subscription"
                                                    >
                                                        Renew
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(client.company_code, client.active === 1)}
                                                        className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer border ${client.active === 1
                                                                ? 'text-gray-500 hover:text-red-600 hover:bg-red-50 border-gray-200'
                                                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                                                            }`}
                                                        title={client.active === 1 ? 'Suspend Client' : 'Reactivate Client'}
                                                    >
                                                        <Power className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modals */}
            <NewClientWizardModal
                isOpen={isNewClientOpen}
                onClose={() => setIsNewClientOpen(false)}
                onSuccess={() => {
                    fetchDashboardData()
                }}
            />

            <RenewClientModal
                isOpen={!!renewModalClient}
                client={renewModalClient}
                onClose={() => setRenewModalClient(null)}
                onSuccess={() => {
                    fetchDashboardData()
                }}
            />

            <TemplateDbGuideModal
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />
        </div>
    )
}
