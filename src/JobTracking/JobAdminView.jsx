import React, { useState, useMemo } from 'react';
import {
    Users, Briefcase, CheckCircle2, Clock, AlertCircle, ArrowRight,
    Search, Filter, Calendar, ChevronDown, ChevronUp, Eye,
    BookOpen, Settings, Shield, Info, TrendingUp, Activity
} from 'lucide-react';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonTable from '../basicComponents/commonTable';

const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle' },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress' },
    refer: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Refer' },
};

const PRIORITY_CONFIG = {
    Low: { bg: 'bg-green-100', text: 'text-green-700' },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700' },
    High: { bg: 'bg-orange-100', text: 'text-orange-700' },
    Critical: { bg: 'bg-red-100', text: 'text-red-700' },
};

function formatDuration(secs) {
    if (!secs) return '—';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${secs}s`;
}

// Mock employees for demo
const MOCK_EMPLOYEES = [
    { value: 'EMP001', label: 'Athul Krishna (EMP001)' },
    { value: 'EMP002', label: 'Priya Menon (EMP002)' },
    { value: 'EMP003', label: 'Rahul Sharma (EMP003)' },
    { value: 'EMP004', label: 'Anjali Nair (EMP004)' },
];

// Mock data generator for others
const MOCK_JOB_LOGS = {
    EMP002: [
        { id: 'JOB-882201', title: 'API Integration Testing', priority: 'High', status: 'completed', estTime: 120, elapsedSecs: 6900, createdAt: '2026-03-07T09:00:00', stoppedAt: '2026-03-07T11:55:00', stopNote: 'All tests passed' },
        { id: 'JOB-882202', title: 'Design Review Session', priority: 'Medium', status: 'in-progress', estTime: 60, elapsedSecs: 2100, createdAt: '2026-03-08T10:00:00', stoppedAt: null, stopNote: 'Waiting for client feedback' },
    ],
    EMP003: [
        { id: 'JOB-993301', title: 'Database Optimization', priority: 'Critical', status: 'completed', estTime: 240, elapsedSecs: 13200, createdAt: '2026-03-06T08:30:00', stoppedAt: '2026-03-06T12:10:00', stopNote: 'Query time reduced by 40%' },
        { id: 'JOB-993302', title: 'Deploy to Staging', priority: 'High', status: 'refer', estTime: 30, elapsedSecs: 1800, createdAt: '2026-03-08T14:00:00', stoppedAt: '2026-03-08T14:30:00', referTo: 'DevOps Team', stopNote: 'Permission issue on server' },
    ],
    EMP004: [
        { id: 'JOB-774401', title: 'User Research Analysis', priority: 'Medium', status: 'completed', estTime: 180, elapsedSecs: 10800, createdAt: '2026-03-05T09:00:00', stoppedAt: '2026-03-05T12:00:00', stopNote: '' },
    ],
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
        </span>
    );
}

function PriorityBadge({ priority }) {
    const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            {priority}
        </span>
    );
}

// Setup Guide Accordion
function SetupGuide() {
    const [openSection, setOpenSection] = useState(null);
    const sections = [
        {
            id: 'admin',
            icon: <Shield className="w-4 h-4 text-indigo-600" />,
            title: 'Admin Portal Setup',
            content: [
                'Navigate to Admin Panel → Menu Mapping → enable "Job Tracking" for ADMIN role.',
                'Assign job tracking visibility: Admin can view all employees under any department.',
                'Set job retention period (e.g., 90 days) under Company Settings → Job Tracking Config.',
                'Enable "Auto-assign Job IDs" to use sequential ID format (JOB-XXXXXX).',
                'Configure priority levels and allowed statuses under Job Tracking → Settings.',
            ]
        },
        {
            id: 'hr',
            icon: <Users className="w-4 h-4 text-purple-600" />,
            title: 'HR Portal Setup',
            content: [
                'Go to Admin Panel → Menu Mapping → enable "Job Tracking" for HR role.',
                'HR can view jobs for all employees in their assigned departments.',
                'HR can export job reports from the Admin View → Export button (CSV/Excel).',
                'Set up HR notifications: receive alerts when jobs are stuck "In Progress" > 48h.',
                'HR can set global lunch break defaults under HR Settings → Attendance → Lunch Break.',
            ]
        },
        {
            id: 'manager',
            icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
            title: 'Manager Portal Setup',
            content: [
                'Enable "Job Tracking" for MANAGER role in Menu Mapping.',
                'Managers can only see jobs of their direct reports (auto-filtered by reporting line).',
                'Managers can mark a job for review or add comments from the job detail view.',
                'Enable "Daily Digest" email for managers: Job Tracking → Manager Settings → Notifications.',
                'Managers can approve "Referred" jobs and reassign them to team members.',
            ]
        },
        {
            id: 'employee',
            icon: <Activity className="w-4 h-4 text-blue-600" />,
            title: 'Employee Tracking Guide',
            content: [
                'Employees access Job Tracking from their portal under Employee Self Service.',
                'Each employee can only see and manage their own jobs.',
                'Jobs must be started (Run) before the timer begins — manual logging is not allowed.',
                'Lunch break pause is honoured automatically during configured break window.',
                'Employees can create sub-jobs to break down complex tasks for better tracking.',
            ]
        },
    ];

    return (
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Portal Setup Guide
            </h3>
            <div className="space-y-2">
                {sections.map(sec => (
                    <div key={sec.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenSection(openSection === sec.id ? null : sec.id)}
                            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                        >
                            <span className="flex items-center gap-2 font-medium text-sm text-gray-800">
                                {sec.icon}
                                {sec.title}
                            </span>
                            {openSection === sec.id
                                ? <ChevronUp className="w-4 h-4 text-gray-500" />
                                : <ChevronDown className="w-4 h-4 text-gray-500" />
                            }
                        </button>
                        {openSection === sec.id && (
                            <div className="p-4 border-t border-gray-100">
                                <ol className="space-y-2">
                                    {sec.content.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function JobAdminView({ jobs }) {
    const [selectedEmp, setSelectedEmp] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [showGuide, setShowGuide] = useState(false);

    // Merge own jobs + mock data for selected employee
    const empJobs = useMemo(() => {
        if (!selectedEmp) return [];
        if (selectedEmp === 'EMP001') {
            // Show "my" jobs for demo
            return jobs;
        }
        return MOCK_JOB_LOGS[selectedEmp] || [];
    }, [selectedEmp, jobs]);

    const filteredJobs = useMemo(() => {
        return empJobs.filter(j => {
            const matchStatus = statusFilter === 'all' || j.status === statusFilter;
            const matchFrom = !dateFrom || (j.createdAt && j.createdAt.slice(0, 10) >= dateFrom);
            const matchTo = !dateTo || (j.createdAt && j.createdAt.slice(0, 10) <= dateTo);
            return matchStatus && matchFrom && matchTo;
        });
    }, [empJobs, statusFilter, dateFrom, dateTo]);

    const stats = useMemo(() => ({
        total: filteredJobs.length,
        completed: filteredJobs.filter(j => j.status === 'completed').length,
        inProgress: filteredJobs.filter(j => j.status === 'in-progress').length,
        refer: filteredJobs.filter(j => j.status === 'refer').length,
        totalTime: filteredJobs.reduce((a, j) => a + (j.elapsedSecs || 0), 0),
    }), [filteredJobs]);

    const columns = [
        {
            header: 'Job ID',
            cell: row => (
                <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                    {row.id}
                </span>
            ),
        },
        {
            header: 'Title',
            cell: row => (
                <div className="max-w-[200px]">
                    <p className="font-medium text-gray-900 text-sm truncate" title={row.title}>{row.title}</p>
                    {row.subJobs?.length > 0 && (
                        <p className="text-xs text-indigo-500">{row.subJobs.length} sub-jobs</p>
                    )}
                </div>
            ),
        },
        {
            header: 'Priority',
            cell: row => <PriorityBadge priority={row.priority} />,
        },
        {
            header: 'Status',
            cell: row => <StatusBadge status={row.status} />,
        },
        {
            header: 'Est Time',
            cell: row => (
                <span className="text-sm text-gray-600">
                    {row.estTime ? `${row.estTime}m` : '—'}
                </span>
            ),
        },
        {
            header: 'Actual Time',
            cell: row => (
                <span className="text-sm font-mono font-medium text-gray-700">
                    {formatDuration(row.elapsedSecs)}
                </span>
            ),
        },
        {
            header: 'Created',
            cell: row => (
                <span className="text-xs text-gray-500">
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                </span>
            ),
        },
        {
            header: 'Notes',
            cell: row => (
                <div className="max-w-[170px] text-xs text-gray-600 truncate" title={row.stopNote}>
                    {row.referTo && <span className="text-purple-600 font-medium">→ {row.referTo} · </span>}
                    {row.stopNote || '—'}
                </div>
            ),
        },
    ];

    return (
        <div className="p-3">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Admin / HR / Manager View
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Track and monitor employee job activity</p>
                </div>
                <button
                    onClick={() => setShowGuide(!showGuide)}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-all"
                >
                    <Settings className="w-4 h-4" />
                    {showGuide ? 'Hide' : 'Show'} Setup Guide
                </button>
            </div>

            {/* Employee Selector */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                        <CommonDropDown
                            label="Select Employee"
                            value={selectedEmp}
                            onChange={setSelectedEmp}
                            options={MOCK_EMPLOYEES}
                            placeholder="Choose an employee..."
                        />
                    </div>
                    <div>
                        <CommonDropDown
                            label="Filter by Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { label: 'All Status', value: 'all' },
                                { label: 'Idle', value: 'idle' },
                                { label: 'Running', value: 'running' },
                                { label: 'Completed', value: 'completed' },
                                { label: 'In Progress', value: 'in-progress' },
                                { label: 'Refer', value: 'refer' },
                            ]}
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">From Date</label>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">To Date</label>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="w-full px-3 py-2 text-sm rounded-lg border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {!selectedEmp ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                    <Users className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">Select an employee to view their job activity</p>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
                        {[
                            { label: 'Total Jobs', value: stats.total, color: 'text-gray-800' },
                            { label: 'Completed', value: stats.completed, color: 'text-green-600' },
                            { label: 'In Progress', value: stats.inProgress, color: 'text-blue-600' },
                            { label: 'Referred', value: stats.refer, color: 'text-purple-600' },
                            { label: 'Total Time', value: formatDuration(stats.totalTime), color: 'text-indigo-700' },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                                <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Job Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-800">
                                Job Records — {MOCK_EMPLOYEES.find(e => e.value === selectedEmp)?.label || selectedEmp}
                            </h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                {filteredJobs.length} record{filteredJobs.length !== 1 ? 's' : ''}
                            </span>
                        </div>
                        {filteredJobs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                                <Briefcase className="w-10 h-10 mb-2 opacity-30" />
                                <p className="text-sm">No job records found</p>
                            </div>
                        ) : (
                            <CommonTable
                                columns={columns}
                                data={filteredJobs}
                                itemsPerPage={10}
                                showSearch={true}
                                showPagination={true}
                            />
                        )}
                    </div>
                </>
            )}

            {/* Setup Guide */}
            {showGuide && <SetupGuide />}
        </div>
    );
}

export default JobAdminView;
