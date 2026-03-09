import React, { useState, useEffect, useRef } from 'react';
import {
    Play, Square, Plus, Clock, Calendar, AlertCircle, CheckCircle2,
    ChevronDown, ChevronUp, Briefcase, Tag, Coffee,
    Flag, ArrowRight, CircleDot, RefreshCw,
    AlarmClock, Info, User, Users, UserPlus,
    Link, GitBranch, Eye, Edit3, Archive,
    Download, Filter, SortAsc, SortDesc
} from 'lucide-react';
import CommonModal from '../basicComponents/CommonModal';
import CommonButton from '../basicComponents/CommonButton';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDropDown from '../basicComponents/CommonDropDown';
import Breadcrumb from '../basicComponents/BreadCrumb';

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

const PRIORITY_CONFIG = {
    Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500', icon: <Flag className="w-3 h-3" /> },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', icon: <Flag className="w-3 h-3" /> },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', icon: <Flag className="w-3 h-3" /> },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500', icon: <Flag className="w-3 h-3" /> },
};

const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle', icon: <CircleDot className="w-3 h-3" /> },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" /> },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: <ArrowRight className="w-3 h-3" /> },
    'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On Hold', icon: <Clock className="w-3 h-3" /> },
    'in-review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review', icon: <Eye className="w-3 h-3" /> },
    refer: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Referred', icon: <UserPlus className="w-3 h-3" /> },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Archived', icon: <Archive className="w-3 h-3" /> },
};

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'].map(v => ({ label: v, value: v }));
const STOP_STATUS_OPTIONS = [
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in-progress' },
    { label: 'In Review', value: 'in-review' },
    { label: 'On Hold', value: 'on-hold' },
    { label: 'Refer to Another', value: 'refer' },
];

// Mock users/teams for assignment
const AVAILABLE_USERS = [
    { id: 'USR001', name: 'John Doe', team: 'Development', email: 'john@example.com' },
    { id: 'USR002', name: 'Jane Smith', team: 'Development', email: 'jane@example.com' },
    { id: 'USR003', name: 'Mike Johnson', team: 'QA', email: 'mike@example.com' },
    { id: 'USR004', name: 'Sarah Williams', team: 'DevOps', email: 'sarah@example.com' },
    { id: 'USR005', name: 'Tom Brown', team: 'UI/UX', email: 'tom@example.com' },
];

const AVAILABLE_TEAMS = ['Development', 'QA', 'DevOps', 'UI/UX', 'Management', 'Support'];

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
    const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
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
            ? 'font-mono text-xs font-bold text-indigo-700 tracking-wider'
            : 'font-mono text-lg font-bold text-indigo-700 tracking-wider'
        }>
            {formatDuration(elapsed)}
        </span>
    );
}

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

function updateJobInTree(nodes, targetId, updaterFn) {
    return nodes.map(node => {
        if (node.id === targetId) return updaterFn(node);
        if (node.subJobs?.length) {
            return { ...node, subJobs: updateJobInTree(node.subJobs, targetId, updaterFn) };
        }
        return node;
    });
}

