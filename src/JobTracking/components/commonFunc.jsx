import { CircleDot, Edit, Eye, Flag, GitBranch, RefreshCw, User as UserIcon, Clock3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function formatDuration(totalMinutes) {
    const mins = Number(totalMinutes) || 0
    const h = Math.floor(mins / 60)
    const m = Math.floor(mins % 60)
    if (h > 0) return `${h}h ${m}m`
    return `${m}m`
}

export function formatDurationFromSeconds(secs) {
    if (!secs) return '00:00:00'
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = Math.floor(secs % 60)
    const pad = (n) => String(n).padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    })
}

const TAILWIND_COLOR_MAP = [
    { hex: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
    { hex: '#64748B', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
    { hex: '#4F46E5', bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-500' },
    { hex: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    { hex: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    { hex: '#22C55E', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
    { hex: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    { hex: '#F97316', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    { hex: '#EF4444', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
]

function hexDistance(a, b) {
    const parse = (hex) => {
        const h = hex.replace('#', '')
        return [parseInt(h.substring(0, 2), 16), parseInt(h.substring(2, 4), 16), parseInt(h.substring(4, 6), 16)]
    }
    try {
        const [r1, g1, b1] = parse(a)
        const [r2, g2, b2] = parse(b)
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    } catch {
        return Infinity
    }
}

export function getColorClasses(colorCode) {
    if (!colorCode) return TAILWIND_COLOR_MAP[1]
    const normalized = colorCode.startsWith('#') ? colorCode : `#${colorCode}`
    let closest = TAILWIND_COLOR_MAP[1]
    let minDist = Infinity
    for (const entry of TAILWIND_COLOR_MAP) {
        const d = hexDistance(normalized, entry.hex)
        if (d < minDist) {
            minDist = d
            closest = entry
        }
    }
    return closest
}

export function StatusBadge({ status }) {
    if (!status) return null
    const cfg = getColorClasses(status.color_code)
    const isRunning = status.status_code === 'RUNNING'
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {isRunning ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CircleDot className="w-3 h-3" />}
            {status.status_name}
        </span>
    )
}

export function PriorityBadge({ priority }) {
    if (!priority) return null;
    const cfg = getColorClasses(priority.color_code);
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Flag className="w-3 h-3" />
            {priority.priority_name}
        </span>
    )
}

export function priorityDotClass(priority) {
    return getColorClasses(priority?.color_code).dot
}

export function statusDotClass(status) {
    return getColorClasses(status?.color_code).dot
}

export function resolveEmployee(empCode, employees = []) {
    if (!empCode) return null
    return employees.find((e) => e.emp_code === empCode) || { emp_code: empCode, emp_name: empCode }
}

export function UserBadge({ empCode, employees = [], size = 'sm' }) {
    const user = resolveEmployee(empCode, employees)
    if (!user) return null
    const sizeClasses = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-8 h-8 text-sm'
    const initial = (user.emp_name || user.emp_code || '?').charAt(0).toUpperCase()
    return (
        <div className="flex items-center gap-1.5" title={user.emp_code}>
            <div className={`${sizeClasses} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium border border-indigo-200 flex-shrink-0`}>
                {initial}
            </div>
            <span className="text-xs text-gray-700 truncate">{user.emp_name || user.emp_code}</span>
        </div>
    )
}

export function MetadataRow({ job, employees = [], className = '' }) {
    const creator = resolveEmployee(job.created_by_emp_code, employees)
    return (
        <div className={`flex items-center gap-3 text-[10px] text-gray-400 ${className}`}>
            <div className="flex items-center gap-1">
                <UserIcon className="w-3 h-3" />
                <span>{creator?.emp_name || job.created_by_emp_code || 'System'}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                <span>{formatDate(job.created_date)}</span>
            </div>
            {job.updated_date && job.updated_date !== job.created_date && (
                <div className="flex items-center gap-1 text-gray-300">
                    <Edit className="w-3 h-3" />
                    <span>{formatDate(job.updated_date)}</span>
                </div>
            )}
        </div>
    )
}

export function ProgressBar({ estimatedMinutes, spentMinutes, isRunning, runningStartTime, size = 'sm' }) {
    const [liveMinutes, setLiveMinutes] = useState(spentMinutes || 0)
    const ref = useRef(null)

    useEffect(() => {
        if (!isRunning || !runningStartTime) {
            setLiveMinutes(spentMinutes || 0)
            return
        }
        const start = new Date(runningStartTime).getTime()
        const tick = () => {
            const elapsedMins = (Date.now() - start) / 60000
            setLiveMinutes((spentMinutes || 0) + elapsedMins)
        }
        tick()
        ref.current = setInterval(tick, 1000)
        return () => clearInterval(ref.current)
    }, [isRunning, runningStartTime, spentMinutes])

    if (!estimatedMinutes || estimatedMinutes <= 0) return null

    const pct = Math.min((liveMinutes / estimatedMinutes) * 100, 100)
    const over = liveMinutes > estimatedMinutes
    const overPct = over ? Math.min(((liveMinutes - estimatedMinutes) / estimatedMinutes) * 100, 100) : 0
    const barHeight = size === 'sm' ? 'h-1.5' : 'h-2'

    return (
        <div className="mt-1">
            <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-gray-400">Progress</span>
                <span className={`text-[10px] font-mono ${over ? 'text-red-500' : 'text-gray-500'}`}>
                    {formatDuration(liveMinutes)} / {formatDuration(estimatedMinutes)}
                </span>
            </div>
            <div className={`relative ${barHeight} bg-gray-100 rounded-full overflow-hidden`}>
                <div
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${over ? 'bg-red-400' : isRunning ? 'bg-indigo-500' : 'bg-green-500'}`}
                    style={{ width: `${pct}%` }}
                />
                {over && (
                    <div className="absolute right-0 top-0 h-full rounded-full bg-red-300 animate-pulse" style={{ width: `${overPct}%` }} />
                )}
            </div>
        </div>
    )
}

export function LiveTimer({ startTime, small = false }) {
    const [elapsedSecs, setElapsedSecs] = useState(0)
    const ref = useRef(null)
    useEffect(() => {
        if (!startTime) return
        const start = new Date(startTime).getTime()
        const tick = () => setElapsedSecs(Math.max(0, Math.floor((Date.now() - start) / 1000)))
        tick()
        ref.current = setInterval(tick, 1000)
        return () => clearInterval(ref.current)
    }, [startTime])
    return (
        <span className={small ? 'font-mono text-xs font-bold text-indigo-700' : 'font-mono text-lg font-bold text-indigo-700'}>
            {formatDurationFromSeconds(elapsedSecs)}
        </span>
    )
}

export function buildJobTree(flatJobs) {
    const byId = new Map()
    flatJobs.forEach((j) => byId.set(j.job_id, { ...j, subJobs: [] }))

    const roots = []
    byId.forEach((job) => {
        if (job.parent_job_id && byId.has(job.parent_job_id)) {
            byId.get(job.parent_job_id).subJobs.push(job)
        } else {
            roots.push(job)
        }
    })
    return roots
}

export function flattenJobTree(tree) {
    const result = []
    tree.forEach((job) => {
        result.push(job)
        if (job.subJobs?.length) result.push(...flattenJobTree(job.subJobs))
    })
    return result
}