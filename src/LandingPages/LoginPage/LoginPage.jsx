import axios from 'axios'
import { Building2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function LoginPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        companyCode: '',
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [loginError, setLoginError] = useState('')

    const validateForm = () => {
        const newErrors = {}

        if (!formData.companyCode.trim()) {
            newErrors.companyCode = 'Company code is required'
        } else if (!/^[A-Z0-9]{4,8}$/i.test(formData.companyCode)) {
            newErrors.companyCode = 'Invalid company code format'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 1) {
            newErrors.password = 'Password must be at least 1 characters'
        }

        return newErrors
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
        if (loginError) setLoginError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const validationErrors = validateForm()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors({})
        setLoginError('')
        setLoading(true)

        try {
            const url = 'http://localhost:3000/api/login' //Express
            const payload = { company_code: formData.companyCode, email: formData.email, password: formData.password }
            const responce = await axios.post(url, payload, { headers: 'Content-Type: application/json' })
            console.log('Login successful:', responce)
            if (responce.data.success) {

                sessionStorage.setItem('token', responce.data.token)
                sessionStorage.setItem('company', JSON.stringify(responce.data.company))
                sessionStorage.setItem('user', JSON.stringify(responce.data.user))
                const userRole = responce.data.user.role_code.toUpperCase()
                switch (userRole) {
                    case 'ADMIN': navigate('/admin'); break
                    case 'HR': navigate('/hr'); break
                    case 'PAYROLL_MANAGER': navigate('/payroll'); break
                    case 'EMPLOYEE': navigate('/employee'); break
                    default: setLoginError('Unknown user role')
                }
            } else {
                setLoginError(responce.data.message || 'Login failed. Please try again.')
            }
        } catch (error) {
            setLoginError(error.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const date = new Date()
    const year = date.getFullYear()

    return (
        <div className="min-h-screen bg-gray-50 flex" style={{
            backgroundImage: ` linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px) `, backgroundSize: '48px 48px'
        }}>

            <div className="hidden lg:flex flex-col justify-between w-96 flex-shrink-0 bg-indigo-600 p-10">
                <Link to={'/'} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        <Building2 className='text-white' />
                    </div>
                    <span className="text-white font-bold text-lg tracking-tight">PPP</span>
                </Link>

                <div>
                    <p className="text-white text-2xl font-semibold leading-snug mb-3">
                        Everything your team needs, in one place.
                    </p>
                    <p className="text-indigo-200 text-sm leading-relaxed">
                        Manage employees, run payroll, and handle HR — fast, secure, and simple.
                    </p>

                    <div className="flex gap-8 mt-8 pt-8 border-t border-white/20">
                        {[
                            { val: '99.9%', label: 'Uptime' },
                            { val: '256-bit', label: 'Encryption' },
                            { val: '24/7', label: 'Support' },
                        ].map((s, i) => (
                            <div key={i}>
                                <p className="text-white font-bold text-xl">{s.val}</p>
                                <p className="text-indigo-200 text-xs mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-indigo-300 text-xs">© {year} PPP. All rights reserved.</p>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md">

                    <Link to={'/'} className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <Building2 className='text-white' />
                        </div>
                        <span className="text-gray-900 font-bold text-base">PPP</span>
                    </Link>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                        <div className="mb-7">
                            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                            <p className="text-sm text-gray-500 mt-1">Sign in to access your workspace</p>
                        </div>

                        {loginError && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-md px-4 py-3 mb-6">
                                <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-9.75a.75.75 0 011.5 0v3.5a.75.75 0 01-1.5 0v-3.5zm.75 6.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-600">{loginError}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Company Code
                                </label>
                                <input
                                    type="text"
                                    name="companyCode"
                                    value={formData.companyCode}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="e.g. CMP01"
                                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-gray-900 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed
                                        ${errors.companyCode ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.companyCode && (
                                    <p className="text-xs text-red-500 mt-1.5">{errors.companyCode}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="you@company.com"
                                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-gray-900 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed
                                        ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition">
                                        Forgot password?
                                    </a>
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    placeholder="Enter your password"
                                    className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-gray-900 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed
                                        ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500 mt-1.5">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    disabled={loading}
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <label htmlFor="remember-me" className="text-sm text-gray-600 cursor-pointer select-none">
                                    Keep me signed in
                                </label>
                            </div>

                            <div className="border-t border-gray-100 pt-1" />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign In'}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginPage