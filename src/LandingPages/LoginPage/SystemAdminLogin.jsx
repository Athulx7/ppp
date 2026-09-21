import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, Lock, Mail, ArrowLeft, Database, Server, Building2 } from 'lucide-react'
import axios from 'axios'

export default function SystemAdminLogin() {
    const navigate = useNavigate()
    const [loginInput, setLoginInput] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!loginInput.trim() || !password) {
            setError('Please enter both username/email and password.')
            return
        }

        setError('')
        setLoading(true)

        try {
            const url = 'http://localhost:3000/api/system/login'
            const res = await axios.post(url, {
                username: loginInput.trim(),
                password: password
            })

            if (res.data?.success) {
                sessionStorage.setItem('token', res.data.token)
                sessionStorage.setItem('user', JSON.stringify(res.data.admin))
                sessionStorage.setItem('isSystemAdmin', 'true')
                navigate('/system-admin')
            } else {
                setError(res.data?.message || 'Login failed')
            }
        } catch (err) {
            console.error('System Admin Login Error:', err)
            setError(err.response?.data?.message || err.message || 'Connection error with system server')
        } finally {
            setLoading(false)
        }
    }

    const year = new Date().getFullYear()

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
        }}>
            {/* Left Sidebar branding - matching LoginPage.jsx */}
            <div className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 bg-indigo-600 p-10">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="text-white w-5 h-5" />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">PPP Admin Console</span>
                </Link>

                <div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white tracking-wider uppercase inline-block mb-3">
                        Platform Super Admin
                    </span>
                    <p className="text-white text-2xl font-semibold leading-snug mb-3">
                        Multi-tenant control, database provisioning & client lifecycle.
                    </p>
                    <p className="text-indigo-200 text-sm leading-relaxed">
                        Manage client subscriptions, trial expirations, and automatically provision isolated tenant databases from template seeds.
                    </p>

                    <div className="flex gap-8 mt-8 pt-8 border-t border-white/20">
                        {[
                            { val: 'Isolated', label: 'Tenant DBs' },
                            { val: 'Automated', label: 'Provisioning' },
                            { val: '256-bit', label: 'Security' },
                        ].map((s, i) => (
                            <div key={i}>
                                <p className="text-white font-bold text-xl">{s.val}</p>
                                <p className="text-indigo-200 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-indigo-300 text-xs">© {year} PPP System Console. All rights reserved.</p>
            </div>

            {/* Right Login Area */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Top back button */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Client Sign In
                        </Link>
                        <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            Super Admin Access
                        </span>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="mb-6">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-3">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Admin Console</h1>
                            <p className="text-sm text-gray-500 mt-1">Sign in with super administrator credentials</p>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-5">
                                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Username or Email
                                </label>
                                <div className="relative">
                                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                                    <input
                                        type="text"
                                        value={loginInput}
                                        onChange={(e) => setLoginInput(e.target.value)}
                                        disabled={loading}
                                        placeholder="sysadmin or sysadmin@ppp.com"
                                        className="w-full pl-10 pr-3.5 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        placeholder="••••••••••••"
                                        className="w-full pl-10 pr-3.5 py-2.5 rounded-md border border-gray-200 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                        </svg>
                                        Verifying Session...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        Sign In to Super Admin Console
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                            <span className="flex items-center gap-1.5">
                                <Database className="w-3.5 h-3.5 text-emerald-600" />
                                Central Catalog
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Server className="w-3.5 h-3.5 text-indigo-600" />
                                System v2.4.0
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
