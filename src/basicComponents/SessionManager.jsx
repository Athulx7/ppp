import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Clock, AlertTriangle, LogOut, RefreshCw, ShieldAlert, CheckCircle2, X } from 'lucide-react'
import { ApiCall, getTokenData } from '../library/constants'

const WARNING_THRESHOLD_SECONDS = 300

function SessionManager() {
    const navigate = useNavigate()
    const location = useLocation()

    const [secondsLeft, setSecondsLeft] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [isToastDismissed, setIsToastDismissed] = useState(false)
    const [showExpiredModal, setShowExpiredModal] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [expiredReason, setExpiredReason] = useState('Your session has expired. Please log in again.')

    const lastSeenTokenRef = useRef(null)

    const isPublicPage = location.pathname === '/' || location.pathname === '/'

    const handleLogout = useCallback(() => {
        setShowToast(false)
        setShowExpiredModal(false)
        sessionStorage.clear()
        navigate('/', { replace: true })
    }, [navigate])

    const handleExtendSession = async () => {
        setIsRefreshing(true)
        try {
            const res = await ApiCall('post', '/auth/refresh-token')
            if (res.data?.success && res.data?.token) {
                sessionStorage.setItem('token', res.data.token)
                lastSeenTokenRef.current = res.data.token
                setShowToast(false)
                setIsToastDismissed(false)

                const decoded = getTokenData()
                if (decoded?.exp) {
                    const remaining = Math.floor(decoded.exp - Date.now() / 1000)
                    setSecondsLeft(remaining > 0 ? remaining : 0)
                }
            } else {
                setShowToast(false)
                setShowExpiredModal(true)
            }
        } catch (error) {
            console.error('Failed to extend session:', error)
            setShowToast(false)
            setShowExpiredModal(true)
        } finally {
            setIsRefreshing(false)
        }
    }

    const handleDismissToast = () => {
        setShowToast(false)
        setIsToastDismissed(true)
    }

    useEffect(() => {
        const handleSessionExpiredEvent = (e) => {
            if (isPublicPage) return
            const reason = e?.detail?.message || 'Your session has expired. Please log in again.'
            setExpiredReason(reason)
            setShowToast(false)
            setShowExpiredModal(true)
        }

        window.addEventListener('session-expired', handleSessionExpiredEvent)
        return () => {
            window.removeEventListener('session-expired', handleSessionExpiredEvent)
        }
    }, [isPublicPage])

    useEffect(() => {
        if (isPublicPage) {
            setShowToast(false)
            setShowExpiredModal(false)
            return
        }

        const checkToken = () => {
            const token = sessionStorage.getItem('token')
            if (!token) {
                setShowToast(false)
                return
            }

            if (token !== lastSeenTokenRef.current) {
                lastSeenTokenRef.current = token
                setIsToastDismissed(false)
            }

            const decoded = getTokenData()
            if (!decoded?.exp) {
                return
            }

            const currentUnix = Math.floor(Date.now() / 1000)
            const remaining = decoded.exp - currentUnix

            setSecondsLeft(remaining > 0 ? remaining : 0)

            if (remaining <= 0) {
                setShowToast(false)
                setShowExpiredModal(true)
            } else if (remaining <= WARNING_THRESHOLD_SECONDS) {
                if (!showExpiredModal && !isToastDismissed) {
                    setShowToast(true)
                }
            } else {
                setShowToast(false)
            }
        }

        checkToken()

        const intervalId = setInterval(checkToken, 1000)
        return () => clearInterval(intervalId)
    }, [isPublicPage, showExpiredModal, isToastDismissed])

    const formatTime = (totalSeconds) => {
        if (totalSeconds === null || totalSeconds < 0) return '00:00'
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }

    if (isPublicPage) return null

    return (
        <>
            {showToast && !showExpiredModal && (
                <aside
                    aria-label="Session expiration warning"
                    className="fixed bottom-5 left-5 z-[9999] max-w-sm w-full pointer-events-auto transition-all animate-slideIn"
                >
                    <div className="bg-white/95 backdrop-blur-md border border-amber-300 shadow-2xl rounded-lg p-4 text-gray-800 relative ring-1 ring-amber-400/30">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-200">
                                    <Clock className="w-4 h-4 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 leading-tight">
                                        Session Expiring Soon
                                    </h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                        Extend your session to stay logged in
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleDismissToast}
                                title="Dismiss notification"
                                aria-label="Dismiss notification"
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="mt-3 bg-amber-50/90 border border-amber-200/80 rounded-md px-3.5 py-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-medium text-amber-900">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>Time remaining:</span>
                            </div>
                            <span className="font-mono text-base font-bold text-amber-700 bg-white px-2.5 py-0.5 rounded-md border border-amber-200/80 shadow-2xs">
                                {formatTime(secondsLeft)}
                            </span>
                        </div>

                        <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isRefreshing}
                                className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                Log Out
                            </button>

                            <button
                                type="button"
                                onClick={handleExtendSession}
                                disabled={isRefreshing}
                                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-md shadow-sm shadow-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer disabled:bg-indigo-400"
                            >
                                {isRefreshing ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Reset Token
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </aside>
            )}

            {showExpiredModal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="expired-modal-title"
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
                >
                    <div className="bg-white rounded-md shadow-2xl border border-rose-200 max-w-sm w-full overflow-hidden transform transition-all animate-scaleUp">

                        <div className="bg-gradient-to-r from-rose-600 to-red-600 p-5 text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-inner">
                                <ShieldAlert className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 id="expired-modal-title" className="font-bold text-lg leading-tight">Session Expired</h3>
                                <p className="text-xs text-rose-100 mt-0.5">Authentication required</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-3">
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {expiredReason}
                            </p>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Your session has timed out. Please click OK below to return to the login page and sign in again.
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                OK — Re-Login
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default SessionManager
