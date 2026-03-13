import React, { useState, useEffect, useMemo } from 'react';
import {
    Users, Briefcase, Clock, Calendar, TrendingUp, Download,
    Filter, Search, ChevronDown, ChevronUp, Eye, Play, Square,
    CheckCircle2, AlertCircle, User, UserPlus, GitBranch,
    BarChart3, PieChart, Activity, Clock3, Target, Award,
    FileText, MoreVertical, RefreshCw, X, DownloadCloud,
    Mail, Phone, MapPin, Globe, Shield, Star, Zap,
    ChevronLeft, ChevronRight, Printer, Share2, Bookmark,
    Settings, LogOut, Menu, Sun, Moon, Bell, Plus
} from 'lucide-react';
import CommonModal from '../basicComponents/CommonModal';
import CommonButton from '../basicComponents/CommonButton';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDropDown from '../basicComponents/CommonDropDown';
import Breadcrumb from '../basicComponents/BreadCrumb';

// Helper Functions
function formatDuration(secs) {
    if (!secs || secs === 0) return '00:00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatDate(dateString, format = 'full') {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (format === 'short') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (format === 'time') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle', icon: <div className="w-2 h-2 rounded-full bg-gray-400" /> },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running', icon: <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: <div className="w-2 h-2 rounded-full bg-blue-500" /> },
    'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On Hold', icon: <div className="w-2 h-2 rounded-full bg-amber-500" /> },
    'in-review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review', icon: <div className="w-2 h-2 rounded-full bg-purple-500" /> },
    refer: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Referred', icon: <div className="w-2 h-2 rounded-full bg-orange-500" /> },
};

const PRIORITY_CONFIG = {
    Low: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' },
    Medium: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    High: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    Critical: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
};

const DEPARTMENTS = ['Development', 'QA', 'DevOps', 'UI/UX', 'Management', 'Support', 'Sales', 'Marketing'];

// Mock Data Generator
const generateMockEmployees = () => [
    {
        id: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Development',
        role: 'Senior Developer',
        status: 'active',
        joinDate: '2023-01-15',
        avatar: null,
        phone: '+1 234-567-8901',
        location: 'New York, USA',
        manager: 'Sarah Johnson',
        skills: ['React', 'Node.js', 'Python'],
        totalJobs: 45,
        completedJobs: 38,
        totalHours: 320,
        efficiency: 92
    },
    {
        id: 'EMP002',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Development',
        role: 'Frontend Lead',
        status: 'active',
        joinDate: '2023-03-20',
        avatar: null,
        phone: '+1 234-567-8902',
        location: 'San Francisco, USA',
        manager: 'Sarah Johnson',
        skills: ['React', 'Vue', 'TypeScript'],
        totalJobs: 38,
        completedJobs: 35,
        totalHours: 280,
        efficiency: 88
    },
    {
        id: 'EMP003',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        department: 'QA',
        role: 'QA Lead',
        status: 'active',
        joinDate: '2023-02-10',
        avatar: null,
        phone: '+1 234-567-8903',
        location: 'Austin, USA',
        manager: 'Tom Wilson',
        skills: ['Selenium', 'Cypress', 'Jest'],
        totalJobs: 62,
        completedJobs: 58,
        totalHours: 410,
        efficiency: 94
    },
    {
        id: 'EMP004',
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        department: 'DevOps',
        role: 'DevOps Engineer',
        status: 'active',
        joinDate: '2023-05-05',
        avatar: null,
        phone: '+1 234-567-8904',
        location: 'Seattle, USA',
        manager: 'Mike Chen',
        skills: ['AWS', 'Docker', 'Kubernetes'],
        totalJobs: 28,
        completedJobs: 25,
        totalHours: 210,
        efficiency: 86
    },
    {
        id: 'EMP005',
        name: 'Tom Brown',
        email: 'tom.brown@company.com',
        department: 'UI/UX',
        role: 'UX Designer',
        status: 'active',
        joinDate: '2023-04-12',
        avatar: null,
        phone: '+1 234-567-8905',
        location: 'Los Angeles, USA',
        manager: 'Emily Davis',
        skills: ['Figma', 'Adobe XD', 'Sketch'],
        totalJobs: 52,
        completedJobs: 48,
        totalHours: 340,
        efficiency: 91
    },
];

