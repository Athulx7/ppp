import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        companyCode: '',
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyCode.trim()) {
            newErrors.companyCode = 'Company code is required';
        } else if (!/^[A-Z0-9]{4,8}$/i.test(formData.companyCode)) {
            newErrors.companyCode = 'Invalid company code format';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 1) {
            newErrors.password = 'Password must be at least 1 characters';
        }

        return newErrors;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (loginError) setLoginError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setLoginError('');
        setLoading(true);

        try {
            const url = 'http://localhost:3000/api/login' //Express
            const payload = {company_code: formData.companyCode, email: formData.email, password: formData.password }
            const responce = await axios.post(url,payload, {headers : 'Content-Type: application/json'})
            console.log('Login successful:', responce);
            if(responce.data.success) { 
                console.log(responce.data.token)
                console.log(responce.data.company)
                console.log(responce.data.user)
                sessionStorage.setItem('token', responce.data.token)
                sessionStorage.setItem('company', JSON.stringify(responce.data.company))
                sessionStorage.setItem('user', JSON.stringify(responce.data.user))
            }
            else{
                setLoginError(responce.data.message || 'Login failed. Please try again.');
                return;
            }
        } catch (error) {
            setLoginError(error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y- bg-white rounded-md">
                <div className="text-center mt-3">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-2xl font-bold">PPP</span>
                        </div>
                    </div>

                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                <div className="p-5 md:p-7">
                    {loginError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm font-medium text-center">
                                {loginError}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-bold">Company Code</label>
                            <input
                                type="text"
                                name="companyCode"
                                value={formData.companyCode}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border ${errors.companyCode ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="e.g., HRMS01"
                                disabled={loading}
                            />
                            {errors.companyCode && <p className="text-red-500 text-sm mt-1">{errors.companyCode}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2 font-bold">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="your.email@company.com"
                                disabled={loading}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-gray-700 font-bold">Password</label>
                                <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot password?</a>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                                placeholder="Enter your password"
                                disabled={loading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                id="remember-me"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                disabled={loading}
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 flex items-center justify-center ${loading ? 'cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default LoginPage