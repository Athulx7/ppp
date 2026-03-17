import { Clock3, Coffee, Edit, Eye, GitBranch, Info, Play, Plus, Square, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CommonModal from "../../basicComponents/CommonModal";
import CommonButton from "../../basicComponents/CommonButton";

export function formatDuration(secs) {
    if (!secs) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function generateId(prefix = 'JOB') {
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${ts}${rand}`;
}

export function generateSubJobId(parentId) {
    // Sub-job ID now follows format: parentId:SUB-XXX
    const ts = Date.now().toString().slice(-4);
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${parentId}:SUB-${ts}${rand}`;
}

export const PRIORITY_CONFIG = {
    Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', bar: 'bg-green-500', icon: <Flag className="w-3 h-3" /> },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-500', icon: <Flag className="w-3 h-3" /> },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', bar: 'bg-orange-500', icon: <Flag className="w-3 h-3" /> },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', bar: 'bg-red-500', icon: <Flag className="w-3 h-3" /> },
};

export const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle', icon: <CircleDot className="w-3 h-3" />, kanbanCol: 'idle' },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running', icon: <RefreshCw className="w-3 h-3 animate-spin" />, kanbanCol: 'running' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" />, kanbanCol: 'completed' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: <ArrowRight className="w-3 h-3" />, kanbanCol: 'in-progress' },
    'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On Hold', icon: <Clock className="w-3 h-3" />, kanbanCol: 'on-hold' },
    'in-review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review', icon: <Eye className="w-3 h-3" />, kanbanCol: 'in-review' },
    refer: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Referred', icon: <UserPlus className="w-3 h-3" />, kanbanCol: 'refer' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Archived', icon: <Archive className="w-3 h-3" />, kanbanCol: 'archived' },
};

export const KANBAN_COLUMNS = [
    { key: 'idle', label: 'Idle', color: 'border-gray-300', headerBg: 'bg-gray-50', dot: 'bg-gray-400' },
    { key: 'running', label: 'Running', color: 'border-indigo-400', headerBg: 'bg-indigo-50', dot: 'bg-indigo-500' },
    { key: 'in-progress', label: 'In Progress', color: 'border-blue-400', headerBg: 'bg-blue-50', dot: 'bg-blue-500' },
    { key: 'in-review', label: 'In Review', color: 'border-purple-400', headerBg: 'bg-purple-50', dot: 'bg-purple-500' },
    { key: 'on-hold', label: 'On Hold', color: 'border-amber-400', headerBg: 'bg-amber-50', dot: 'bg-amber-500' },
    { key: 'completed', label: 'Completed', color: 'border-green-400', headerBg: 'bg-green-50', dot: 'bg-green-500' },
    { key: 'refer', label: 'Referred', color: 'border-orange-400', headerBg: 'bg-orange-50', dot: 'bg-orange-500' },
];

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'].map(v => ({ label: v, value: v }));
export const STOP_STATUS_OPTIONS = [
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Refer to Another', value: 'refer' },
];

export const AVAILABLE_USERS = [
    { id: 'USR001', name: 'John Doe', team: 'Development', email: 'john@example.com' },
    { id: 'USR002', name: 'Jane Smith', team: 'Development', email: 'jane@example.com' },
    { id: 'USR003', name: 'Mike Johnson', team: 'QA', email: 'mike@example.com' },
    { id: 'USR004', name: 'Sarah Williams', team: 'DevOps', email: 'sarah@example.com' },
    { id: 'USR005', name: 'Tom Brown', team: 'UI/UX', email: 'tom@example.com' },
];

export const AVAILABLE_TEAMS = ['Development', 'QA', 'DevOps', 'UI/UX', 'Management', 'Support'];

export function ProgressBar({ estTime, elapsedSecs, isRunning, startedAt, pausedSecs, lunchActive, size = 'sm' }) {
    const [live, setLive] = useState(elapsedSecs || 0);
    const ref = useRef(null);

    useEffect(() => {
        if (!isRunning || !startedAt) { setLive(elapsedSecs || 0); return; }
        const tick = () => {
            if (lunchActive) return;
            setLive(Math.max(0, Math.floor((Date.now() - startedAt) / 1000) - (pausedSecs || 0)));
        };
        tick();
        ref.current = setInterval(tick, 1000);
        return () => clearInterval(ref.current);
    }, [isRunning, startedAt, pausedSecs, lunchActive, elapsedSecs]);

    if (!estTime || estTime <= 0) return null;

    const estSecs = estTime * 60;
    const pct = Math.min((live / estSecs) * 100, 100);
    const over = live > estSecs;
    const overPct = over ? Math.min(((live - estSecs) / estSecs) * 100, 100) : 0;

    const barHeight = size === 'sm' ? 'h-1.5' : 'h-2';

    return (
        <div className="mt-1">
            <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] text-gray-400">Progress</span>
                <span className={`text-[10px] font-mono ${over ? 'text-red-500' : 'text-gray-500'}`}>
                    {formatDuration(live)} / {estTime}m
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
    );
}

