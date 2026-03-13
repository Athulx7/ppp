import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle2,
    ArrowRight, CircleDot, Coffee, X, RefreshCw, Eye,
    UserPlus, Archive, Flag, GitBranch
} from 'lucide-react';

const STATUS_CONFIG = {
    idle: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Idle', dot: 'bg-gray-400', blockBg: 'bg-gray-400', blockText: 'text-white' },
    running: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Running', dot: 'bg-indigo-500', blockBg: 'bg-indigo-500', blockText: 'text-white' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', dot: 'bg-green-500', blockBg: 'bg-green-500', blockText: 'text-white' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', dot: 'bg-blue-500', blockBg: 'bg-blue-500', blockText: 'text-white' },
    'on-hold': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'On Hold', dot: 'bg-amber-400', blockBg: 'bg-amber-400', blockText: 'text-white' },
    'in-review': { bg: 'bg-purple-100', text: 'text-purple-700', label: 'In Review', dot: 'bg-purple-500', blockBg: 'bg-purple-500', blockText: 'text-white' },
    refer: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Referred', dot: 'bg-orange-500', blockBg: 'bg-orange-500', blockText: 'text-white' },
    archived: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Archived', dot: 'bg-gray-300', blockBg: 'bg-gray-300', blockText: 'text-gray-700' },
};

const PRIORITY_CONFIG = {
    Low: { dot: 'bg-green-500' },
    Medium: { dot: 'bg-amber-500' },
    High: { dot: 'bg-orange-500' },
    Critical: { dot: 'bg-red-500' },
};

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const HOUR_HEIGHT = 56; // px per hour — taller for readability
const MIN_BLOCK_HEIGHT = 20; // min px

function formatDuration(secs) {
    if (!secs) return '0s';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function formatHour(h) {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
}

function getDensityColor(count) {
    if (count === 0) return 'bg-gray-100 hover:bg-gray-200';
    if (count <= 2) return 'bg-green-100 hover:bg-green-200 text-green-900';
    if (count <= 5) return 'bg-amber-100 hover:bg-amber-200 text-amber-900';
    return 'bg-red-100 hover:bg-red-200 text-red-900';
}

function getDensityLabel(count) {
    if (count === 0) return null;
    if (count <= 2) return { label: 'Low', bg: 'bg-green-100', text: 'text-green-700' };
    if (count <= 5) return { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700' };
    return { label: 'High', bg: 'bg-red-100', text: 'text-red-700' };
}

// ─── Overlap Layout Engine ────────────────────────────────────────────────────
// Groups overlapping blocks and assigns columns so they render side-by-side
function computeOverlapLayout(blocks) {
    if (!blocks.length) return [];

    // Sort by start
    const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour);
    const result = sorted.map(b => ({ ...b, col: 0, totalCols: 1 }));

    // Assign columns via greedy interval coloring
    const cols = []; // cols[i] = endHour of last block in column i
    for (let i = 0; i < result.length; i++) {
        let placed = false;
        for (let c = 0; c < cols.length; c++) {
            if (result[i].startHour >= cols[c]) {
                result[i].col = c;
                cols[c] = result[i].endHour;
                placed = true;
                break;
            }
        }
        if (!placed) {
            result[i].col = cols.length;
            cols.push(result[i].endHour);
        }
    }

    // Figure out totalCols for overlapping groups
    for (let i = 0; i < result.length; i++) {
        let max = result[i].col;
        for (let j = 0; j < result.length; j++) {
            if (i !== j &&
                result[i].startHour < result[j].endHour &&
                result[i].endHour > result[j].startHour) {
                max = Math.max(max, result[j].col);
            }
        }
        result[i].totalCols = max + 1;
    }

    return result;
}

// ─── Current Time Indicator ───────────────────────────────────────────────────
function CurrentTimeIndicator() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 30000);
        return () => clearInterval(t);
    }, []);
    const top = (now.getHours() + now.getMinutes() / 60) * HOUR_HEIGHT;
    return (
        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{ top }}>
            <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 -ml-1" />
                <div className="flex-1 h-px bg-red-400" />
            </div>
        </div>
    );
}

// ─── Job Block ────────────────────────────────────────────────────────────────
function JobBlock({ block, col, totalCols, containerWidth, onClick }) {
    const top = block.startHour * HOUR_HEIGHT;
    const rawHeight = (block.endHour - block.startHour) * HOUR_HEIGHT;
    const height = Math.max(rawHeight, MIN_BLOCK_HEIGHT);
    const durationMins = Math.round((block.endHour - block.startHour) * 60);
    const sCfg = STATUS_CONFIG[block.status] || STATUS_CONFIG.idle;

    const colW = containerWidth ? containerWidth / totalCols : undefined;
    const leftPct = totalCols > 1 ? `${(col / totalCols) * 100}%` : '0%';
    const widthPct = `${(1 / totalCols) * 100 - 0.5}%`;

    return (
        <div
            onClick={() => onClick && onClick(block)}
            className={`absolute rounded-md px-1.5 py-1 overflow-hidden cursor-pointer shadow-sm border border-white/30
                hover:brightness-110 hover:shadow-md transition-all group
                ${sCfg.blockBg} ${sCfg.blockText}`}
            style={{ top, height, left: leftPct, width: widthPct }}
            title={`${block.title} (${durationMins}m)`}
        >
            {/* Running pulse */}
            {block.status === 'running' && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            )}
            <div className="truncate text-[11px] font-semibold leading-tight">{block.title}</div>
            {height >= 32 && (
                <div className="text-[10px] opacity-80 truncate font-mono">{block.id}</div>
            )}
            {height >= 44 && durationMins > 0 && (
                <div className="text-[10px] opacity-75 flex items-center gap-0.5 mt-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {durationMins >= 60 ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m` : `${durationMins}m`}
                </div>
            )}
        </div>
    );
}

// ─── Time Grid Column ─────────────────────────────────────────────────────────
function TimeGridColumn({ dateStr, jobs, lunchBlock, isToday, onBlockClick }) {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const blocks = useMemo(() => {
        const raw = [];
        jobs.forEach(job => {
            (job.runLog || []).forEach(log => {
                if (log.start?.slice(0, 10) !== dateStr) return;
                const s = new Date(log.start);
                const e = new Date(log.end);
                raw.push({
                    id: job.id, title: job.title, status: job.status,
                    startHour: s.getHours() + s.getMinutes() / 60,
                    endHour: e.getHours() + e.getMinutes() / 60,
                    job,
                });
            });
            if (job.status === 'running' && job.startedAt) {
                const s = new Date(job.startedAt);
                if (s.toISOString().slice(0, 10) !== dateStr) return;
                const now = new Date();
                raw.push({
                    id: job.id, title: job.title, status: 'running',
                    startHour: s.getHours() + s.getMinutes() / 60,
                    endHour: now.getHours() + now.getMinutes() / 60,
                    job,
                });
            }
        });
        return computeOverlapLayout(raw);
    }, [jobs, dateStr]);

    return (
        <div ref={containerRef} className="relative flex-1 border-r border-gray-100 last:border-r-0">
            {/* Hour grid lines */}
            {HOURS.map(h => (
                <div key={h} className="border-b border-gray-100" style={{ height: HOUR_HEIGHT }} />
            ))}

            {/* Lunch block */}
            {lunchBlock && (
                <div
                    className="absolute left-0.5 right-0.5 bg-amber-100 border border-amber-200 rounded opacity-80 z-10"
                    style={{
                        top: lunchBlock.startHour * HOUR_HEIGHT,
                        height: (lunchBlock.endHour - lunchBlock.startHour) * HOUR_HEIGHT,
                    }}
                >
                    <div className="px-1 py-0.5 text-[10px] text-amber-700 font-medium flex items-center gap-0.5">
                        <Coffee className="w-2.5 h-2.5" />☕
                    </div>
                </div>
            )}

            {/* Current time */}
            {isToday && <CurrentTimeIndicator />}

            {/* Job blocks */}
            {blocks.map((b, i) => (
                <JobBlock
                    key={`${b.id}-${b.startHour}-${i}`}
                    block={b}
                    col={b.col}
                    totalCols={b.totalCols}
                    containerWidth={width}
                    onClick={onBlockClick}
                />
            ))}
        </div>
    );
}

