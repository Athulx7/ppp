import { useState, useEffect, useCallback } from 'react'

export function usePWA() {
    const [updateAvailable, setUpdateAvailable] = useState(false)
    const [waitingSW, setWaitingSW] = useState(null)
    const [pushGranted, setPushGranted] = useState(
        () => 'Notification' in window && Notification.permission === 'granted'
    )

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        const checkForWaiting = (registration) => {
            if (registration.waiting) {
                setWaitingSW(registration.waiting)
                setUpdateAvailable(true)
            }
        }

        navigator.serviceWorker.getRegistration().then(reg => {
            if (!reg) return
            checkForWaiting(reg)

            reg.addEventListener('updatefound', () => {
                const newSW = reg.installing
                if (!newSW) return
                newSW.addEventListener('statechange', () => {
                    if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                        setWaitingSW(newSW)
                        setUpdateAvailable(true)
                    }
                })
            })
        })

        let refreshing = false
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true
                window.location.reload()
            }
        })
    }, [])

    const updateApp = useCallback(() => {
        if (waitingSW) {
            waitingSW.postMessage({ type: 'SKIP_WAITING' })
        } else {
            window.location.reload()
        }
    }, [waitingSW])

    const requestPushPermission = useCallback(async () => {
        if (!('Notification' in window)) return false
        if (Notification.permission === 'granted') { setPushGranted(true); return true }
        if (Notification.permission === 'denied') return false

        const result = await Notification.requestPermission()
        const granted = result === 'granted'
        setPushGranted(granted)
        return granted
    }, [])

    const subscribeToPush = useCallback(async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null

        try {
            const reg = await navigator.serviceWorker.ready

            const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE'

            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            })

            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription }),
            })

            return subscription
        } catch (err) {
            console.error('Push subscribe error:', err)
            return null
        }
    }, [])

    const pushSupported = 'Notification' in window && 'PushManager' in window

    return {
        updateAvailable,
        updateApp,
        pushSupported,
        pushGranted,
        requestPushPermission,
        subscribeToPush,
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    return new Uint8Array([...rawData].map(c => c.charCodeAt(0)))
}