export function MetadataRow({ job, className = '' }) {
    return (
        <div className={`flex items-center gap-3 text-[10px] text-gray-400 ${className}`}>
            <div className="flex items-center gap-1">
                <UserCircle className="w-3 h-3" />
                <span>{job.createdBy?.name || 'System'}</span>
            </div>
            <div className="flex items-center gap-1">
                <Clock3 className="w-3 h-3" />
                <span>{formatDate(job.createdAt)}</span>
            </div>
            {job.metadata?.lastModified && job.metadata.lastModified !== job.createdAt && (
                <div className="flex items-center gap-1 text-gray-300">
                    <Edit className="w-3 h-3" />
                    <span>{formatDate(job.metadata.lastModified)}</span>
                </div>
            )}
        </div>
    );
}

export function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}{cfg.label}
        </span>
    );
}

export function PriorityBadge({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.icon}{priority}
        </span>
    );
}

export function UserBadge({ user, size = 'sm' }) {
    if (!user) return null;
    const sizeClasses = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-8 h-8 text-sm';
    return (
        <div className="flex items-center gap-1.5" title={user.email}>
            <div className={`${sizeClasses} rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium border border-indigo-200`}>
                {user.name.charAt(0)}
            </div>
            <span className="text-xs text-gray-700">{user.name}</span>
        </div>
    );
}

export function LiveTimer({ startedAt, pausedSecs, isLunchActive, small = false }) {
    const [elapsed, setElapsed] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
        if (!startedAt) return;
        const tick = () => {
            if (isLunchActive) return;
            setElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000) - (pausedSecs || 0)));
        };
        tick();
        ref.current = setInterval(tick, 1000);
        return () => clearInterval(ref.current);
    }, [startedAt, pausedSecs, isLunchActive]);
    return (
        <span className={small
            ? 'font-mono text-xs font-bold text-indigo-700'
            : 'font-mono text-lg font-bold text-indigo-700'
        }>
            {formatDuration(elapsed)}
        </span>
    );
}

export function insertSubJob(nodes, targetId, newSub) {
    return nodes.map(node => {
        if (node.id === targetId) return { ...node, subJobs: [...(node.subJobs || []), newSub] };
        if (node.subJobs?.length) return { ...node, subJobs: insertSubJob(node.subJobs, targetId, newSub) };
        return node;
    });
}

export function updateJobInTree(nodes, targetId, updaterFn) {
    return nodes.map(node => {
        if (node.id === targetId) return updaterFn(node);
        if (node.subJobs?.length) return { ...node, subJobs: updateJobInTree(node.subJobs, targetId, updaterFn) };
        return node;
    });
}

// Flatten all jobs + sub-jobs into a single list
export function flattenAllJobs(jobs) {
    const result = [];
    jobs.forEach(job => {
        result.push(job);
        (job.subJobs || []).forEach(sub => {
            result.push(sub);
        });
    });
    return result;
}