// ─── Job Detail Side Panel ────────────────────────────────────────────────────
function JobDetailPanel({ job, onClose }) {
    if (!job) return null;
    const sCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.idle;
    const pDot = PRIORITY_CONFIG[job.priority]?.dot || 'bg-gray-400';

    return (
        <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-gray-200 shadow-xl z-30 flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                    <span className="font-mono text-xs font-bold text-indigo-600">{job.id}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-0.5">{job.title}</h3>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${sCfg.bg} ${sCfg.text}`}>
                        {sCfg.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs">
                        <span className={`w-2 h-2 rounded-full ${pDot}`} />
                        {job.priority}
                    </span>
                </div>

                {job.description && (
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{job.description}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-[10px] text-gray-400">Estimated</p>
                        <p className="text-sm font-bold text-indigo-600">{job.estTime ? `${job.estTime}m` : '—'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg">
                        <p className="text-[10px] text-gray-400">Actual</p>
                        <p className="text-sm font-bold text-green-600">
                            {job.elapsedSecs ? formatDuration(job.elapsedSecs) : '—'}
                        </p>
                    </div>
                </div>

                {job.assignedTo && (
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Assigned To</p>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-medium border border-indigo-200">
                                {job.assignedTo.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">{job.assignedTo.name}</p>
                                <p className="text-xs text-gray-400">{job.assignedTo.team}</p>
                            </div>
                        </div>
                    </div>
                )}

                {job.dueDate && (
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Due: {new Date(job.dueDate).toLocaleDateString()}</span>
                    </div>
                )}

                {job.runLog?.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-2">Activity Log</p>
                        <div className="space-y-1.5 max-h-40 overflow-y-auto">
                            {job.runLog.map((log, idx) => (
                                <div key={idx} className="bg-gray-50 px-2 py-1.5 rounded text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className={`px-1.5 py-0.5 rounded-full font-medium text-[10px] ${STATUS_CONFIG[log.status]?.bg} ${STATUS_CONFIG[log.status]?.text}`}>
                                            {STATUS_CONFIG[log.status]?.label || log.status}
                                        </span>
                                        <span className="font-mono text-gray-500">{formatDuration(log.duration)}</span>
                                    </div>
                                    {log.note && <p className="text-gray-500 mt-1 text-[10px]">{log.note}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {job.subJobs?.length > 0 && (
                    <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Sub-Jobs ({job.subJobs.length})</p>
                        <div className="space-y-1">
                            {job.subJobs.map(sub => (
                                <div key={sub.id} className="flex items-center gap-2 text-xs bg-gray-50 px-2 py-1.5 rounded">
                                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[sub.status]?.dot || 'bg-gray-400'}`} />
                                    <span className="font-mono text-purple-600">{sub.id}</span>
                                    <span className="text-gray-700 truncate flex-1">{sub.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {job.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {job.tags.map(t => (
                            <span key={t} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">#{t}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Main Calendar ────────────────────────────────────────────────────────────
function JobCalendar() {
    const [jobs, setJobs] = useState([]);
    const [lunchBreak, setLunchBreak] = useState({ enabled: false, start: '13:00', end: '14:00' });
    const [calDate, setCalDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [selectedBlockJob, setSelectedBlockJob] = useState(null);

    const todayStr = new Date().toISOString().slice(0, 10);

    const startOfWeek = (date) => {
        const d = new Date(date);
        d.setDate(d.getDate() - d.getDay());
        return d;
    };

    const getWeekDays = () => {
        const start = startOfWeek(selectedDate);
        return Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    };

    // Map date → jobs
    const jobsByDate = useMemo(() => {
        const map = {};
        jobs.forEach(job => {
            const dates = new Set();
            (job.runLog || []).forEach(log => { if (log.start?.slice(0, 10)) dates.add(log.start.slice(0, 10)); });
            if (job.status === 'running' && job.startedAt) dates.add(new Date(job.startedAt).toISOString().slice(0, 10));
            if (job.stoppedAt) dates.add(job.stoppedAt.slice(0, 10));
            dates.forEach(d => { if (!map[d]) map[d] = []; map[d].push(job); });
        });
        return map;
    }, [jobs]);

    const lunchBlock = useMemo(() => {
        if (!lunchBreak?.enabled || !lunchBreak.start || !lunchBreak.end) return null;
        const [sh, sm] = lunchBreak.start.split(':').map(Number);
        const [eh, em] = lunchBreak.end.split(':').map(Number);
        return { startHour: sh + sm / 60, endHour: eh + em / 60 };
    }, [lunchBreak]);

    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const selectedDateStr = selectedDay
        ? `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`
        : null;
    const selectedJobs = selectedDateStr ? (jobsByDate[selectedDateStr] || []) : [];

    const prevPeriod = () => {
        if (view === 'month') { setCalDate(new Date(year, month - 1, 1)); }
        else if (view === 'week') { const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d); }
        else { const d = new Date(selectedDate); d.setDate(d.getDate() - 1); setSelectedDate(d); }
    };
    const nextPeriod = () => {
        if (view === 'month') { setCalDate(new Date(year, month + 1, 1)); }
        else if (view === 'week') { const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d); }
        else { const d = new Date(selectedDate); d.setDate(d.getDate() + 1); setSelectedDate(d); }
    };
    const goToToday = () => { const t = new Date(); setCalDate(t); setSelectedDate(t); };

    const headerLabel = () => {
        if (view === 'month') return `${MONTH_NAMES[month]} ${year}`;
        if (view === 'week') {
            const days = getWeekDays();
            return `${MONTH_NAMES[days[0].getMonth()]} ${days[0].getDate()} – ${days[6].getDate()}, ${days[6].getFullYear()}`;
        }
        return `${WEEK_DAYS_FULL[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;
    };

    const handleBlockClick = (block) => {
        setSelectedBlockJob(block.job);
    };

    // Scroll to current hour on week/day view mount
    const gridRef = useRef(null);
    useEffect(() => {
        if ((view === 'week' || view === 'day') && gridRef.current) {
            const hour = new Date().getHours();
            gridRef.current.scrollTop = Math.max(0, (hour - 1) * HOUR_HEIGHT);
        }
    }, [view]);

    return (
        <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Job Calendar
                    </h2>
                    <p className="text-sm text-gray-500 mt-0.5">Visual overview of your job activity by day</p>
                </div>
            </div>

            <div className="flex gap-4 flex-col lg:flex-row">
                {/* Calendar area */}
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <button onClick={goToToday}
                                    className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                    Today
                                </button>
                                <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                                    <button onClick={prevPeriod} className="p-1.5 hover:bg-gray-50 border-r border-gray-300">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-1.5 text-sm font-semibold min-w-[180px] text-center text-gray-800">
                                        {headerLabel()}
                                    </span>
                                    <button onClick={nextPeriod} className="p-1.5 hover:bg-gray-50 border-l border-gray-300">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                                {['month', 'week', 'day'].map(v => (
                                    <button key={v} onClick={() => setView(v)}
                                        className={`px-4 py-1.5 text-xs font-medium capitalize transition-colors
                                            ${view === v ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50 text-gray-700'}`}>
                                        {v}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── Month View ── */}
                        {view === 'month' && (
                            <>
                                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                                    {WEEK_DAYS_SHORT.map(d => (
                                        <div key={d} className="py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7">
                                    {Array.from({ length: firstDay }).map((_, i) => (
                                        <div key={`e${i}`} className="h-20 border-b border-r border-gray-100 bg-gray-50" />
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const dayJobs = jobsByDate[dateStr] || [];
                                        const count = dayJobs.length;
                                        const isToday = dateStr === todayStr;
                                        const isSelected = selectedDay === day;

                                        return (
                                            <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                                                className={`h-20 border-b border-r border-gray-100 p-1.5 flex flex-col cursor-pointer transition-all relative
                                                    ${isSelected ? 'ring-2 ring-indigo-500 ring-inset z-10' : ''}
                                                    ${count > 0 ? getDensityColor(count) : 'hover:bg-gray-50'}
                                                `}>
                                                <span className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0
                                                    ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-700'}`}>
                                                    {day}
                                                </span>
                                                {count > 0 && (
                                                    <div className="mt-auto flex flex-wrap gap-0.5 items-center">
                                                        {dayJobs.slice(0, 4).map((j, idx) => (
                                                            <span key={idx}
                                                                title={`${j.id}: ${STATUS_CONFIG[j.status]?.label}`}
                                                                className={`inline-block w-2 h-2 rounded-full ${STATUS_CONFIG[j.status]?.dot || 'bg-gray-400'} ring-1 ring-white`} />
                                                        ))}
                                                        {count > 4 && <span className="text-[9px] font-bold opacity-80">+{count - 4}</span>}
                                                    </div>
                                                )}
                                                {lunchBreak?.enabled && count > 0 && (
                                                    <span className="absolute top-0.5 right-0.5 text-[9px]">☕</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {/* ── Week View ── */}
                        {view === 'week' && (
                            <div className="relative">
                                {/* Day headers */}
                                <div className="flex border-b border-gray-200 bg-gray-50">
                                    <div className="w-14 flex-shrink-0 border-r border-gray-200" />
                                    {getWeekDays().map((date, i) => {
                                        const ds = date.toISOString().slice(0, 10);
                                        const isToday = ds === todayStr;
                                        return (
                                            <div key={i}
                                                className={`flex-1 py-2 text-center text-xs font-semibold transition-colors cursor-pointer hover:bg-indigo-50
                                                    ${isToday ? 'text-indigo-700 bg-indigo-50' : 'text-gray-600'}`}
                                                onClick={() => { setSelectedDate(date); setView('day'); }}>
                                                <div className="uppercase tracking-wide">{WEEK_DAYS_SHORT[date.getDay()]}</div>
                                                <div className={`text-base font-bold mt-0.5 w-7 h-7 mx-auto flex items-center justify-center rounded-full
                                                    ${isToday ? 'bg-indigo-600 text-white' : 'text-gray-800'}`}>
                                                    {date.getDate()}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Scrollable time grid */}
                                <div ref={gridRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)', minHeight: 300 }}>
                                    <div className="flex">
                                        {/* Time labels */}
                                        <div className="w-14 flex-shrink-0 bg-gray-50 border-r border-gray-200">
                                            {HOURS.map(h => (
                                                <div key={h} className="flex items-start justify-end pr-2 text-[10px] text-gray-400 border-b border-gray-100"
                                                    style={{ height: HOUR_HEIGHT }}>
                                                    <span className="mt-0.5">{formatHour(h)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Day columns */}
                                        {getWeekDays().map((date, i) => {
                                            const ds = date.toISOString().slice(0, 10);
                                            const isToday = ds === todayStr;
                                            return (
                                                <TimeGridColumn
                                                    key={i}
                                                    dateStr={ds}
                                                    jobs={jobs}
                                                    lunchBlock={lunchBlock}
                                                    isToday={isToday}
                                                    onBlockClick={handleBlockClick}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Block detail overlay */}
                                {selectedBlockJob && (
                                    <JobDetailPanel job={selectedBlockJob} onClose={() => setSelectedBlockJob(null)} />
                                )}
                            </div>
                        )}

                        {/* ── Day View ── */}
                        {view === 'day' && (
                            <div className="relative">
                                {/* Day header */}
                                <div className="flex border-b border-gray-200 bg-gray-50 px-4 py-3">
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide">{WEEK_DAYS_FULL[selectedDate.getDay()]}</p>
                                        <p className={`text-2xl font-bold mt-0.5
                                            ${selectedDate.toISOString().slice(0, 10) === todayStr ? 'text-indigo-600' : 'text-gray-900'}`}>
                                            {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                                        </p>
                                        {(() => {
                                            const ds = selectedDate.toISOString().slice(0, 10);
                                            const count = (jobsByDate[ds] || []).length;
                                            return count > 0 ? (
                                                <p className="text-xs text-gray-500 mt-0.5">{count} job{count > 1 ? 's' : ''} tracked</p>
                                            ) : null;
                                        })()}
                                    </div>
                                </div>

                                {/* Scrollable day grid */}
                                <div ref={gridRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 380px)', minHeight: 300 }}>
                                    <div className="flex">
                                        {/* Time labels */}
                                        <div className="w-14 flex-shrink-0 bg-gray-50 border-r border-gray-200">
                                            {HOURS.map(h => (
                                                <div key={h} className="flex items-start justify-end pr-2 text-[10px] text-gray-400 border-b border-gray-100"
                                                    style={{ height: HOUR_HEIGHT }}>
                                                    <span className="mt-0.5">{formatHour(h)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Single day column */}
                                        <TimeGridColumn
                                            dateStr={selectedDate.toISOString().slice(0, 10)}
                                            jobs={jobs}
                                            lunchBlock={lunchBlock}
                                            isToday={selectedDate.toISOString().slice(0, 10) === todayStr}
                                            onBlockClick={handleBlockClick}
                                        />
                                    </div>
                                </div>

                                {/* Block detail overlay */}
                                {selectedBlockJob && (
                                    <JobDetailPanel job={selectedBlockJob} onClose={() => setSelectedBlockJob(null)} />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-semibold">Density:</span>
                            {[
                                { label: 'None', bg: 'bg-gray-200' }, { label: '1–2', bg: 'bg-green-300' },
                                { label: '3–5', bg: 'bg-amber-300' }, { label: '6+', bg: 'bg-red-400' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center gap-1">
                                    <div className={`w-3.5 h-3.5 rounded ${item.bg}`} />
                                    <span className="text-xs text-gray-600">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="w-px h-4 bg-gray-300" />
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-semibold">Status:</span>
                            {Object.entries(STATUS_CONFIG).slice(0, 6).map(([key, cfg]) => (
                                <div key={key} className="flex items-center gap-1">
                                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ring-1 ring-white`} />
                                    <span className="text-xs text-gray-600">{cfg.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                <div className="w-6 h-px bg-red-400 relative">
                                    <div className="absolute -left-0.5 -top-1 w-2 h-2 rounded-full bg-red-500" />
                                </div>
                                Now
                            </div>
                        </div>
                    </div>
                </div>

                {/* Side panel */}
                <div className="lg:w-72 xl:w-80">
                    {/* Day detail panel (month view) */}
                    {selectedDay && selectedDateStr ? (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-medium">{MONTH_NAMES[month]} {year}</p>
                                    <h3 className="text-base font-bold text-gray-900">Day {selectedDay}</h3>
                                </div>
                                <button onClick={() => setSelectedDay(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            {selectedJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <Calendar className="w-8 h-8 mb-2 opacity-30" />
                                    <p className="text-sm">No jobs on this day</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-2">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-gray-500">{selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} tracked</span>
                                        {(() => {
                                            const d = getDensityLabel(selectedJobs.length);
                                            return d ? <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${d.bg} ${d.text}`}>{d.label} Density</span> : null;
                                        })()}
                                    </div>
                                    {selectedJobs.map(job => {
                                        const sCfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.idle;
                                        const pDot = PRIORITY_CONFIG[job.priority]?.dot || 'bg-gray-400';
                                        return (
                                            <div key={job.id}
                                                className="p-3 rounded-lg border border-gray-200 hover:border-indigo-200 cursor-pointer transition-all"
                                                onClick={() => setSelectedBlockJob(job)}>
                                                <div className="flex items-start gap-2">
                                                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${pDot}`} />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                            <span className="font-mono text-xs font-bold text-indigo-600">{job.id}</span>
                                                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${sCfg.bg} ${sCfg.text}`}>{sCfg.label}</span>
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-800 truncate">{job.title}</p>
                                                        {job.elapsedSecs > 0 && (
                                                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />{formatDuration(job.elapsedSecs)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {lunchBreak?.enabled && (
                                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 mt-1">
                                            <Coffee className="w-3.5 h-3.5 text-amber-600" />
                                            <span className="text-xs text-amber-700">Lunch: {lunchBreak.start} – {lunchBreak.end}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-16 text-gray-400">
                            <Calendar className="w-10 h-10 mb-3 opacity-30" />
                            <p className="text-sm font-medium">Select a day</p>
                            <p className="text-xs mt-1 text-center px-4">Click any day on the calendar to see jobs tracked</p>
                        </div>
                    )}

                    {/* Monthly Summary */}
                    <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">{MONTH_NAMES[month]} Summary</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Active Days', value: Object.keys(jobsByDate).filter(d => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)).length, color: 'text-indigo-600' },
                                { label: 'Total Jobs', value: jobs.length, color: 'text-gray-800' },
                                { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: 'text-green-600' },
                                { label: 'In Progress', value: jobs.filter(j => j.status === 'in-progress').length, color: 'text-blue-600' },
                                { label: 'Referred', value: jobs.filter(j => j.status === 'refer').length, color: 'text-orange-600' },
                            ].map(s => (
                                <div key={s.label} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{s.label}</span>
                                    <span className={`font-bold ${s.color}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Block detail panel (week/day view) */}
                    {selectedBlockJob && view !== 'month' && (
                        <div className="mt-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-800">Selected Job</h4>
                                <button onClick={() => setSelectedBlockJob(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-3 space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                        {selectedBlockJob.id}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[selectedBlockJob.status]?.bg} ${STATUS_CONFIG[selectedBlockJob.status]?.text}`}>
                                        {STATUS_CONFIG[selectedBlockJob.status]?.label}
                                    </span>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">{selectedBlockJob.title}</p>
                                {selectedBlockJob.description && (
                                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">{selectedBlockJob.description}</p>
                                )}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-gray-400">Est.</p>
                                        <p className="font-bold text-indigo-600">{selectedBlockJob.estTime ? `${selectedBlockJob.estTime}m` : '—'}</p>
                                    </div>
                                    <div className="bg-gray-50 p-2 rounded">
                                        <p className="text-gray-400">Actual</p>
                                        <p className="font-bold text-green-600">
                                            {selectedBlockJob.elapsedSecs ? formatDuration(selectedBlockJob.elapsedSecs) : '—'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobCalendar;
