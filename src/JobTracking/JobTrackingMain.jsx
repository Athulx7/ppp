import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Square, Plus, Clock, Calendar, AlertCircle, CheckCircle2,
    ChevronDown, ChevronUp, Briefcase, Tag, Coffee,
    Flag, ArrowRight, CircleDot, RefreshCw,
    AlarmClock, Info, User, Users, UserPlus,
    Link, GitBranch, Eye, Edit3, Archive,
    Download, Filter, SortAsc, SortDesc,
    LayoutGrid, List, TrendingUp, MoreHorizontal,
    ChevronRight, Maximize2, Minimize2, X, History,
    Clock3, UserCircle, Edit, Trash2
} from 'lucide-react';
import CommonModal from '../basicComponents/CommonModal';
import CommonButton from '../basicComponents/CommonButton';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDropDown from '../basicComponents/CommonDropDown';
import Breadcrumb from '../basicComponents/BreadCrumb';
import { useNavigate } from 'react-router-dom';

function formatDuration(secs) {
    if (!secs) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatDate(dateString) {
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

function generateId(prefix = 'JOB') {
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${ts}${rand}`;
}

function generateSubJobId(parentId) {
    // Sub-job ID now follows format: parentId:SUB-XXX
    const ts = Date.now().toString().slice(-4);
    const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${parentId}:SUB-${ts}${rand}`;
}

const PRIORITY_CONFIG = {
    Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', bar: 'bg-green-500', icon: <Flag className="w-3 h-3" /> },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', bar: 'bg-amber-500', icon: <Flag className="w-3 h-3" /> },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', bar: 'bg-orange-500', icon: <Flag className="w-3 h-3" /> },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', bar: 'bg-red-500', icon: <Flag className="w-3 h-3" /> },
};

const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle', icon: <CircleDot className="w-3 h-3" />, kanbanCol: 'idle' },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running', icon: <RefreshCw className="w-3 h-3 animate-spin" />, kanbanCol: 'running' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" />, kanbanCol: 'completed' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: <ArrowRight className="w-3 h-3" />, kanbanCol: 'in-progress' },
    'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On Hold', icon: <Clock className="w-3 h-3" />, kanbanCol: 'on-hold' },
    'in-review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review', icon: <Eye className="w-3 h-3" />, kanbanCol: 'in-review' },
    refer: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Referred', icon: <UserPlus className="w-3 h-3" />, kanbanCol: 'refer' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Archived', icon: <Archive className="w-3 h-3" />, kanbanCol: 'archived' },
};

const KANBAN_COLUMNS = [
    { key: 'idle', label: 'Idle', color: 'border-gray-300', headerBg: 'bg-gray-50', dot: 'bg-gray-400' },
    { key: 'running', label: 'Running', color: 'border-indigo-400', headerBg: 'bg-indigo-50', dot: 'bg-indigo-500' },
    { key: 'in-progress', label: 'In Progress', color: 'border-blue-400', headerBg: 'bg-blue-50', dot: 'bg-blue-500' },
    { key: 'in-review', label: 'In Review', color: 'border-purple-400', headerBg: 'bg-purple-50', dot: 'bg-purple-500' },
    { key: 'on-hold', label: 'On Hold', color: 'border-amber-400', headerBg: 'bg-amber-50', dot: 'bg-amber-500' },
    { key: 'completed', label: 'Completed', color: 'border-green-400', headerBg: 'bg-green-50', dot: 'bg-green-500' },
    { key: 'refer', label: 'Referred', color: 'border-orange-400', headerBg: 'bg-orange-50', dot: 'bg-orange-500' },
];

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'].map(v => ({ label: v, value: v }));
const STOP_STATUS_OPTIONS = [
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Refer to Another', value: 'refer' },
];

const AVAILABLE_USERS = [
    { id: 'USR001', name: 'John Doe', team: 'Development', email: 'john@example.com' },
    { id: 'USR002', name: 'Jane Smith', team: 'Development', email: 'jane@example.com' },
    { id: 'USR003', name: 'Mike Johnson', team: 'QA', email: 'mike@example.com' },
    { id: 'USR004', name: 'Sarah Williams', team: 'DevOps', email: 'sarah@example.com' },
    { id: 'USR005', name: 'Tom Brown', team: 'UI/UX', email: 'tom@example.com' },
];

