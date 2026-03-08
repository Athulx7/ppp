import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Square, Plus, Clock, Calendar, AlertCircle, CheckCircle2,
    ChevronDown, ChevronUp, Briefcase, Tag, Coffee,
    Flag, ArrowRight, CircleDot, RefreshCw,
    AlarmClock, Info
} from 'lucide-react';
import CommonModal from '../basicComponents/CommonModal';
import CommonButton from '../basicComponents/CommonButton';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDropDown from '../basicComponents/CommonDropDown';

// ── Utilities ──────────────────────────────────────────────────
function formatDuration(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function generateId(prefix = 'JOB') {
    const ts = Date.now().toString().slice(-6);
    const rand = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}-${ts}${rand}`;
}

// ── Config ─────────────────────────────────────────────────────
const PRIORITY_CONFIG = {
    Low:      { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500',  icon: <Flag className="w-3 h-3" /> },
    Medium:   { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-500',  icon: <Flag className="w-3 h-3" /> },
    High:     { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', icon: <Flag className="w-3 h-3" /> },
    Critical: { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500',    icon: <Flag className="w-3 h-3" /> },
};

const STATUS_CONFIG = {
    idle:         { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'Idle',        icon: <CircleDot className="w-3 h-3" /> },
    running:      { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running',     icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
    completed:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Completed',   icon: <CheckCircle2 className="w-3 h-3" /> },
    'in-progress':{ bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'In Progress', icon: <ArrowRight className="w-3 h-3" /> },
    refer:        { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Refer',       icon: <AlertCircle className="w-3 h-3" /> },
};

const PRIORITY_OPTIONS  = ['Low','Medium','High','Critical'].map(v => ({ label: v, value: v }));
const STOP_STATUS_OPTIONS = [
    { label: 'Completed',   value: 'completed'   },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'Refer',       value: 'refer'        },
];

// ── Badges ─────────────────────────────────────────────────────
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

// ── Live Timer (root job — large) ─────────────────────────────
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
            ? 'font-mono text-xs font-bold text-indigo-700 tracking-wider'
            : 'font-mono text-lg font-bold text-indigo-700 tracking-wider'
        }>
            {formatDuration(elapsed)}
        </span>
    );
}

// ── Recursive Sub-Job Card ─────────────────────────────────────
// Displayed as a card-style item in a left-bordered indent, showing its own ID + parent ID.
// Supports Run/Stop with the same single-job-at-a-time constraint as root jobs.
function SubJobCard({ sub, parentId, depth, onAddSubJob, runningJobId, onRun, onStop, lunchActive }) {
    const [expanded, setExpanded] = useState(false);
    const cfg  = STATUS_CONFIG[sub.status]     || STATUS_CONFIG.idle;
    const pCfg = PRIORITY_CONFIG[sub.priority] || PRIORITY_CONFIG.Medium;
    // Different border accent colours per nesting level
    const borderColors = ['border-l-indigo-400','border-l-purple-400','border-l-teal-400','border-l-orange-400'];
    const accent = borderColors[Math.min(depth - 1, 3)];

    return (
        <div className={`border-l-[3px] ${accent} pl-3`}>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                {/* Card Body */}
                <div className="p-3">
                    <div className="flex items-start gap-2">
                        {/* priority accent bar */}
                        <div className={`mt-1 w-1 h-10 rounded-full flex-shrink-0 ${pCfg.dot}`} />

                        <div className="flex-1 min-w-0">
                            {/* IDs + Badges */}
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                {/* This sub-job's own ID */}
                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                    {sub.id}
                                </span>
                                {/* ← Parent ID label */}
                                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium border border-gray-200">
                                    <ArrowRight className="w-2.5 h-2.5" />
                                    sub of <span className="font-mono text-indigo-500 ml-0.5">{parentId}</span>
                                </span>
                                <PriorityBadge priority={sub.priority} />
                                <StatusBadge status={sub.status} />
                            </div>

                            <h4 className="text-sm font-semibold text-gray-900 truncate">{sub.title}</h4>

                            {sub.description && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sub.description}</p>
                            )}

                            {/* Meta */}
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-2.5 h-2.5" />
                                    {new Date(sub.createdAt).toLocaleDateString()}
                                </span>
                                {sub.elapsedSecs > 0 && (
                                    <span className="font-mono font-medium text-gray-600 flex items-center gap-1">
                                        <Clock className="w-2.5 h-2.5" />{formatDuration(sub.elapsedSecs)}
                                    </span>
                                )}
                                {sub.subJobs?.length > 0 && (
                                    <span className="text-indigo-400">
                                        {sub.subJobs.length} sub-job{sub.subJobs.length > 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Timer + Action buttons */}
                        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5 flex-col items-end">
                            {/* Live timer when this sub-job is running */}
                            {sub.status === 'running' && sub.startedAt && (
                                <div className="flex flex-col items-end mb-1">
                                    <LiveTimer
                                        startedAt={sub.startedAt}
                                        pausedSecs={sub.pausedSecs || 0}
                                        isLunchActive={lunchActive}
                                        small
                                    />
                                    <span className="text-[9px] text-indigo-400">elapsed</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                {/* Run button */}
                                {sub.status !== 'running' && sub.status !== 'completed' && (
                                    <button
                                        onClick={() => onRun(sub.id)}
                                        disabled={!!runningJobId && runningJobId !== sub.id}
                                        title={runningJobId && runningJobId !== sub.id ? 'Another job is running' : 'Run Sub-Job'}
                                        className={`flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                                            runningJobId && runningJobId !== sub.id
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                        }`}
                                    >
                                        <Play className="w-3 h-3" />Run
                                    </button>
                                )}
                                {/* Stop button */}
                                {sub.status === 'running' && (
                                    <button
                                        onClick={() => onStop(sub.id)}
                                        className="flex items-center gap-1 px-2 py-1 text-[11px] font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all"
                                    >
                                        <Square className="w-3 h-3" />Stop
                                    </button>
                                )}
                                {/* Add sub-job */}
                                <button
                                    onClick={() => onAddSubJob(sub.id)}
                                    className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                                    title={`Add Sub-Job under ${sub.id}`}
                                >
                                    <Plus className="w-3 h-3" />Sub
                                </button>
                                {/* Expand/collapse nested */}
                                {sub.subJobs?.length > 0 && (
                                    <button
                                        onClick={() => setExpanded(p => !p)}
                                        className="p-1 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
                                    >
                                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nested children */}
                {expanded && sub.subJobs?.length > 0 && (
                    <div className="px-3 pb-3 pt-2 border-t border-gray-100 space-y-2">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            Sub-Jobs of <span className="font-mono ml-0.5">{sub.id}</span>
                        </p>
                        {sub.subJobs.map(child => (
                            <SubJobCard
                                key={child.id}
                                sub={child}
                                parentId={sub.id}
                                depth={depth + 1}
                                onAddSubJob={onAddSubJob}
                                runningJobId={runningJobId}
                                onRun={onRun}
                                onStop={onStop}
                                lunchActive={lunchActive}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Recursive sub-job inserter ─────────────────────────────────
// Walks the full tree and appends newSub to whichever node has id === targetId.
function insertSubJob(nodes, targetId, newSub) {
    return nodes.map(node => {
        if (node.id === targetId) {
            return { ...node, subJobs: [...(node.subJobs || []), newSub] };
        }
        if (node.subJobs?.length) {
            return { ...node, subJobs: insertSubJob(node.subJobs, targetId, newSub) };
        }
        return node;
    });
}

// ── Recursive job updater ─────────────────────────────────────
// Applies updaterFn to the node with id === targetId anywhere in the tree.
function updateJobInTree(nodes, targetId, updaterFn) {
    return nodes.map(node => {
        if (node.id === targetId) return updaterFn(node);
        if (node.subJobs?.length) {
            return { ...node, subJobs: updateJobInTree(node.subJobs, targetId, updaterFn) };
        }
        return node;
    });
}

// ── Main Component ─────────────────────────────────────────────
function JobTrackingMain({ jobs, setJobs, lunchBreak, setLunchBreak }) {
    const [runningJobId, setRunningJobId] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStopModal,   setShowStopModal]   = useState(false);
    const [showSubJobModal, setShowSubJobModal] = useState(false);
    const [showLunchModal,  setShowLunchModal]  = useState(false);

    const [createForm,  setCreateForm]  = useState({ title: '', description: '', estTime: '', priority: 'Medium' });
    const [stopForm,    setStopForm]    = useState({ status: 'completed', description: '', referTo: '' });
    const [subJobForm,  setSubJobForm]  = useState({ title: '', description: '', priority: 'Medium' });
    const [stopTargetId,   setStopTargetId]   = useState(null);
    const [subJobTargetId, setSubJobTargetId] = useState(null);
    const [expandedJobs,   setExpandedJobs]   = useState({});
    const [filterStatus,   setFilterStatus]   = useState('all');
    const [searchQ,        setSearchQ]        = useState('');

    // Create root job
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
            startedAt: null, stoppedAt: null,
            elapsedSecs: 0, pausedSecs: 0,
            stopNote: '', subJobs: [], runLog: [],
        };
        setJobs(prev => [newJob, ...prev]);
        setCreateForm({ title: '', description: '', estTime: '', priority: 'Medium' });
        setShowCreateModal(false);
    };

    // Run job (only one at a time — works for both root jobs AND sub-jobs)
    const handleRun = (jobId) => {
        if (runningJobId && runningJobId !== jobId) return;
        const now = Date.now();
        setRunningJobId(jobId);
        setJobs(prev => updateJobInTree(prev, jobId, node => ({ ...node, status: 'running', startedAt: now })));
    };

    // Open stop modal
    const openStopModal = (jobId) => {
        setStopTargetId(jobId);
        setStopForm({ status: 'completed', description: '', referTo: '' });
        setShowStopModal(true);
    };

    // Confirm stop — works for both root jobs AND sub-jobs
    const handleStop = () => {
        if (!stopTargetId) return;
        const now = Date.now();
        setJobs(prev => updateJobInTree(prev, stopTargetId, node => {
            const addSecs = node.startedAt ? Math.floor((now - node.startedAt) / 1000) : 0;
            return {
                ...node,
                status: stopForm.status, stoppedAt: new Date().toISOString(),
                startedAt: null, elapsedSecs: (node.elapsedSecs || 0) + addSecs,
                stopNote: stopForm.description, referTo: stopForm.referTo,
                runLog: [...(node.runLog || []), {
                    start: new Date(node.startedAt || now).toISOString(),
                    end:   new Date(now).toISOString(),
                    status: stopForm.status, note: stopForm.description,
                }],
            };
        }));
        setRunningJobId(null);
        setShowStopModal(false);
        setStopTargetId(null);
    };

    // Open sub-job modal (works at any depth — parentId can be a root job or sub-job)
    const openSubJobModal = (parentId) => {
        setSubJobTargetId(parentId);
        setSubJobForm({ title: '', description: '', priority: 'Medium' });
        setShowSubJobModal(true);
    };

    // Create sub-job (inserted recursively into the tree)
    const handleCreateSubJob = () => {
        if (!subJobForm.title.trim() || !subJobTargetId) return;
        const subId = `${subJobTargetId}-S${Date.now().toString().slice(-4)}`;
        const newSub = {
            id: subId,
            title: subJobForm.title.trim(),
            description: subJobForm.description.trim(),
            priority: subJobForm.priority,
            status: 'idle',
            createdAt: new Date().toISOString(),
            elapsedSecs: 0, subJobs: [],
        };
        setJobs(prev => insertSubJob(prev, subJobTargetId, newSub));
        setSubJobForm({ title: '', description: '', priority: 'Medium' });
        setShowSubJobModal(false);
        // Auto-expand the parent job card if it's a root job
        setExpandedJobs(prev => ({ ...prev, [subJobTargetId]: true }));
        setSubJobTargetId(null);
    };

    const handleSaveLunch = (form) => { setLunchBreak(form); setShowLunchModal(false); };

    const isLunchActive = () => {
        if (!lunchBreak.enabled || !lunchBreak.start || !lunchBreak.end) return false;
        const now = new Date();
        const [sh, sm] = lunchBreak.start.split(':').map(Number);
        const [eh, em] = lunchBreak.end.split(':').map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
    };
    const lunchActive = isLunchActive();

    const visibleJobs = jobs.filter(j => {
        const matchStatus = filterStatus === 'all' || j.status === filterStatus;
        const matchQ = !searchQ || j.title.toLowerCase().includes(searchQ.toLowerCase()) || j.id.toLowerCase().includes(searchQ.toLowerCase());
        return matchStatus && matchQ;
    });

    return (
        <div className="p-3">
            {/* ── Header ── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-indigo-600" />My Jobs
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track your work sessions with precision</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {lunchActive && (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium animate-pulse">
                            <Coffee className="w-4 h-4" />Lunch Break Active – Timer Paused
                        </span>
                    )}
                    <button
                        onClick={() => setShowLunchModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <Coffee className="w-4 h-4" />
                        {lunchBreak.enabled ? `Lunch ${lunchBreak.start}–${lunchBreak.end}` : 'Set Lunch Break'}
                    </button>
                    <CommonButton label="+ Create Job" variant="primary" size="small" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)} />
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Total Jobs', value: jobs.length, color: 'indigo' },
                    { label: 'Running',    value: jobs.filter(j => j.status === 'running').length,     color: 'blue'  },
                    { label: 'Completed',  value: jobs.filter(j => j.status === 'completed').length,   color: 'green' },
                    { label: 'In Progress',value: jobs.filter(j => j.status === 'in-progress').length, color: 'amber' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* ── Filter bar ── */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text" placeholder="Search by title or Job ID..."
                    value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    className="flex-1 min-w-[180px] px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <div className="flex gap-1 flex-wrap">
                    {['all','idle','running','completed','in-progress','refer'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Running Banner ── */}
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

            {/* ── Job List ── */}
            {visibleJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Briefcase className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No jobs found</p>
                    <p className="text-xs mt-1">Create a new job to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {visibleJobs.map(job => {
                        const isRunning = job.status === 'running';
                        const canRun    = !runningJobId || runningJobId === job.id;
                        const isExpanded = expandedJobs[job.id];
                        const pCfg = PRIORITY_CONFIG[job.priority] || PRIORITY_CONFIG.Medium;

                        return (
                            <div key={job.id}
                                className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${isRunning ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'}`}>
                                {/* Card content */}
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-1.5 h-12 rounded-full flex-shrink-0 ${pCfg.dot}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                    {job.id}
                                                </span>
                                                <PriorityBadge priority={job.priority} />
                                                <StatusBadge status={job.status} />
                                                {job.estTime > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <AlarmClock className="w-3 h-3" />Est: {job.estTime}m
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-base font-semibold text-gray-900 truncate">{job.title}</h3>
                                            {job.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{job.description}</p>}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />{new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                                {job.elapsedSecs > 0 && !isRunning && (
                                                    <span className="flex items-center gap-1 font-mono font-medium text-gray-600">
                                                        <Clock className="w-3 h-3" />{formatDuration(job.elapsedSecs)}
                                                    </span>
                                                )}
                                                {job.stopNote && (
                                                    <span className="flex items-center gap-1 text-gray-500 truncate max-w-[200px]" title={job.stopNote}>
                                                        <Info className="w-3 h-3 flex-shrink-0" />{job.stopNote}
                                                    </span>
                                                )}
                                                {job.subJobs?.length > 0 && (
                                                    <span className="text-indigo-500 font-medium">
                                                        {job.subJobs.length} sub-job{job.subJobs.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Timer + buttons */}
                                        <div className="flex-shrink-0 text-right">
                                            {isRunning && job.startedAt && (
                                                <div className="mb-2 flex flex-col items-end">
                                                    <LiveTimer startedAt={job.startedAt} pausedSecs={job.pausedSecs} isLunchActive={lunchActive} />
                                                    <span className="text-xs text-indigo-400 mt-0.5">elapsed</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 justify-end flex-wrap mt-1">
                                                {!isRunning && job.status !== 'completed' && (
                                                    <button onClick={() => handleRun(job.id)} disabled={!canRun}
                                                        title={canRun ? 'Run Job' : 'Another job is running'}
                                                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${canRun ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                                        <Play className="w-3.5 h-3.5" />Run
                                                    </button>
                                                )}
                                                {isRunning && (
                                                    <button onClick={() => openStopModal(job.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all">
                                                        <Square className="w-3.5 h-3.5" />Stop
                                                    </button>
                                                )}
                                                <button onClick={() => openSubJobModal(job.id)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all">
                                                    <Plus className="w-3.5 h-3.5" />Sub-Job
                                                </button>
                                                {job.subJobs?.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedJobs(prev => ({ ...prev, [job.id]: !prev[job.id] }))}
                                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Sub-Jobs (full card layout, recursive) ── */}
                                {isExpanded && job.subJobs?.length > 0 && (
                                    <div className="px-4 pb-4 pt-3 border-t border-gray-100">
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            Sub-Jobs of&nbsp;
                                            <span className="font-mono text-indigo-600">{job.id}</span>
                                            <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                                                {job.subJobs.length}
                                            </span>
                                        </p>
                                        <div className="space-y-2">
                                            {job.subJobs.map(sub => (
                                                <SubJobCard
                                                    key={sub.id}
                                                    sub={sub}
                                                    parentId={job.id}
                                                    depth={1}
                                                    onAddSubJob={openSubJobModal}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Create Job Modal ── */}
            <CommonModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Job" size="lg" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowCreateModal(false)} />
                        <CommonButton label="Create Job" variant="primary" size="small" onClick={handleCreateJob} disabled={!createForm.title.trim()} />
                    </div>
                }>
                <div className="space-y-4">
                    <CommonInputField label="Job Title" required value={createForm.title} onChange={v => setCreateForm(p => ({ ...p, title: v }))} placeholder="e.g. Implement login API" />
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={createForm.description} onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the job objective..." rows={3}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <CommonInputField label="Estimated Time (minutes)" type="number" value={createForm.estTime} onChange={v => setCreateForm(p => ({ ...p, estTime: v }))} placeholder="e.g. 120" onlyNumber />
                        <CommonDropDown label="Priority" value={createForm.priority} onChange={v => setCreateForm(p => ({ ...p, priority: v }))} options={PRIORITY_OPTIONS} />
                    </div>
                </div>
            </CommonModal>

            {/* ── Stop Modal ── */}
            <CommonModal isOpen={showStopModal} onClose={() => setShowStopModal(false)} title="Stop Job" size="md" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowStopModal(false)} />
                        <CommonButton label="Confirm Stop" variant="danger" size="small" onClick={handleStop} />
                    </div>
                }>
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>This will stop the timer for <strong className="font-mono">{stopTargetId}</strong>. Update the status below.</span>
                    </div>
                    <CommonDropDown label="Job Status" required value={stopForm.status} onChange={v => setStopForm(p => ({ ...p, status: v }))} options={STOP_STATUS_OPTIONS} />
                    {stopForm.status === 'refer' && (
                        <CommonInputField label="Refer To (person / team)" value={stopForm.referTo} onChange={v => setStopForm(p => ({ ...p, referTo: v }))} placeholder="e.g. John / Backend Team" />
                    )}
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Notes / Description{stopForm.status === 'refer' && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <textarea value={stopForm.description} onChange={e => setStopForm(p => ({ ...p, description: e.target.value }))}
                            placeholder={stopForm.status === 'refer' ? 'Reason for referral...' : 'Any additional notes...'}
                            rows={3} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                </div>
            </CommonModal>

            {/* ── Sub-Job Modal ── */}
            <CommonModal isOpen={showSubJobModal} onClose={() => setShowSubJobModal(false)}
                title={
                    <span>Add Sub-Job&nbsp;
                        <span className="text-sm font-normal text-gray-500">
                            under <span className="font-mono text-indigo-600 font-semibold">{subJobTargetId}</span>
                        </span>
                    </span>
                }
                size="md" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowSubJobModal(false)} />
                        <CommonButton label="Add Sub-Job" variant="primary" size="small" onClick={handleCreateSubJob} disabled={!subJobForm.title.trim()} />
                    </div>
                }>
                <div className="space-y-4">
                    {/* Parent reference chip */}
                    <div className="flex items-center gap-2 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="text-xs text-indigo-700 font-medium">
                            Parent: <span className="font-mono font-bold">{subJobTargetId}</span>
                        </span>
                    </div>
                    <CommonInputField label="Sub-Job Title" required value={subJobForm.title} onChange={v => setSubJobForm(p => ({ ...p, title: v }))} placeholder="e.g. Write unit tests" />
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={subJobForm.description} onChange={e => setSubJobForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="What does this sub-task involve?" rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 hover:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <CommonDropDown label="Priority" value={subJobForm.priority} onChange={v => setSubJobForm(p => ({ ...p, priority: v }))} options={PRIORITY_OPTIONS} />
                </div>
            </CommonModal>

            {/* ── Lunch Break Modal ── */}
            <LunchBreakModal isOpen={showLunchModal} onClose={() => setShowLunchModal(false)} lunchBreak={lunchBreak} onSave={handleSaveLunch} />
        </div>
    );
}

// ── Lunch Break Modal ──────────────────────────────────────────
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
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
                            <input type="time" value={form.start} onChange={e => setForm(p => ({ ...p, start: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">End Time</label>
                            <input type="time" value={form.end} onChange={e => setForm(p => ({ ...p, end: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
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