// ─── Kanban Card (cleaner design) ──────────────────────────────────────────
export function KanbanCard({ job, runningJobId, onRun, onStop, onDetails, onSubJob, lunchActive }) {
    const isRunning = job.status === 'running';
    const canRun = !runningJobId || runningJobId === job.id;
    const pCfg = PRIORITY_CONFIG[job.priority] || PRIORITY_CONFIG.Medium;
    const isSubJob = !!job.parentId;
    const parentId = job.parentId ? job.parentId.split(':')[0] : null;

    return (
        <div className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer
            ${isRunning ? 'border-indigo-300 ring-1 ring-indigo-200' :
                isSubJob ? 'border-l-4 border-l-purple-400 border-gray-200' : 'border-gray-200'}`}
            onClick={() => onDetails(job)}>

            {/* Card Header */}
            <div className="p-3">
                {/* Top Row - IDs and Priority */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded border
                            ${isSubJob ? 'text-purple-600 bg-purple-50 border-purple-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                            {job.id}
                        </span>
                        {isSubJob && parentId && (
                            <span className="text-[8px] text-purple-400 bg-purple-50 px-1 py-0.5 rounded border border-purple-100">
                                ← {parentId}
                            </span>
                        )}
                    </div>
                    <PriorityBadge priority={job.priority} />
                </div>

                {/* Title */}
                <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">{job.title}</h4>

                {/* Assignment */}
                {job.assignedTo && (
                    <div className="mb-2">
                        <UserBadge user={job.assignedTo} size="sm" />
                    </div>
                )}

                {/* Status and Time */}
                <div className="flex items-center justify-between mb-2">
                    <StatusBadge status={job.status} />
                    {job.estTime > 0 && (
                        <span className="text-[10px] text-gray-400">{job.estTime}m</span>
                    )}
                </div>

                {/* Progress Bar */}
                {job.estTime > 0 && (
                    <ProgressBar
                        estTime={job.estTime}
                        elapsedSecs={job.elapsedSecs}
                        isRunning={isRunning}
                        startedAt={job.startedAt}
                        pausedSecs={job.pausedSecs}
                        lunchActive={lunchActive}
                        size="sm"
                    />
                )}

                {/* Running Timer */}
                {isRunning && job.startedAt && (
                    <div className="mt-2 flex items-center gap-1.5 bg-indigo-50 rounded px-2 py-1">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                        <LiveTimer startedAt={job.startedAt} pausedSecs={job.pausedSecs} isLunchActive={lunchActive} small />
                    </div>
                )}

                {/* Sub-jobs count */}
                {job.subJobs?.length > 0 && (
                    <div className="mt-2 text-[10px] text-indigo-500 flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {job.subJobs.filter(s => s.status === 'completed').length}/{job.subJobs.length} sub-jobs
                    </div>
                )}

                {/* Metadata */}
                <MetadataRow job={job} className="mt-2 pt-2 border-t border-gray-100" />
            </div>

            {/* Actions - Simplified */}
            <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                <button onClick={(e) => { e.stopPropagation(); onSubJob(job.id); }}
                    className="flex-1 py-2 text-[10px] font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                    <Plus className="w-3 h-3 mx-auto" />
                </button>
                {!isRunning && job.status !== 'completed' && job.status !== 'archived' && (
                    <button onClick={(e) => { e.stopPropagation(); onRun(job.id); }} disabled={!canRun}
                        className={`flex-1 py-2 text-[10px] font-medium transition-all
                            ${canRun ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}>
                        <Play className="w-3 h-3 mx-auto" />
                    </button>
                )}
                {isRunning && (
                    <button onClick={(e) => { e.stopPropagation(); onStop(job.id); }}
                        className="flex-1 py-2 text-[10px] font-medium text-red-500 hover:bg-red-50 transition-all">
                        <Square className="w-3 h-3 mx-auto" />
                    </button>
                )}
            </div>
        </div>
    );
}