const AVAILABLE_TEAMS = ['Development', 'QA', 'DevOps', 'UI/UX', 'Management', 'Support'];

// ─── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ estTime, elapsedSecs, isRunning, startedAt, pausedSecs, lunchActive, size = 'sm' }) {
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

// ─── Metadata Row (Created/Updated info) ───────────────────────────────────
function MetadataRow({ job, className = '' }) {
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

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.icon}{cfg.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            {cfg.icon}{priority}
        </span>
    );
}

function UserBadge({ user, size = 'sm' }) {
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

function LiveTimer({ startedAt, pausedSecs, isLunchActive, small = false }) {
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

function insertSubJob(nodes, targetId, newSub) {
    return nodes.map(node => {
        if (node.id === targetId) return { ...node, subJobs: [...(node.subJobs || []), newSub] };
        if (node.subJobs?.length) return { ...node, subJobs: insertSubJob(node.subJobs, targetId, newSub) };
        return node;
    });
}

function updateJobInTree(nodes, targetId, updaterFn) {
    return nodes.map(node => {
        if (node.id === targetId) return updaterFn(node);
        if (node.subJobs?.length) return { ...node, subJobs: updateJobInTree(node.subJobs, targetId, updaterFn) };
        return node;
    });
}

// Flatten all jobs + sub-jobs into a single list
function flattenAllJobs(jobs) {
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
function KanbanCard({ job, runningJobId, onRun, onStop, onDetails, onSubJob, lunchActive }) {
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
function ListCard({ job, runningJobId, onRun, onStop, onDetails, onSubJob, lunchActive }) {
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
function HistoryTimeline({ job }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────
function JobTrackingMain({
    currentUser = { id: 'USR001', name: 'John Doe', team: 'Development' }
}) {
    const [runningJobId, setRunningJobId] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [jobs, setJobs] = useState([]);
    const [lunchBreak, setLunchBreak] = useState({ enabled: false, start: '13:00', end: '14:00' });


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStopModal, setShowStopModal] = useState(false);
    const [showSubJobModal, setShowSubJobModal] = useState(false);
    const [showLunchModal, setShowLunchModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [createForm, setCreateForm] = useState({
        title: '', description: '', estTime: '', priority: 'Medium',
        assignedTo: null, assignedTeam: '', tags: [], dueDate: '', estimatedHours: ''
    });
    const [stopForm, setStopForm] = useState({
        status: 'completed', description: '', referTo: '', referType: 'user', timeSpent: '', completionNotes: ''
    });
    const [subJobForm, setSubJobForm] = useState({ title: '', description: '', priority: 'Medium', estTime: '' });

    const [stopTargetId, setStopTargetId] = useState(null);
    const [subJobTargetId, setSubJobTargetId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQ, setSearchQ] = useState('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterAssignee, setFilterAssignee] = useState('all');

    const handleCreateJob = () => {
        if (!createForm.title.trim()) return;
        const newJob = {
            id: generateId('JOB'),
            title: createForm.title.trim(),
            description: createForm.description.trim(),
            estTime: parseInt(createForm.estTime) || 0,
            priority: createForm.priority,
            status: 'idle',
            createdAt: new Date().toISOString(),
            createdBy: currentUser,
            assignedTo: createForm.assignedTo,
            assignedTeam: createForm.assignedTeam,
            tags: createForm.tags || [],
            dueDate: createForm.dueDate,
            estimatedHours: createForm.estimatedHours,
            startedAt: null, stoppedAt: null, elapsedSecs: 0, pausedSecs: 0,
            stopNote: '', subJobs: [], runLog: [], comments: [], attachments: [],
            metadata: {
                version: 1,
                lastModified: new Date().toISOString(),
                modifiedBy: currentUser,
                history: [{
                    timestamp: new Date().toISOString(),
                    user: currentUser,
                    description: 'Job created'
                }]
            }
        };
        setJobs(prev => [newJob, ...prev]);
        setCreateForm({ title: '', description: '', estTime: '', priority: 'Medium', assignedTo: null, assignedTeam: '', tags: [], dueDate: '', estimatedHours: '' });
        setShowCreateModal(false);
    };

    const handleRun = (jobId) => {
        if (runningJobId && runningJobId !== jobId) return;
        const now = Date.now();
        setRunningJobId(jobId);
        setJobs(prev => updateJobInTree(prev, jobId, node => ({
            ...node,
            status: 'running',
            startedAt: now,
            metadata: {
                ...node.metadata,
                lastModified: new Date().toISOString(),
                modifiedBy: currentUser,
                history: [
                    ...(node.metadata?.history || []),
                    {
                        timestamp: new Date().toISOString(),
                        user: currentUser,
                        description: 'Started working on job'
                    }
                ]
            }
        })));
    };

    const openStopModal = (jobId) => {
        setStopTargetId(jobId);
        setStopForm({ status: 'completed', description: '', referTo: '', referType: 'user', timeSpent: '', completionNotes: '' });
        setShowStopModal(true);
    };

    const handleStop = () => {
        if (!stopTargetId) return;
        const now = Date.now();
        setJobs(prev => updateJobInTree(prev, stopTargetId, node => {
            const addSecs = node.startedAt ? Math.floor((now - node.startedAt) / 1000) : 0;
            const totalElapsed = (node.elapsedSecs || 0) + addSecs;
            let referredTo = null;
            if (stopForm.status === 'refer' && stopForm.referTo) {
                referredTo = stopForm.referType === 'user'
                    ? AVAILABLE_USERS.find(u => u.id === stopForm.referTo) || null
                    : { team: stopForm.referTo };
            }

            const runLogEntry = {
                start: new Date(node.startedAt || now).toISOString(),
                end: new Date(now).toISOString(),
                duration: addSecs,
                status: stopForm.status,
                note: stopForm.description,
                completedBy: currentUser
            };

            return {
                ...node,
                status: stopForm.status,
                stoppedAt: new Date().toISOString(),
                startedAt: null,
                elapsedSecs: totalElapsed,
                stopNote: stopForm.description,
                referredTo,
                referType: stopForm.referType,
                completionNotes: stopForm.completionNotes,
                actualHours: Math.round(totalElapsed / 3600 * 10) / 10,
                runLog: [...(node.runLog || []), runLogEntry],
                metadata: {
                    ...node.metadata,
                    lastModified: new Date().toISOString(),
                    modifiedBy: currentUser,
                    version: (node.metadata?.version || 1) + 1,
                    history: [
                        ...(node.metadata?.history || []),
                        {
                            timestamp: new Date().toISOString(),
                            user: currentUser,
                            description: `Job stopped - ${STATUS_CONFIG[stopForm.status]?.label || stopForm.status}`,
                            details: runLogEntry
                        }
                    ]
                }
            };
        }));
        setRunningJobId(null);
        setShowStopModal(false);
        setStopTargetId(null);
    };

    const openSubJobModal = (parentId) => {
        setSubJobTargetId(parentId);
        setSubJobForm({ title: '', description: '', priority: 'Medium', estTime: '' });
        setShowSubJobModal(true);
    };

    const handleCreateSubJob = () => {
        if (!subJobForm.title.trim() || !subJobTargetId) return;
        const subId = generateSubJobId(subJobTargetId);
        const newSub = {
            id: subId,
            title: subJobForm.title.trim(),
            description: subJobForm.description.trim(),
            priority: subJobForm.priority,
            status: 'idle',
            createdAt: new Date().toISOString(),
            createdBy: currentUser,
            elapsedSecs: 0,
            pausedSecs: 0,
            startedAt: null,
            estTime: parseInt(subJobForm.estTime) || 0,
            subJobs: [],
            parentId: subJobTargetId,
            runLog: [],
            metadata: {
                version: 1,
                lastModified: new Date().toISOString(),
                modifiedBy: currentUser,
                history: [{
                    timestamp: new Date().toISOString(),
                    user: currentUser,
                    description: 'Sub-job created'
                }]
            }
        };
        setJobs(prev => insertSubJob(prev, subJobTargetId, newSub));
        setSubJobForm({ title: '', description: '', priority: 'Medium', estTime: '' });
        setShowSubJobModal(false);
        setSubJobTargetId(null);
    };

    const openJobDetails = (job) => { setSelectedJob(job); setShowDetailsModal(true); };
    const handleSaveLunch = (form) => { setLunchBreak(form); setShowLunchModal(false); };

    const isLunchActive = () => {
        if (!lunchBreak?.enabled || !lunchBreak.start || !lunchBreak.end) return false;
        const now = new Date();
        const [sh, sm] = lunchBreak.start.split(':').map(Number);
        const [eh, em] = lunchBreak.end.split(':').map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
    };
    const lunchActive = isLunchActive();

    const visibleJobs = flattenAllJobs(jobs)
        .filter(j => {
            const matchStatus = filterStatus === 'all' || j.status === filterStatus;
            const matchQ = !searchQ ||
                j.title.toLowerCase().includes(searchQ.toLowerCase()) ||
                j.id.toLowerCase().includes(searchQ.toLowerCase()) ||
                (j.description && j.description.toLowerCase().includes(searchQ.toLowerCase()));
            const matchAssignee = filterAssignee === 'all' ||
                (filterAssignee === 'unassigned' && !j.assignedTo && !j.assignedTeam) ||
                (j.assignedTo?.id === filterAssignee) ||
                (j.assignedTeam === filterAssignee);
            return matchStatus && matchQ && matchAssignee;
        })
        .sort((a, b) => {
            let valA, valB;
            const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
            switch (sortBy) {
                case 'priority': valA = priorityOrder[a.priority] ?? 99; valB = priorityOrder[b.priority] ?? 99; break;
                case 'dueDate': valA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000); valB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000); break;
                case 'title': valA = a.title; valB = b.title; break;
                default: valA = new Date(a.createdAt); valB = new Date(b.createdAt);
            }
            return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
        });

    const cardProps = {
        runningJobId, onRun: handleRun, onStop: openStopModal,
        onDetails: openJobDetails, onSubJob: openSubJobModal, lunchActive
    };

    const navigate = useNavigate()

    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Jobs' }]}
                title="My Jobs"
                description="Create, run, and track your job sessions — manage time with precision"
                actions={
                    <div className="flex flex-wrap items-center justify-end gap-3 mb-5">
                        {lunchActive && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium animate-pulse">
                                <Coffee className="w-4 h-4" />Lunch Break Active – Timer Paused
                            </span>
                        )}
                        <button onClick={() => setShowLunchModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            <Coffee className="w-4 h-4" />
                            {lunchBreak?.enabled ? `Lunch ${lunchBreak.start}–${lunchBreak.end}` : 'Set Lunch Break'}
                        </button>
                        <CommonButton label="Create Job" variant="primary" size="small" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)} />
                        <CommonButton label="View Job Calendar" variant="success" size="small" icon={<Eye className="w-4 h-4" />} onClick={() => navigate('/admin/jobcalendar')} />
                    </div>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Total Jobs', value: jobs.length, color: 'indigo' },
                    { label: 'Running', value: jobs.filter(j => j.status === 'running').length, color: 'blue' },
                    { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: 'green' },
                    { label: 'Referred', value: jobs.filter(j => j.status === 'refer').length, color: 'orange' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Filters + View Toggle */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text" placeholder="Search by title, ID, or description..."
                    value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    className="flex-1 min-w-[180px] px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <select
                    value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="all">All Assignees</option>
                    <option value="unassigned">Unassigned</option>
                    {AVAILABLE_USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    {AVAILABLE_TEAMS.map(t => <option key={t} value={t}>{t} (Team)</option>)}
                </select>
                <select
                    value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="createdAt">Sort: Date</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="dueDate">Sort: Due Date</option>
                    <option value="title">Sort: Title</option>
                </select>
                <div className="flex gap-1 flex-wrap">
                    {['all', 'idle', 'running', 'completed', 'in-progress', 'refer', 'on-hold'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all
                                ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                        </button>
                    ))}
                </div>
                <button onClick={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>

                {/* View toggle */}
                <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={() => setViewMode('list')}
                        className={`px-3 py-2 transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <List className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('kanban')}
                        className={`px-3 py-2 transition-all ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {runningJobId && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-indigo-800">
                        Active Job: <span className="font-mono">{runningJobId}</span>
                    </span>
                    {lunchActive && (
                        <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200">
                            ⏸ Timer paused (Lunch Break)
                        </span>
                    )}
                </div>
            )}

            {visibleJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Briefcase className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No jobs found</p>
                    <p className="text-xs mt-1">Create a new job to get started</p>
                </div>
            ) : viewMode === 'list' ? (
                <div className="space-y-2">
                    {visibleJobs.map(job => (
                        <ListCard key={job.id} job={job} {...cardProps} />
                    ))}
                </div>
            ) : (
                /* Kanban board */
                <div className="flex gap-4 overflow-x-auto pb-4">
                    {KANBAN_COLUMNS.map(col => {
                        const colJobs = visibleJobs.filter(j => j.status === col.key);
                        return (
                            <div key={col.key} className="flex-shrink-0 w-72">
                                <div className={`flex items-center justify-between px-3 py-2 rounded-t-lg border-t-2 ${col.headerBg} ${col.color} border-b border-x border-gray-200`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                                        <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                        {colJobs.length}
                                    </span>
                                </div>
                                <div className="bg-gray-50 border border-t-0 border-gray-200 rounded-b-lg p-2 space-y-2 min-h-[200px] max-h-[calc(100vh-320px)] overflow-y-auto">
                                    {colJobs.length === 0 ? (
                                        <div className="flex items-center justify-center py-8 text-gray-300 text-xs">
                                            No jobs here
                                        </div>
                                    ) : colJobs.map(job => (
                                        <KanbanCard key={job.id} job={job} {...cardProps} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Create Job Modal (unchanged) ── */}
            <CommonModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}
                title="Create New Job" size="3xl" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowCreateModal(false)} />
                        <CommonButton label="Create Job" variant="primary" size="small" onClick={handleCreateJob} disabled={!createForm.title.trim()} />
                    </div>
                }>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonInputField label="Job ID" disabled value={generateId('JOB')} />
                        <CommonInputField label="Job Title" required value={createForm.title}
                            onChange={v => setCreateForm(p => ({ ...p, title: v }))} placeholder="e.g. Implement login API" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonDropDown label="Assign To User" value={createForm.assignedTo?.id || ''}
                            onChange={e => { const u = AVAILABLE_USERS.find(u => u.id === e.target.value); setCreateForm(p => ({ ...p, assignedTo: u || null })); }}
                            options={AVAILABLE_USERS.map(u => ({ label: u.name, value: u.id }))} />
                        <CommonDropDown label="Assign To Team" value={createForm.assignedTeam}
                            onChange={e => setCreateForm(p => ({ ...p, assignedTeam: e.target.value }))}
                            options={AVAILABLE_TEAMS.map(t => ({ label: t, value: t }))} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CommonInputField label="Est. Time (minutes)" type="number" value={createForm.estTime}
                            onChange={v => setCreateForm(p => ({ ...p, estTime: v }))} placeholder="e.g. 120" onlyNumber />
                        <CommonInputField label="Est. Hours" type="number" value={createForm.estimatedHours}
                            onChange={v => setCreateForm(p => ({ ...p, estimatedHours: v }))} placeholder="e.g. 8" onlyNumber />
                        <CommonDropDown label="Priority" value={createForm.priority}
                            onChange={v => setCreateForm(p => ({ ...p, priority: v }))} options={PRIORITY_OPTIONS} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" value={createForm.dueDate}
                                onChange={e => setCreateForm(p => ({ ...p, dueDate: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma separated)</label>
                            <input type="text" value={createForm.tags.join(', ')}
                                onChange={e => setCreateForm(p => ({ ...p, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t) }))}
                                placeholder="frontend, api, urgent"
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={createForm.description}
                            onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the job objective, requirements, and any important details..."
                            rows={4} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                </div>
            </CommonModal>

            {/* ── Stop Modal (unchanged) ── */}
            <CommonModal isOpen={showStopModal} onClose={() => setShowStopModal(false)}
                title="Stop Job" size="lg" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowStopModal(false)} />
                        <CommonButton label="Confirm Stop" variant="danger" size="small" onClick={handleStop} />
                    </div>
                }>
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>This will stop the timer for <strong className="font-mono">{stopTargetId}</strong>. Please provide completion details below.</span>
                    </div>
                    <CommonDropDown label="Job Status" required value={stopForm.status}
                        onChange={v => setStopForm(p => ({ ...p, status: v }))} options={STOP_STATUS_OPTIONS} />

                    {stopForm.status === 'refer' && (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Refer Type</label>
                                <div className="flex gap-4">
                                    {['user', 'team'].map(t => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value={t} checked={stopForm.referType === t}
                                                onChange={e => setStopForm(p => ({ ...p, referType: e.target.value }))} className="text-indigo-600" />
                                            <span className="text-sm capitalize">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Refer to {stopForm.referType === 'user' ? 'User' : 'Team'}
                                </label>
                                <select value={stopForm.referTo} onChange={e => setStopForm(p => ({ ...p, referTo: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option value="">Select {stopForm.referType === 'user' ? 'User' : 'Team'}</option>
                                    {stopForm.referType === 'user'
                                        ? AVAILABLE_USERS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.team})</option>)
                                        : AVAILABLE_TEAMS.map(t => <option key={t} value={t}>{t}</option>)
                                    }
                                </select>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Notes / Description</label>
                        <textarea value={stopForm.description} onChange={e => setStopForm(p => ({ ...p, description: e.target.value }))}
                            placeholder={stopForm.status === 'refer' ? 'Reason for referral and any context...' : 'Any additional notes...'}
                            rows={3} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Completion Notes</label>
                        <textarea value={stopForm.completionNotes} onChange={e => setStopForm(p => ({ ...p, completionNotes: e.target.value }))}
                            placeholder="Final notes, outcomes, or next steps..."
                            rows={2} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                </div>
            </CommonModal>

            {/* ── Sub-Job Modal ── */}
            <CommonModal isOpen={showSubJobModal} onClose={() => setShowSubJobModal(false)}
                title={<span>Add Sub-Job under <span className="font-mono text-indigo-600 font-semibold">{subJobTargetId}</span></span>}
                size="md" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowSubJobModal(false)} />
                        <CommonButton label="Add Sub-Job" variant="primary" size="small" onClick={handleCreateSubJob} disabled={!subJobForm.title.trim()} />
                    </div>
                }>
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-2.5 bg-purple-50 border border-purple-100 rounded-lg">
                        <GitBranch className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                        <span className="text-xs text-purple-700">
                            Sub-job ID will be: <span className="font-mono font-bold">{generateSubJobId(subJobTargetId)}</span>
                        </span>
                    </div>
                    <CommonInputField label="Sub-Job Title" required value={subJobForm.title}
                        onChange={v => setSubJobForm(p => ({ ...p, title: v }))} placeholder="e.g. Write unit tests" />
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={subJobForm.description} onChange={e => setSubJobForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="What does this sub-task involve?"
                            rows={2} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <CommonDropDown label="Priority" value={subJobForm.priority}
                            onChange={v => setSubJobForm(p => ({ ...p, priority: v }))} options={PRIORITY_OPTIONS} />
                        <CommonInputField label="Est. Time (minutes)" type="number" value={subJobForm.estTime}
                            onChange={v => setSubJobForm(p => ({ ...p, estTime: v }))} placeholder="e.g. 60" onlyNumber />
                    </div>
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Sub-jobs inherit assignment from parent and are displayed with parent ID reference.
                    </p>
                </div>
            </CommonModal>

            {/* ── Enhanced Details Modal with History ── */}
            {selectedJob && (
                <CommonModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}
                    title={
                        <div className="flex items-center gap-2">
                            <span>Job Details: {selectedJob.id}</span>
                            {selectedJob.parentId && (
                                <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
                                    Sub-job of {selectedJob.parentId}
                                </span>
                            )}
                        </div>
                    }
                    size="4xl"
                    animation="slide">

                    <div className="space-y-6">
                        {/* Header Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Title</h4>
                                <p className="text-base font-semibold">{selectedJob.title}</p>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Status</h4>
                                    <StatusBadge status={selectedJob.status} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Priority</h4>
                                    <PriorityBadge priority={selectedJob.priority} />
                                </div>
                            </div>
                        </div>

                        {/* Assignment Info */}
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Created By</h4>
                                {selectedJob.createdBy && (
                                    <div className="flex items-center gap-2">
                                        <UserBadge user={selectedJob.createdBy} />
                                        <span className="text-xs text-gray-400">{formatDate(selectedJob.createdAt)}</span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Assigned To</h4>
                                {selectedJob.assignedTo ? (
                                    <UserBadge user={selectedJob.assignedTo} />
                                ) : selectedJob.assignedTeam ? (
                                    <span className="text-sm bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
                                        <Users className="w-4 h-4" />
                                        {selectedJob.assignedTeam}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">Unassigned</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {selectedJob.description && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Description</h4>
                                <p className="text-sm bg-gray-50 p-4 rounded-xl">{selectedJob.description}</p>
                            </div>
                        )}

                        {/* Time Tracking */}
                        <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-3">Time Tracking</h4>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: 'Estimated', value: selectedJob.estTime ? `${selectedJob.estTime}m` : 'N/A', color: 'text-indigo-600' },
                                    { label: 'Actual', value: selectedJob.elapsedSecs ? formatDuration(selectedJob.elapsedSecs) : '0', color: 'text-green-600' },
                                    { label: 'Sessions', value: selectedJob.runLog?.length || 0, color: 'text-orange-600' },
                                    { label: 'Due Date', value: selectedJob.dueDate ? new Date(selectedJob.dueDate).toLocaleDateString() : 'N/A', color: 'text-gray-600' },
                                ].map(t => (
                                    <div key={t.label} className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">{t.label}</p>
                                        <p className={`text-lg font-bold ${t.color}`}>{t.value}</p>
                                    </div>
                                ))}
                            </div>
                            {selectedJob.estTime > 0 && (
                                <div className="mt-3">
                                    <ProgressBar
                                        estTime={selectedJob.estTime}
                                        elapsedSecs={selectedJob.elapsedSecs}
                                        isRunning={false}
                                        size="lg"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Activity Log / History */}
                        <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                                <History className="w-4 h-4" />
                                Activity History
                            </h4>
                            <div className="bg-gray-50 p-4 rounded-xl max-h-80 overflow-y-auto">
                                <HistoryTimeline job={selectedJob} />
                            </div>
                        </div>

                        {/* Run Sessions */}
                        {selectedJob.runLog?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-3">Work Sessions</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedJob.runLog.map((log, idx) => (
                                        <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-3 mb-1">
                                                <StatusBadge status={log.status} />
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(log.start)} - {formatDate(log.end)}
                                                </span>
                                                <span className="text-xs font-mono text-indigo-600">
                                                    {formatDuration(log.duration)}
                                                </span>
                                            </div>
                                            {log.completedBy && (
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <User className="w-3 h-3" />
                                                    by {log.completedBy.name}
                                                </div>
                                            )}
                                            {log.note && (
                                                <p className="text-xs text-gray-600 mt-1 bg-white p-2 rounded">
                                                    "{log.note}"
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sub-Jobs */}
                        {selectedJob.subJobs?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                                    <GitBranch className="w-4 h-4 text-purple-500" />
                                    Sub-Jobs
                                    <span className="ml-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-100">
                                        {selectedJob.subJobs.length}
                                    </span>
                                </h4>
                                <div className="space-y-2">
                                    {selectedJob.subJobs.map(sub => (
                                        <div key={sub.id} className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                                                        {sub.id}
                                                    </span>
                                                    <StatusBadge status={sub.status} />
                                                    <PriorityBadge priority={sub.priority} />
                                                </div>
                                            </div>
                                            <p className="text-sm font-semibold text-gray-800 mb-2">{sub.title}</p>
                                            {sub.description && (
                                                <p className="text-xs text-gray-600 mb-2">{sub.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <AlarmClock className="w-3 h-3" />Est: {sub.estTime}m
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />{formatDuration(sub.elapsedSecs)}
                                                </span>
                                            </div>
                                            <MetadataRow job={sub} className="mt-2 pt-2 border-t border-purple-200" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="text-xs text-gray-400 border-t pt-4 grid grid-cols-2 gap-2">
                            <p>Version: {selectedJob.metadata?.version || 1}</p>
                            <p>Last Modified: {selectedJob.metadata?.lastModified ? formatDate(selectedJob.metadata.lastModified) : 'N/A'}</p>
                            {selectedJob.metadata?.modifiedBy && (
                                <p>Modified by: {selectedJob.metadata.modifiedBy.name}</p>
                            )}
                        </div>
                    </div>
                </CommonModal>
            )}

            <LunchBreakModal isOpen={showLunchModal} onClose={() => setShowLunchModal(false)}
                lunchBreak={lunchBreak} onSave={handleSaveLunch} />
        </>
    );
}

function LunchBreakModal({ isOpen, onClose, lunchBreak, onSave }) {
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

export default JobTrackingMain;