function JobTrackingMain({
    jobs,
    setJobs,
    lunchBreak,
    setLunchBreak,
    currentUser = { id: 'USR001', name: 'John Doe', team: 'Development' } // Mock current user
}) {
    const [runningJobId, setRunningJobId] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStopModal, setShowStopModal] = useState(false);
    const [showSubJobModal, setShowSubJobModal] = useState(false);
    const [showLunchModal, setShowLunchModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const [createForm, setCreateForm] = useState({
        title: '',
        description: '',
        estTime: '',
        priority: 'Medium',
        assignedTo: null,
        assignedTeam: '',
        tags: [],
        dueDate: '',
        estimatedHours: ''
    });

    const [stopForm, setStopForm] = useState({
        status: 'completed',
        description: '',
        referTo: '',
        referType: 'user', // 'user' or 'team'
        timeSpent: '',
        completionNotes: ''
    });

    const [subJobForm, setSubJobForm] = useState({
        title: '',
        description: '',
        priority: 'Medium'
        // No assignment fields for sub-jobs as requested
    });

    const [stopTargetId, setStopTargetId] = useState(null);
    const [subJobTargetId, setSubJobTargetId] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState({});
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
            startedAt: null,
            stoppedAt: null,
            elapsedSecs: 0,
            pausedSecs: 0,
            stopNote: '',
            subJobs: [],
            runLog: [],
            comments: [],
            attachments: [],
            metadata: {
                version: 1,
                lastModified: new Date().toISOString(),
                modifiedBy: currentUser
            }
        };
        setJobs(prev => [newJob, ...prev]);
        setCreateForm({
            title: '', description: '', estTime: '', priority: 'Medium',
            assignedTo: null, assignedTeam: '', tags: [], dueDate: '', estimatedHours: ''
        });
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
                modifiedBy: currentUser
            }
        })));
    };

    const openStopModal = (jobId) => {
        setStopTargetId(jobId);
        setStopForm({
            status: 'completed',
            description: '',
            referTo: '',
            referType: 'user',
            timeSpent: '',
            completionNotes: ''
        });
        setShowStopModal(true);
    };

    const handleStop = () => {
        if (!stopTargetId) return;
        const now = Date.now();
        setJobs(prev => updateJobInTree(prev, stopTargetId, node => {
            const addSecs = node.startedAt ? Math.floor((now - node.startedAt) / 1000) : 0;
            const totalElapsed = (node.elapsedSecs || 0) + addSecs;

            // Find referred user/team if applicable
            let referredTo = null;
            if (stopForm.status === 'refer' && stopForm.referTo) {
                if (stopForm.referType === 'user') {
                    referredTo = AVAILABLE_USERS.find(u => u.id === stopForm.referTo) || null;
                } else {
                    referredTo = { team: stopForm.referTo };
                }
            }

            return {
                ...node,
                status: stopForm.status,
                stoppedAt: new Date().toISOString(),
                startedAt: null,
                elapsedSecs: totalElapsed,
                stopNote: stopForm.description,
                referredTo: referredTo,
                referType: stopForm.referType,
                completionNotes: stopForm.completionNotes,
                actualHours: Math.round(totalElapsed / 3600 * 10) / 10,
                runLog: [...(node.runLog || []), {
                    start: new Date(node.startedAt || now).toISOString(),
                    end: new Date(now).toISOString(),
                    duration: addSecs,
                    status: stopForm.status,
                    note: stopForm.description,
                    completedBy: currentUser
                }],
                metadata: {
                    ...node.metadata,
                    lastModified: new Date().toISOString(),
                    modifiedBy: currentUser,
                    version: (node.metadata?.version || 1) + 1
                }
            };
        }));
        setRunningJobId(null);
        setShowStopModal(false);
        setStopTargetId(null);
    };

    const openSubJobModal = (parentId) => {
        setSubJobTargetId(parentId);
        setSubJobForm({ title: '', description: '', priority: 'Medium' });
        setShowSubJobModal(true);
    };

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
            createdBy: currentUser,
            elapsedSecs: 0,
            subJobs: [],
            parentId: subJobTargetId,
            metadata: {
                version: 1,
                lastModified: new Date().toISOString(),
                modifiedBy: currentUser
            }
            // No assignment fields for sub-jobs as requested
        };
        setJobs(prev => insertSubJob(prev, subJobTargetId, newSub));
        setSubJobForm({ title: '', description: '', priority: 'Medium' });
        setShowSubJobModal(false);
        setExpandedJobs(prev => ({ ...prev, [subJobTargetId]: true }));
        setSubJobTargetId(null);
    };

    const openJobDetails = (job) => {
        setSelectedJob(job);
        setShowDetailsModal(true);
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

    // Filter and sort jobs
    const visibleJobs = jobs
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
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
                    valA = priorityOrder[a.priority] || 99;
                    valB = priorityOrder[b.priority] || 99;
                    break;
                case 'dueDate':
                    valA = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000);
                    valB = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000);
                    break;
                case 'title':
                    valA = a.title;
                    valB = b.title;
                    break;
                default:
                    valA = new Date(a.createdAt);
                    valB = new Date(b.createdAt);
            }

            if (sortOrder === 'asc') {
                return valA > valB ? 1 : -1;
            }
            return valA < valB ? 1 : -1;
        });

    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Jobs' }]}
                title="My Jobs"
                description="Create, run, and track your job sessions — manage time with precision"
                actions={<div className="flex flex-wrap items-center justify-end gap-3 mb-5">
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
                        <CommonButton label="Create Job" variant="primary" size="small" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)} />
                    </div>
                </div>}
            />

            {/* Stats Cards */}
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

            {/* Filters and Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text" placeholder="Search by title, ID, or description..."
                    value={searchQ} onChange={e => setSearchQ(e.target.value)}
                    className="flex-1 min-w-[180px] px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <select
                    value={filterAssignee}
                    onChange={e => setFilterAssignee(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="all">All Assignees</option>
                    <option value="unassigned">Unassigned</option>
                    {AVAILABLE_USERS.map(user => (
                        <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                    {AVAILABLE_TEAMS.map(team => (
                        <option key={team} value={team}>{team} (Team)</option>
                    ))}
                </select>

                <div className="flex gap-1 flex-wrap">
                    {['all', 'idle', 'running', 'completed', 'in-progress', 'refer', 'on-hold'].map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${filterStatus === s ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                                }`}>
                            {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
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
            ) : (
                <div className="space-y-4">
                    {visibleJobs.map(job => {
                        const isRunning = job.status === 'running';
                        const canRun = !runningJobId || runningJobId === job.id;
                        const isExpanded = expandedJobs[job.id];
                        const pCfg = PRIORITY_CONFIG[job.priority] || PRIORITY_CONFIG.Medium;

                        return (
                            <div key={job.id}
                                className={`bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${isRunning ? 'border-indigo-300 ring-1 ring-indigo-200' : 'border-gray-200'
                                    }`}>
                                <div className="p-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-1 w-1.5 h-12 rounded-full flex-shrink-0 ${pCfg.dot}`} />

                                        <div className="flex-1 min-w-0">
                                            {/* Header with IDs and badges */}
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                    {job.id}
                                                </span>
                                                {job.parentId && (
                                                    <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 flex items-center gap-1">
                                                        <GitBranch className="w-3 h-3" />{job.parentId}
                                                    </span>
                                                )}
                                                <PriorityBadge priority={job.priority} />
                                                <StatusBadge status={job.status} />
                                                {job.estTime > 0 && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <AlarmClock className="w-3 h-3" />Est: {job.estTime}m
                                                    </span>
                                                )}
                                                {job.actualHours && (
                                                    <span className="flex items-center gap-1 text-xs text-green-600">
                                                        <Clock className="w-3 h-3" />Actual: {job.actualHours}h
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title and Description */}
                                            <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
                                            {job.description && (
                                                <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{job.description}</p>
                                            )}

                                            {/* Assignment Info */}
                                            <div className="flex items-center gap-4 mt-2">
                                                {job.assignedTo && (
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="w-3.5 h-3.5 text-gray-400" />
                                                        <UserBadge user={job.assignedTo} size="sm" />
                                                    </div>
                                                )}
                                                {job.assignedTeam && !job.assignedTo && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                            {job.assignedTeam}
                                                        </span>
                                                    </div>
                                                )}
                                                {job.dueDate && (
                                                    <span className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Due: {new Date(job.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                                {job.referredTo && (
                                                    <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                                        <UserPlus className="w-3.5 h-3.5" />
                                                        Referred to: {job.referredTo.name || job.referredTo.team}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Metadata */}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    Created: {new Date(job.createdAt).toLocaleDateString()}
                                                </span>
                                                {job.elapsedSecs > 0 && !isRunning && (
                                                    <span className="flex items-center gap-1 font-mono font-medium text-gray-600">
                                                        <Clock className="w-3 h-3" />
                                                        Total: {formatDuration(job.elapsedSecs)}
                                                    </span>
                                                )}
                                                {job.stopNote && (
                                                    <span className="flex items-center gap-1 text-gray-500 truncate max-w-[200px]" title={job.stopNote}>
                                                        <Info className="w-3 h-3 flex-shrink-0" />
                                                        Note: {job.stopNote}
                                                    </span>
                                                )}
                                                {job.subJobs?.length > 0 && (
                                                    <span className="text-indigo-500 font-medium flex items-center gap-1">
                                                        <GitBranch className="w-3 h-3" />
                                                        {job.subJobs.length} sub-job{job.subJobs.length > 1 ? 's' : ''}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Created/Updated By */}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                                {job.createdBy && (
                                                    <span>
                                                        Created by: <span className="text-gray-600">{job.createdBy.name}</span>
                                                    </span>
                                                )}
                                                {job.metadata?.lastModified && (
                                                    <span>
                                                        Updated: <span className="text-gray-600">
                                                            {new Date(job.metadata.lastModified).toLocaleString()}
                                                        </span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex-shrink-0">
                                            {isRunning && job.startedAt && (
                                                <div className="mb-2 flex flex-col items-end">
                                                    <LiveTimer startedAt={job.startedAt} pausedSecs={job.pausedSecs} isLunchActive={lunchActive} />
                                                    <span className="text-xs text-indigo-400 mt-0.5">elapsed</span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1.5 justify-end flex-wrap">
                                                <button
                                                    onClick={() => openJobDetails(job)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Details
                                                </button>

                                                <button
                                                    onClick={() => openSubJobModal(job.id)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                    Sub-Job
                                                </button>

                                                {!isRunning && job.status !== 'completed' && job.status !== 'archived' && (
                                                    <button
                                                        onClick={() => handleRun(job.id)}
                                                        disabled={!canRun}
                                                        title={canRun ? 'Run Job' : 'Another job is running'}
                                                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${canRun
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <Play className="w-3.5 h-3.5" />
                                                        Run
                                                    </button>
                                                )}

                                                {isRunning && (
                                                    <button
                                                        onClick={() => openStopModal(job.id)}
                                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-sm transition-all"
                                                    >
                                                        <Square className="w-3.5 h-3.5" />
                                                        Stop
                                                    </button>
                                                )}

                                                {job.subJobs?.length > 0 && (
                                                    <button
                                                        onClick={() => setExpandedJobs(prev => ({ ...prev, [job.id]: !prev[job.id] }))}
                                                        className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
                                                    >
                                                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sub-jobs */}
                                    {isExpanded && job.subJobs?.length > 0 && (
                                        <div className="mt-4 ml-6 pl-4 border-l-2 border-indigo-200 space-y-3">
                                            {job.subJobs.map(subJob => (
                                                <div key={subJob.id} className="bg-gray-50 rounded-lg p-3">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-mono text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                                                    {subJob.id}
                                                                </span>
                                                                <PriorityBadge priority={subJob.priority} />
                                                                <StatusBadge status={subJob.status} />
                                                            </div>
                                                            <h4 className="text-sm font-medium text-gray-900">{subJob.title}</h4>
                                                            {subJob.description && (
                                                                <p className="text-xs text-gray-500 mt-0.5">{subJob.description}</p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {subJob.elapsedSecs > 0 && (
                                                                <span className="text-xs font-mono text-gray-500">
                                                                    {formatDuration(subJob.elapsedSecs)}
                                                                </span>
                                                            )}
                                                            <button
                                                                onClick={() => handleRun(subJob.id)}
                                                                disabled={runningJobId && runningJobId !== subJob.id}
                                                                className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100"
                                                            >
                                                                <Play className="w-3.5 h-3.5 text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Job Modal */}
            <CommonModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Create New Job"
                size="3xl"
                animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowCreateModal(false)} />
                        <CommonButton label="Create Job" variant="primary" size="small" onClick={handleCreateJob} disabled={!createForm.title.trim()} />
                    </div>
                }
            >
                <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonInputField
                            label="Job ID"
                            disabled
                            required
                            value={generateId('JOB')}
                        />
                        <CommonInputField
                            label="Job Title"
                            required
                            value={createForm.title}
                            onChange={v => setCreateForm(p => ({ ...p, title: v }))}
                            placeholder="e.g. Implement login API"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonDropDown
                            label='Assign To User'
                            value={createForm.assignedTo?.id || ''}
                            onChange={e => {
                                const user = AVAILABLE_USERS.find(u => u.id === e.target.value);
                                setCreateForm(p => ({ ...p, assignedTo: user || null }));
                            }}
                            options={AVAILABLE_USERS.map(u => ({ label: u.name, value: u.id }))}
                        />
                        <CommonDropDown
                            label='Assign To team'
                            value={createForm.assignedTeam}
                            onChange={e => setCreateForm(p => ({ ...p, assignedTeam: e.target.value }))}
                            options={AVAILABLE_TEAMS.map(team => ({ label: team, value: team }))}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CommonInputField
                            label="Est. Time (minutes)"
                            type="number"
                            value={createForm.estTime}
                            onChange={v => setCreateForm(p => ({ ...p, estTime: v }))}
                            placeholder="e.g. 120"
                            onlyNumber
                        />
                        <CommonInputField
                            label="Est. Hours"
                            type="number"
                            value={createForm.estimatedHours}
                            onChange={v => setCreateForm(p => ({ ...p, estimatedHours: v }))}
                            placeholder="e.g. 8"
                            onlyNumber
                        />
                        <CommonDropDown
                            label="Priority"
                            value={createForm.priority}
                            onChange={v => setCreateForm(p => ({ ...p, priority: v }))}
                            options={PRIORITY_OPTIONS}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                type="date"
                                value={createForm.dueDate}
                                onChange={e => setCreateForm(p => ({ ...p, dueDate: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={createForm.tags.join(', ')}
                                onChange={e => setCreateForm(p => ({
                                    ...p,
                                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                                }))}
                                placeholder="frontend, api, urgent"
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={createForm.description}
                            onChange={e => setCreateForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="Describe the job objective, requirements, and any important details..."
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                </div>
            </CommonModal>

            <CommonModal
                isOpen={showStopModal}
                onClose={() => setShowStopModal(false)}
                title="Stop Job"
                size="lg"
                animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowStopModal(false)} />
                        <CommonButton label="Confirm Stop" variant="danger" size="small" onClick={handleStop} />
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                            This will stop the timer for <strong className="font-mono">{stopTargetId}</strong>.
                            Please provide the completion details below.
                        </span>
                    </div>

                    <CommonDropDown
                        label="Job Status"
                        required
                        value={stopForm.status}
                        onChange={v => setStopForm(p => ({ ...p, status: v }))}
                        options={STOP_STATUS_OPTIONS}
                    />

                    {stopForm.status === 'refer' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Refer Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="user"
                                                checked={stopForm.referType === 'user'}
                                                onChange={e => setStopForm(p => ({ ...p, referType: e.target.value }))}
                                                className="text-indigo-600"
                                            />
                                            <span className="text-sm">User</span>
                                        </label>
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                value="team"
                                                checked={stopForm.referType === 'team'}
                                                onChange={e => setStopForm(p => ({ ...p, referType: e.target.value }))}
                                                className="text-indigo-600"
                                            />
                                            <span className="text-sm">Team</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {stopForm.referType === 'user' ? (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Refer to User</label>
                                    <select
                                        value={stopForm.referTo}
                                        onChange={e => setStopForm(p => ({ ...p, referTo: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">Select User</option>
                                        {AVAILABLE_USERS.map(user => (
                                            <option key={user.id} value={user.id}>{user.name} ({user.team})</option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Refer to Team</label>
                                    <select
                                        value={stopForm.referTo}
                                        onChange={e => setStopForm(p => ({ ...p, referTo: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    >
                                        <option value="">Select Team</option>
                                        {AVAILABLE_TEAMS.map(team => (
                                            <option key={team} value={team}>{team}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Notes / Description{stopForm.status === 'refer' && <span className="ml-1 text-red-500">*</span>}
                        </label>
                        <textarea
                            value={stopForm.description}
                            onChange={e => setStopForm(p => ({ ...p, description: e.target.value }))}
                            placeholder={stopForm.status === 'refer'
                                ? 'Reason for referral and any context...'
                                : 'Any additional notes about the completion...'
                            }
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Time Spent (optional)</label>
                        <input
                            type="text"
                            value={stopForm.timeSpent}
                            onChange={e => setStopForm(p => ({ ...p, timeSpent: e.target.value }))}
                            placeholder="e.g. 3 hours 30 minutes"
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Completion Notes</label>
                        <textarea
                            value={stopForm.completionNotes}
                            onChange={e => setStopForm(p => ({ ...p, completionNotes: e.target.value }))}
                            placeholder="Any final notes, outcomes, or next steps..."
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                    </div>
                </div>
            </CommonModal>

            {/* Sub-Job Modal - No assignment fields */}
            <CommonModal
                isOpen={showSubJobModal}
                onClose={() => setShowSubJobModal(false)}
                title={
                    <span>Add Sub-Job&nbsp;
                        <span className="text-sm font-normal text-gray-500">
                            under <span className="font-mono text-indigo-600 font-semibold">{subJobTargetId}</span>
                        </span>
                    </span>
                }
                size="md"
                animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowSubJobModal(false)} />
                        <CommonButton label="Add Sub-Job" variant="primary" size="small" onClick={handleCreateSubJob} disabled={!subJobForm.title.trim()} />
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-2 p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                        <span className="text-xs text-indigo-700 font-medium">
                            Parent: <span className="font-mono font-bold">{subJobTargetId}</span>
                        </span>
                    </div>

                    <CommonInputField
                        label="Sub-Job Title"
                        required
                        value={subJobForm.title}
                        onChange={v => setSubJobForm(p => ({ ...p, title: v }))}
                        placeholder="e.g. Write unit tests"
                    />

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            value={subJobForm.description}
                            onChange={e => setSubJobForm(p => ({ ...p, description: e.target.value }))}
                            placeholder="What does this sub-task involve?"
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                        />
                    </div>

                    <CommonDropDown
                        label="Priority"
                        value={subJobForm.priority}
                        onChange={v => setSubJobForm(p => ({ ...p, priority: v }))}
                        options={PRIORITY_OPTIONS}
                    />

                    {/* Note about sub-jobs */}
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Sub-jobs inherit assignment from parent job and cannot be assigned separately.
                    </p>
                </div>
            </CommonModal>

            {/* Job Details Modal */}
            {selectedJob && (
                <CommonModal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={`Job Details: ${selectedJob.id}`}
                    size="3xl"
                    animation="slide"
                >
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Title</h4>
                                <p className="text-sm font-semibold">{selectedJob.title}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Status</h4>
                                <StatusBadge status={selectedJob.status} />
                            </div>
                        </div>

                        {/* Assignment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Created By</h4>
                                {selectedJob.createdBy && (
                                    <UserBadge user={selectedJob.createdBy} />
                                )}
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Assigned To</h4>
                                {selectedJob.assignedTo && (
                                    <UserBadge user={selectedJob.assignedTo} />
                                )}
                                {selectedJob.assignedTeam && !selectedJob.assignedTo && (
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        {selectedJob.assignedTeam}
                                    </span>
                                )}
                                {!selectedJob.assignedTo && !selectedJob.assignedTeam && (
                                    <span className="text-sm text-gray-400">Unassigned</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Description</h4>
                            <p className="text-sm bg-gray-50 p-3 rounded-lg">
                                {selectedJob.description || 'No description provided'}
                            </p>
                        </div>

                        {/* Time Tracking */}
                        <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-2">Time Tracking</h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Estimated</p>
                                    <p className="text-lg font-bold text-indigo-600">
                                        {selectedJob.estTime ? `${selectedJob.estTime}m` : 'N/A'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Actual</p>
                                    <p className="text-lg font-bold text-green-600">
                                        {selectedJob.actualHours ? `${selectedJob.actualHours}h` :
                                            selectedJob.elapsedSecs ? formatDuration(selectedJob.elapsedSecs) : '0'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-500">Due Date</p>
                                    <p className="text-lg font-bold text-orange-600">
                                        {selectedJob.dueDate ? new Date(selectedJob.dueDate).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Run Log */}
                        {selectedJob.runLog && selectedJob.runLog.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Activity Log</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedJob.runLog.map((log, idx) => (
                                        <div key={idx} className="bg-gray-50 p-2 rounded-lg text-xs">
                                            <div className="flex justify-between">
                                                <span className="font-medium">
                                                    {new Date(log.start).toLocaleString()} - {new Date(log.end).toLocaleString()}
                                                </span>
                                                <StatusBadge status={log.status} />
                                            </div>
                                            {log.note && <p className="text-gray-600 mt-1">{log.note}</p>}
                                            {log.completedBy && (
                                                <p className="text-gray-400 mt-1">By: {log.completedBy.name}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="text-xs text-gray-400 border-t pt-4">
                            <p>Version: {selectedJob.metadata?.version || 1}</p>
                            <p>Last Modified: {selectedJob.metadata?.lastModified ? new Date(selectedJob.metadata.lastModified).toLocaleString() : 'N/A'}</p>
                        </div>
                    </div>
                </CommonModal>
            )}

            <LunchBreakModal
                isOpen={showLunchModal}
                onClose={() => setShowLunchModal(false)}
                lunchBreak={lunchBreak}
                onSave={handleSaveLunch}
            />
        </>
    );
}

function LunchBreakModal({ isOpen, onClose, lunchBreak, onSave }) {
    const [form, setForm] = useState({ ...lunchBreak });
    useEffect(() => { setForm({ ...lunchBreak }); }, [lunchBreak, isOpen]);

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Lunch Break Settings"
            size="sm"
            animation="slide"
            customFooter={
                <div className="flex justify-end gap-2">
                    <CommonButton label="Cancel" variant="outline" size="small" onClick={onClose} />
                    <CommonButton label="Save" variant="success" size="small" onClick={() => onSave(form)} />
                </div>
            }
        >
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Coffee className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">Enable Lunch Break</span>
                    </div>
                    <button
                        onClick={() => setForm(p => ({ ...p, enabled: !p.enabled }))}
                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${form.enabled ? 'bg-amber-500' : 'bg-gray-300'
                            }`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.enabled ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                    </button>
                </div>

                {form.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
                            <input
                                type="time"
                                value={form.start}
                                onChange={e => setForm(p => ({ ...p, start: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">End Time</label>
                            <input
                                type="time"
                                value={form.end}
                                onChange={e => setForm(p => ({ ...p, end: e.target.value }))}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
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