const generateMockJobs = (employees) => {
    const jobs = [];
    const jobTitles = [
        'Implement authentication API',
        'Design user dashboard',
        'Fix login page bug',
        'Optimize database queries',
        'Create documentation',
        'Deploy to production',
        'Code review session',
        'Update dependencies',
        'Write unit tests',
        'Performance testing'
    ];

    employees.forEach(emp => {
        const numJobs = Math.floor(Math.random() * 8) + 3;
        for (let i = 0; i < numJobs; i++) {
            const statuses = ['idle', 'running', 'completed', 'in-progress', 'on-hold', 'in-review'];
            const priorities = ['Low', 'Medium', 'High', 'Critical'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const estTime = Math.floor(Math.random() * 240) + 30;
            const elapsedSecs = status === 'completed' ? estTime * 60 : Math.floor(Math.random() * estTime * 60);

            const job = {
                id: `JOB-${String(i + 1).padStart(3, '0')}-${emp.id}`,
                title: jobTitles[Math.floor(Math.random() * jobTitles.length)],
                description: 'Detailed job description goes here with all the requirements and specifications...',
                status: status,
                priority: priorities[Math.floor(Math.random() * priorities.length)],
                estTime: estTime,
                elapsedSecs: elapsedSecs,
                createdAt: createdAt.toISOString(),
                createdBy: emp,
                assignedTo: emp,
                assignedTeam: emp.department,
                startedAt: status === 'running' ? Date.now() - Math.random() * 3600000 : null,
                stoppedAt: status === 'completed' ? new Date().toISOString() : null,
                completedAt: status === 'completed' ? new Date().toISOString() : null,
                dueDate: new Date(Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
                tags: ['frontend', 'api', 'urgent'],
                comments: [],
                attachments: [],
                runLog: generateRunLog(emp, createdAt),
                subJobs: [],
                metadata: {
                    version: 1,
                    lastModified: new Date().toISOString(),
                    modifiedBy: emp,
                    history: []
                }
            };

            // Add subjobs for some jobs
            if (Math.random() > 0.7) {
                const numSubJobs = Math.floor(Math.random() * 3) + 1;
                for (let j = 0; j < numSubJobs; j++) {
                    job.subJobs.push({
                        id: `${job.id}:SUB-${String(j + 1).padStart(3, '0')}`,
                        title: `Sub-task ${j + 1} for ${job.title}`,
                        description: 'Sub-job description...',
                        status: statuses[Math.floor(Math.random() * statuses.length)],
                        priority: priorities[Math.floor(Math.random() * priorities.length)],
                        estTime: Math.floor(estTime / (numSubJobs + 1)),
                        elapsedSecs: Math.floor(Math.random() * 3600),
                        createdAt: new Date().toISOString(),
                        createdBy: emp,
                        parentId: job.id,
                        runLog: []
                    });
                }
            }

            jobs.push(job);
        }
    });
    return jobs;
};

const generateRunLog = (employee, startDate) => {
    const logs = [];
    const numLogs = Math.floor(Math.random() * 5) + 1;
    let currentDate = new Date(startDate);

    for (let i = 0; i < numLogs; i++) {
        const start = new Date(currentDate);
        const duration = Math.floor(Math.random() * 7200) + 1800; // 30min to 2hrs
        const end = new Date(start.getTime() + duration * 1000);

        logs.push({
            start: start.toISOString(),
            end: end.toISOString(),
            duration: duration,
            status: ['in-progress', 'completed', 'on-hold'][Math.floor(Math.random() * 3)],
            note: `Work session ${i + 1} - Completed various tasks`,
            completedBy: employee
        });

        currentDate = new Date(end.getTime() + 24 * 60 * 60 * 1000); // Next day
    }

    return logs;
};

// Stats Card Component
function StatsCard({ title, value, icon: Icon, trend, color = 'indigo', subtext }) {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            {trend && (
                <div className="mt-3 flex items-center gap-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-green-600 font-medium">{trend}%</span>
                    <span className="text-gray-400">vs last week</span>
                </div>
            )}
        </div>
    );
}

// Employee Card Component
function EmployeeCard({ employee, stats, onClick }) {
    return (
        <div
            onClick={() => onClick(employee)}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer"
        >
            <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {employee.name.charAt(0)}
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                            <p className="text-xs text-gray-500">{employee.role} • {employee.department}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {employee.status}
                        </span>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Jobs</p>
                            <p className="text-sm font-semibold text-gray-900">{stats.totalJobs}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Hours</p>
                            <p className="text-sm font-semibold text-gray-900">{Math.round(stats.totalHours)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">Efficiency</p>
                            <p className="text-sm font-semibold text-green-600">{stats.efficiency}%</p>
                        </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{employee.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Job Row Component
function JobRow({ job, onViewDetails }) {
    const status = STATUS_CONFIG[job.status] || STATUS_CONFIG.idle;
    const priority = PRIORITY_CONFIG[job.priority] || PRIORITY_CONFIG.Medium;
    const hasSubJobs = job.subJobs?.length > 0;
    const isOverdue = job.dueDate && new Date(job.dueDate) < new Date() && job.status !== 'completed';

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {job.id}
                    </span>
                    {hasSubJobs && (
                        <span className="text-xs text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-100">
                            {job.subJobs.length} sub
                        </span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {job.assignedTo?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{job.assignedTo?.name || 'Unassigned'}</p>
                        <p className="text-xs text-gray-400">{job.assignedTeam}</p>
                    </div>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="max-w-xs">
                    <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                    <p className="text-xs text-gray-400">Created {formatDate(job.createdAt, 'short')}</p>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${priority.bg} ${priority.text}`}>
                        {job.priority}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${status.icon.props.className}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${status.bg} ${status.text}`}>
                        {status.label}
                    </span>
                </div>
            </td>
            <td className="px-4 py-3">
                <div>
                    <p className="text-sm font-mono font-medium">{formatDuration(job.elapsedSecs)}</p>
                    <p className="text-xs text-gray-400">Est: {job.estTime}m</p>
                </div>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                    {isOverdue ? (
                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Overdue
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">{formatDate(job.dueDate, 'short')}</span>
                    )}
                </div>
            </td>
            <td className="px-4 py-3">
                <button
                    onClick={() => onViewDetails(job)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                >
                    <Eye className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}

// Employee Detail Modal
// Employee Detail Modal - Fixed
function EmployeeDetailModal({ employee, jobs, isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Add early return if employee is null or modal is not open
    if (!employee || !isOpen) return null;

    const employeeJobs = jobs.filter(job => job.assignedTo?.id === employee.id);
    const runningJobs = employeeJobs.filter(job => job.status === 'running');
    const completedJobs = employeeJobs.filter(job => job.status === 'completed');
    const totalHours = employeeJobs.reduce((acc, job) => acc + (job.elapsedSecs / 3600), 0);
    const avgJobTime = completedJobs.length > 0
        ? completedJobs.reduce((acc, job) => acc + (job.elapsedSecs / 3600), 0) / completedJobs.length
        : 0;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Employee Details"
            size="4xl"
        >
            {/* Rest of your component remains the same */}
            <div className="space-y-6">
                {/* Employee Header */}
                <div className="flex items-start gap-4 pb-4 border-b">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                        {employee.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
                                <p className="text-sm text-gray-500">{employee.role} • {employee.department}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                {employee.status}
                            </span>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-4">
                            <div>
                                <p className="text-xs text-gray-400">Email</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-gray-400" />
                                    {employee.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Phone</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-gray-400" />
                                    {employee.phone}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Location</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-gray-400" />
                                    {employee.location}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Manager</p>
                                <p className="text-sm font-medium flex items-center gap-1">
                                    <User className="w-3 h-3 text-gray-400" />
                                    {employee.manager}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-5 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-indigo-600">{employeeJobs.length}</p>
                        <p className="text-xs text-gray-500">Total Jobs</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{completedJobs.length}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-orange-600">{runningJobs.length}</p>
                        <p className="text-xs text-gray-500">Running</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{Math.round(totalHours)}h</p>
                        <p className="text-xs text-gray-500">Total Hours</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">{avgJobTime.toFixed(1)}h</p>
                        <p className="text-xs text-gray-500">Avg Job Time</p>
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {employee.skills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-100">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b">
                    <div className="flex gap-4">
                        {['overview', 'jobs', 'activity', 'performance'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-all ${activeTab === tab
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-h-96 overflow-y-auto">
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-700">Current Active Jobs</h4>
                            {runningJobs.length > 0 ? (
                                runningJobs.map(job => (
                                    <div key={job.id} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-mono text-xs text-indigo-600 mb-1">{job.id}</p>
                                                <p className="font-medium text-gray-900">{job.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Started: {formatDate(job.startedAt, 'time')}
                                                </p>
                                            </div>
                                            <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                                                {formatDuration(job.elapsedSecs)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-8">No active jobs</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'jobs' && (
                        <div className="space-y-3">
                            {employeeJobs.map(job => (
                                <div key={job.id} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-xs text-gray-500">{job.id}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[job.status]?.bg} ${STATUS_CONFIG[job.status]?.text}`}>
                                                    {STATUS_CONFIG[job.status]?.label}
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-900">{job.title}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Est: {job.estTime}m • Spent: {formatDuration(job.elapsedSecs)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400">{formatDate(job.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'activity' && (
                        <div className="space-y-3">
                            {employeeJobs.flatMap(job => job.runLog || []).map((log, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500" />
                                    <div className="flex-1 bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">{formatDate(log.start)} - {formatDate(log.end)}</p>
                                        <p className="text-sm font-medium">{log.note}</p>
                                        <p className="text-xs text-indigo-600 mt-1">Duration: {formatDuration(log.duration)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'performance' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-400">Completion Rate</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {Math.round((completedJobs.length / employeeJobs.length) * 100)}%
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-400">Efficiency Score</p>
                                    <p className="text-2xl font-bold text-indigo-600">{employee.efficiency}%</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Weekly Performance</p>
                                <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                    Performance Chart Placeholder
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CommonModal>
    );
}

// Job Detail Modal
function JobDetailModal({ job, isOpen, onClose }) {
    if (!job) return null;

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Job Details: ${job.id}`}
            size="3xl"
        >
            <div className="space-y-5">
                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-400">Title</p>
                        <p className="text-lg font-semibold">{job.title}</p>
                    </div>
                    <div className="flex gap-2">
                        <div>
                            <p className="text-xs text-gray-400">Status</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${STATUS_CONFIG[job.status]?.bg} ${STATUS_CONFIG[job.status]?.text}`}>
                                {STATUS_CONFIG[job.status]?.icon}
                                {STATUS_CONFIG[job.status]?.label}
                            </span>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Priority</p>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${PRIORITY_CONFIG[job.priority]?.bg} ${PRIORITY_CONFIG[job.priority]?.text}`}>
                                {job.priority}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Assignment */}
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                {job.assignedTo?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{job.assignedTo?.name || 'Unassigned'}</p>
                                <p className="text-xs text-gray-400">{job.assignedTeam}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 mb-1">Created By</p>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                {job.createdBy?.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{job.createdBy?.name || 'System'}</p>
                                <p className="text-xs text-gray-400">{formatDate(job.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">{job.description || 'No description provided'}</p>
                </div>

                {/* Time Tracking */}
                <div>
                    <p className="text-xs text-gray-400 mb-2">Time Tracking</p>
                    <div className="grid grid-cols-4 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Estimated</p>
                            <p className="text-lg font-bold text-indigo-600">{job.estTime}m</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Actual</p>
                            <p className="text-lg font-bold text-green-600">{formatDuration(job.elapsedSecs)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Sessions</p>
                            <p className="text-lg font-bold text-orange-600">{job.runLog?.length || 0}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-400">Due Date</p>
                            <p className="text-sm font-bold text-gray-700">{formatDate(job.dueDate, 'short')}</p>
                        </div>
                    </div>
                </div>

                {/* Work Sessions */}
                {job.runLog?.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-400 mb-2">Work Sessions</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                            {job.runLog.map((log, idx) => (
                                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[log.status]?.bg} ${STATUS_CONFIG[log.status]?.text}`}>
                                            {STATUS_CONFIG[log.status]?.label}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {formatDate(log.start)} - {formatDate(log.end)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">{log.note}</p>
                                    <p className="text-xs text-indigo-600 mt-1">Duration: {formatDuration(log.duration)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sub Jobs */}
                {job.subJobs?.length > 0 && (
                    <div>
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            Sub Jobs ({job.subJobs.length})
                        </p>
                        <div className="space-y-2">
                            {job.subJobs.map(sub => (
                                <div key={sub.id} className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-mono text-xs text-purple-600">{sub.id}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_CONFIG[sub.status]?.bg} ${STATUS_CONFIG[sub.status]?.text}`}>
                                            {STATUS_CONFIG[sub.status]?.label}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium">{sub.title}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                        <span>Est: {sub.estTime}m</span>
                                        <span>Spent: {formatDuration(sub.elapsedSecs)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CommonModal>
    );
}

// Main Admin Dashboard Component
function AdminJobDashboard() {
    const [employees] = useState(generateMockEmployees());
    const [jobs, setJobs] = useState(() => generateMockJobs(employees));
    const [loading, setLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [showJobModal, setShowJobModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateRange, setDateRange] = useState('week');
    const [viewMode, setViewMode] = useState('grid'); // grid or table

    // Calculate Dashboard Stats
    const stats = useMemo(() => {
        const totalEmployees = employees.length;
        const activeEmployees = employees.filter(e => e.status === 'active').length;
        const totalJobs = jobs.length;
        const runningJobs = jobs.filter(j => j.status === 'running').length;
        const completedJobs = jobs.filter(j => j.status === 'completed').length;
        const totalHours = jobs.reduce((acc, job) => acc + (job.elapsedSecs / 3600), 0);
        const avgJobTime = completedJobs > 0
            ? (jobs.filter(j => j.status === 'completed').reduce((acc, j) => acc + (j.elapsedSecs / 3600), 0) / completedJobs).toFixed(1)
            : 0;
        const overdueJobs = jobs.filter(j => j.dueDate && new Date(j.dueDate) < new Date() && j.status !== 'completed').length;

        // Department wise stats
        const deptStats = DEPARTMENTS.map(dept => {
            const deptJobs = jobs.filter(j => j.assignedTeam === dept);
            const deptEmployees = employees.filter(e => e.department === dept).length;
            return {
                department: dept,
                jobs: deptJobs.length,
                employees: deptEmployees,
                completed: deptJobs.filter(j => j.status === 'completed').length,
                hours: deptJobs.reduce((acc, j) => acc + (j.elapsedSecs / 3600), 0).toFixed(0)
            };
        });

        return {
            totalEmployees,
            activeEmployees,
            totalJobs,
            runningJobs,
            completedJobs,
            totalHours: Math.round(totalHours),
            avgJobTime,
            overdueJobs,
            completionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0,
            deptStats
        };
    }, [jobs, employees]);

    // Filter employees based on search and department
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.role.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
            return matchesSearch && matchesDept;
        });
    }, [employees, searchTerm, departmentFilter]);

    // Filter jobs
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.assignedTo?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
            const matchesDept = departmentFilter === 'all' || job.assignedTeam === departmentFilter;
            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [jobs, searchTerm, statusFilter, departmentFilter]);

    const handleViewEmployee = (employee) => {
        setSelectedEmployee(employee);
        setShowEmployeeModal(true);
    };

    const handleViewJob = (job) => {
        setSelectedJob(job);
        setShowJobModal(true);
    };

    const handleExportData = () => {
        // Implement export functionality
        const dataStr = JSON.stringify({ employees, jobs, stats }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `job-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-1">Monitor and manage all employee job activities</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="h-8 w-px bg-gray-200" />
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    A
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Admin User</p>
                                    <p className="text-xs text-gray-400">admin@company.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <StatsCard
                        title="Total Employees"
                        value={stats.totalEmployees}
                        icon={Users}
                        color="indigo"
                        subtext={`${stats.activeEmployees} active now`}
                    />
                    <StatsCard
                        title="Total Jobs"
                        value={stats.totalJobs}
                        icon={Briefcase}
                        color="green"
                        subtext={`${stats.runningJobs} running`}
                    />
                    <StatsCard
                        title="Total Hours"
                        value={`${stats.totalHours}h`}
                        icon={Clock}
                        color="blue"
                        subtext={`Avg ${stats.avgJobTime}h per job`}
                    />
                    <StatsCard
                        title="Completion Rate"
                        value={`${stats.completionRate}%`}
                        icon={Target}
                        color="purple"
                        subtext={`${stats.overdueJobs} overdue`}
                    />
                </div>

                {/* Department Stats */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {stats.deptStats.slice(0, 4).map(dept => (
                        <div key={dept.department} className="bg-white p-4 rounded-lg border border-gray-200">
                            <p className="text-sm font-medium text-gray-700">{dept.department}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div>
                                    <p className="text-xs text-gray-400">Employees</p>
                                    <p className="text-lg font-semibold">{dept.employees}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Jobs</p>
                                    <p className="text-lg font-semibold">{dept.jobs}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Hours</p>
                                    <p className="text-lg font-semibold">{dept.hours}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search employees or jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="all">All Departments</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="running">Running</option>
                            <option value="completed">Completed</option>
                            <option value="in-progress">In Progress</option>
                            <option value="on-hold">On Hold</option>
                        </select>

                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">This Year</option>
                        </select>

                        <button
                            onClick={handleExportData}
                            className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all"
                        >
                            <DownloadCloud className="w-4 h-4" />
                            Export Data
                        </button>

                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                                    }`}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-3 py-1.5 rounded-md text-sm transition-all ${viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-500'
                                    }`}
                            >
                                Table
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {viewMode === 'grid' ? (
                    // Employee Grid View
                    <div className="grid grid-cols-3 gap-4">
                        {filteredEmployees.map(emp => (
                            <EmployeeCard
                                key={emp.id}
                                employee={emp}
                                stats={{
                                    totalJobs: jobs.filter(j => j.assignedTo?.id === emp.id).length,
                                    totalHours: jobs.filter(j => j.assignedTo?.id === emp.id)
                                        .reduce((acc, j) => acc + (j.elapsedSecs / 3600), 0),
                                    efficiency: emp.efficiency
                                }}
                                onClick={handleViewEmployee}
                            />
                        ))}
                    </div>
                ) : (
                    // Jobs Table View
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredJobs.map(job => (
                                        <JobRow key={job.id} job={job} onViewDetails={handleViewJob} />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredJobs.length === 0 && (
                            <div className="text-center py-12">
                                <Briefcase className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No jobs found</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modals */}
                <EmployeeDetailModal
                    employee={selectedEmployee}
                    jobs={jobs}
                    isOpen={showEmployeeModal}
                    onClose={() => setShowEmployeeModal(false)}
                />

                <JobDetailModal
                    job={selectedJob}
                    isOpen={showJobModal}
                    onClose={() => setShowJobModal(false)}
                />
            </div>
        </div>
    );
}

export default AdminJobDashboard;