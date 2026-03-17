import React, { useState } from 'react'
import { AVAILABLE_TEAMS, AVAILABLE_USERS, flattenAllJobs, formatDate, formatDuration, generateId, generateSubJobId, HistoryTimeline, insertSubJob, KANBAN_COLUMNS, KanbanCard, ListCard, LunchBreakModal, PRIORITY_OPTIONS, PriorityBadge, ProgressBar, STATUS_CONFIG, StatusBadge, STOP_STATUS_OPTIONS, updateJobInTree, UserBadge } from './commonFunc';
import CommonModal from '../../basicComponents/CommonModal';
import CommonButton from '../../basicComponents/CommonButton';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import { AlarmClock, AlertCircle, Briefcase, Clock, GitBranch, Info, LayoutGrid, List, SortDesc, User, Users } from 'lucide-react';

function JobtrackingMain({ isLoading,
    setIsLoading,
    lunchActive,
    setShowLunchModal,
    lunchBreak,
    setLunchBreak,
    showLunchModal }) {

    const [runningJobId, setRunningJobId] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [jobs, setJobs] = useState([]);


    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStopModal, setShowStopModal] = useState(false);
    const [showSubJobModal, setShowSubJobModal] = useState(false);
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
    const currentUser = { id: 'USR001', name: 'John Doe', team: 'Development' }

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
        setIsLoading({ normal: false, spinner: true })
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
        setIsLoading({ normal: false, spinner: false })
    };

    const openJobDetails = (job) => { setSelectedJob(job); setShowDetailsModal(true); };
    const handleSaveLunch = (form) => { setLunchBreak(form); setShowLunchModal(false); };


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
    return (
        <>
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

            {isLoading.spinner && (<LoadingSpinner />)}

        </>
    )
}

export default JobtrackingMain