// ─── List Card (cleaner design) ────────────────────────────────────────────
export function ListCard({ job, runningJobId, onRun, onStop, onDetails, onSubJob, lunchActive }) {
    const isRunning = job.status === 'running';
    const canRun = !runningJobId || runningJobId === job.id;
    const isSubJob = !!job.parentId;
    const parentId = job.parentId ? job.parentId.split(':')[0] : null;

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all
            ${isRunning ? 'border-indigo-300 ring-1 ring-indigo-200' :
                isSubJob ? 'border-l-4 border-l-purple-400 border-gray-200' : 'border-gray-200'}`}>

            {/* Main Row */}
            <div className="flex items-center gap-4 px-4 py-3">
                {/* Status Indicator */}
                <div className={`w-1 h-12 rounded-full ${PRIORITY_CONFIG[job.priority]?.dot || 'bg-gray-300'}`} />

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* ID Row */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border
                            ${isSubJob ? 'text-purple-600 bg-purple-50 border-purple-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                            {job.id}
                        </span>
                        {isSubJob && parentId && (
                            <span className="text-[10px] text-purple-500 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">
                                Parent: {parentId}
                            </span>
                        )}
                        <PriorityBadge priority={job.priority} />
                        <StatusBadge status={job.status} />
                    </div>

                    {/* Title and Assignment */}
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
                        {job.assignedTo && <UserBadge user={job.assignedTo} size="sm" />}
                    </div>

                    {/* Metadata Row */}
                    <MetadataRow job={job} className="mt-1" />
                </div>

                {/* Time Info */}
                <div className="flex items-center gap-4">
                    {job.estTime > 0 && (
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Estimate</div>
                            <div className="text-sm font-mono text-gray-600">{job.estTime}m</div>
                        </div>
                    )}
                    {job.elapsedSecs > 0 && !isRunning && (
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Time spent</div>
                            <div className="text-sm font-mono text-green-600">{formatDuration(job.elapsedSecs)}</div>
                        </div>
                    )}
                    {isRunning && job.startedAt && (
                        <div className="text-right bg-indigo-50 px-3 py-1 rounded-lg">
                            <div className="text-xs text-indigo-400">Running</div>
                            <LiveTimer startedAt={job.startedAt} pausedSecs={job.pausedSecs} isLunchActive={lunchActive} small />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                    <button onClick={() => onDetails(job)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onSubJob(job.id)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <Plus className="w-4 h-4" />
                    </button>
                    {!isRunning && job.status !== 'completed' && job.status !== 'archived' && (
                        <button onClick={() => onRun(job.id)} disabled={!canRun}
                            className={`p-2 rounded-lg transition-all
                                ${canRun ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}>
                            <Play className="w-4 h-4" />
                        </button>
                    )}
                    {isRunning && (
                        <button onClick={() => onStop(job.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Square className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Progress Bar (if applicable) */}
            {job.estTime > 0 && (
                <div className="px-4 pb-3">
                    <ProgressBar
                        estTime={job.estTime}
                        elapsedSecs={job.elapsedSecs}
                        isRunning={isRunning}
                        startedAt={job.startedAt}
                        pausedSecs={job.pausedSecs}
                        lunchActive={lunchActive}
                    />
                </div>
            )}
        </div>
    );
}

// ─── History Timeline Component ────────────────────────────────────────────
export function HistoryTimeline({ job }) {
    const allEvents = [
        // Creation event
        {
            id: 'creation',
            type: 'create',
            timestamp: job.createdAt,
            user: job.createdBy,
            description: 'Job created'
        },
        // Run log events
        ...(job.runLog || []).map((log, idx) => ({
            id: `run-${idx}`,
            type: log.status === 'running' ? 'start' : 'stop',
            timestamp: log.start || log.end,
            user: log.completedBy || job.createdBy,
            description: log.status === 'running' ? 'Started working' : `Stopped - ${STATUS_CONFIG[log.status]?.label || log.status}`,
            duration: log.duration,
            note: log.note
        })),
        // Metadata updates
        ...(job.metadata?.history || []).map((entry, idx) => ({
            id: `update-${idx}`,
            type: 'update',
            timestamp: entry.timestamp,
            user: entry.user,
            description: entry.description
        }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="space-y-3">
            {allEvents.map((event, index) => (
                <div key={event.id} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="relative flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full mt-1.5
                            ${event.type === 'create' ? 'bg-green-500' :
                                event.type === 'start' ? 'bg-indigo-500' :
                                    event.type === 'stop' ? 'bg-orange-500' : 'bg-gray-400'}`} />
                        {index < allEvents.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 absolute top-3" />
                        )}
                    </div>

                    {/* Event content */}
                    <div className="flex-1 pb-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">
                                {event.user?.name || 'System'}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {formatDate(event.timestamp)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600">{event.description}</p>
                        {event.duration && (
                            <p className="text-[10px] text-gray-400 mt-1">
                                Duration: {formatDuration(event.duration)}
                            </p>
                        )}
                        {event.note && (
                            <p className="text-[10px] text-gray-500 bg-gray-50 p-1.5 rounded mt-1">
                                "{event.note}"
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function LunchBreakModal({ isOpen, onClose, lunchBreak, onSave }) {
    const [form, setForm] = useState({ ...lunchBreak });
    useEffect(() => { setForm({ ...lunchBreak }); }, [lunchBreak, isOpen]);

    return (
        <CommonModal isOpen={isOpen} onClose={onClose} title="Lunch Break Settings" size="sm" animation="slide"
            customFooter={
                <div className="flex justify-end gap-2">
                    <CommonButton label="Cancel" variant="outline" size="small" onClick={onClose} />
                    <CommonButton label="Save" variant="success" size="small" onClick={() => onSave(form)} />
                </div>
            }>
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Enable Lunch Break</span>
                    </div>
                    <button onClick={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${form.enabled ? 'bg-amber-500' : 'bg-gray-300'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                </div>
                {form.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                        {['start', 'end'].map(t => (
                            <div key={t}>
                                <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">{t} Time</label>
                                <input type="time" value={form[t]}
                                    onChange={e => setForm(p => ({ ...p, [t]: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                            </div>
                        ))}
                    </div>
                )}
                <p className="text-xs text-gray-500 flex items-start gap-1.5">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    When lunch break is active, all running job timers are automatically paused.
                </p>
            </div>
        </CommonModal>
    );
}