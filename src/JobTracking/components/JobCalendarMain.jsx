import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Calendar } from 'lucide-react'
import LoadingSpinner from '../../basicComponents/LoadingSpinner'
import { CalendarLegend, CalendarToolbar, DayDetailPanel, DayView, JobDetailPanel, MonthGrid, MonthlySummary, WeekView, HourDetailPanel } from './CalendarComponents'
import { MONTH_NAMES, WEEK_DAYS_FULL, toDateStr, getWeekDays, monthBounds } from './CalendarUtils'
import { fetchCalendarBlocks, fetchMonthActivity, fetchMonthSummary } from './CalendatApi'
import jobApi from './jobApi'

function JobCalendarMain({ loading, setLoading, currentUser }) {
    const [view, setView] = useState('month')
    const [calDate, setCalDate] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedDay, setSelectedDay] = useState(null)

    const todayStr = useMemo(() => toDateStr(new Date()), [])

    const [allBlocks, setAllBlocks] = useState([])
    const [jobsByDate, setJobsByDate] = useState({})
    const [detailModalDate, setDetailModalDate] = useState(null)

    useEffect(() => {
        const handleOpenDayDetail = (e) => setDetailModalDate(e.detail)
        window.addEventListener('open-day-detail', handleOpenDayDetail)
        return () => window.removeEventListener('open-day-detail', handleOpenDayDetail)
    }, [])
    const [monthSummary, setMonthSummary] = useState(null)
    const [lunchBreak, setLunchBreak] = useState(null)
    const [selectedBlock, setSelectedBlock] = useState(null)
    const [selectedHour, setSelectedHour] = useState(null)
    const [masters, setMasters] = useState(null)
    const [error, setError] = useState(null)

    const gridRef = useRef(null)

    const year = calDate.getFullYear()
    const month = calDate.getMonth() + 1

    const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate])

    const selectedDateStr = selectedDay ? `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}` : null

    const allJobs = useMemo(() => {
        const seen = new Set()
        const result = []
        Object.values(jobsByDate).flat().forEach((j) => {
            if (!seen.has(j.job_id)) { seen.add(j.job_id); result.push(j); }
        });
        return result
    }, [jobsByDate])

    const lunchBlock = useMemo(() => {
        if (!lunchBreak?.is_enabled || !lunchBreak.start_time || !lunchBreak.end_time) return null
        const [sh, sm] = lunchBreak.start_time.split(':').map(Number)
        const [eh, em] = lunchBreak.end_time.split(':').map(Number)
        return { startHour: sh + sm / 60, endHour: eh + em / 60 }
    }, [lunchBreak])

    const headerLabel = useMemo(() => {
        if (view === 'month') return `${MONTH_NAMES[month - 1]} ${year}`
        if (view === 'week') {
            const days = weekDays
            return `${MONTH_NAMES[days[0].getMonth()]} ${days[0].getDate()} – ${days[6].getDate()}, ${days[6].getFullYear()}`
        }
        return `${WEEK_DAYS_FULL[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    }, [view, year, month, weekDays, selectedDate])

    useEffect(() => {
        jobApi.fetchLunchBreak(currentUser.emp_code).then((data) => {
            if (data) setLunchBreak(data)
        }).catch(console.error)

        jobApi.fetchJobMasters().then((data) => {
            if (data) setMasters(data)
        }).catch(console.error)
    }, [])

    const loadMonthActivity = useCallback(async () => {
        setLoading({ normal: true, spinner: false })
        setError(null)
        try {
            const [activity, summary] = await Promise.all([
                fetchMonthActivity(currentUser.emp_code, year, month),
                fetchMonthSummary(currentUser.emp_code, year, month),
            ]);
            setJobsByDate(activity || {})
            setMonthSummary(summary)
        } catch (err) {
            console.error('Failed to load month activity', err)
            setError('Could not load calendar data. Please try again.')
        } finally {
            setLoading({ normal: false, spinner: false })
        }
    }, [year, month])

    useEffect(() => {
        loadMonthActivity()
    }, [loadMonthActivity])

    const loadBlocks = useCallback(async (from, to) => {
        setLoading({ normal: true, spinner: false })
        setError(null)
        try {
            const blocks = await fetchCalendarBlocks(currentUser.emp_code, from, to)
            setAllBlocks(blocks || [])
        } catch (err) {
            console.error('Failed to load calendar blocks', err)
            setError('Could not load time-log data. Please try again.')
        } finally {
            setLoading({ normal: false, spinner: false })
        }
    }, [])

    useEffect(() => {
        if (view === 'week') {
            const days = weekDays
            loadBlocks(toDateStr(days[0]), toDateStr(days[6]))
        } else if (view === 'day') {
            const ds = toDateStr(selectedDate)
            loadBlocks(ds, ds)
        }
    }, [view, weekDays, selectedDate, loadBlocks])

    useEffect(() => {
        if ((view === 'week' || view === 'day') && gridRef.current) {
            const hour = new Date().getHours()
            gridRef.current.scrollTop = Math.max(0, (hour - 1) * 56)
        }
    }, [view])

    const handlePrev = () => {
        if (view === 'month') {
            setCalDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
        } else if (view === 'week') {
            setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })
        } else {
            setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; })
        }
    }

    const handleNext = () => {
        if (view === 'month') {
            setCalDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
        } else if (view === 'week') {
            setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })
        } else {
            setSelectedDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; })
        }
    }

    const handleToday = () => {
        const t = new Date()
        setCalDate(t)
        setSelectedDate(t)
    }

    const handleViewChange = (v) => {
        setView(v)
        setSelectedBlock(null)
        setSelectedHour(null)
    }

    const handleWeekDayClick = (date) => {
        setSelectedDate(date)
        setView('day')
    }

    return (
        <>
            {error && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
                </div>
            )}

            <div className="flex gap-4 flex-col lg:flex-row">
                <div className="flex-1 min-w-0">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <CalendarToolbar
                            headerLabel={headerLabel}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            onToday={handleToday}
                            view={view}
                            onViewChange={handleViewChange}
                        />

                        {view === 'month' && (
                            <MonthGrid
                                year={year}
                                month={month}
                                todayStr={todayStr}
                                selectedDay={selectedDay}
                                onSelectDay={setSelectedDay}
                                jobsByDate={jobsByDate}
                                lunchEnabled={lunchBreak?.is_enabled}
                            />
                        )}

                        {view === 'week' && (
                            <div className="relative">
                                <WeekView
                                    weekDays={weekDays}
                                    todayStr={todayStr}
                                    allBlocks={allBlocks}
                                    lunchBlock={lunchBlock}
                                    onBlockClick={setSelectedBlock}
                                    onDayClick={handleWeekDayClick}
                                    gridRef={gridRef}
                                    onHourClick={setSelectedHour}
                                />
                                {selectedBlock && (
                                    <JobDetailPanel block={selectedBlock} onClose={() => setSelectedBlock(null)} />
                                )}
                            </div>
                        )}

                        {view === 'day' && (
                            <div className="relative">
                                <DayView
                                    date={selectedDate}
                                    todayStr={todayStr}
                                    allBlocks={allBlocks}
                                    lunchBlock={lunchBlock}
                                    onBlockClick={setSelectedBlock}
                                    gridRef={gridRef}
                                    jobsByDate={jobsByDate}
                                    onHourClick={setSelectedHour}
                                />
                                {selectedBlock && (
                                    <JobDetailPanel block={selectedBlock} onClose={() => setSelectedBlock(null)} />
                                )}
                            </div>
                        )}
                    </div>

                    <CalendarLegend priorities={masters?.priorities} />
                </div>

                <div className="lg:w-72 xl:w-80 space-y-4">
                    {view !== 'month' && selectedHour !== null ? (
                        <HourDetailPanel
                            selectedHour={selectedHour}
                            allBlocks={allBlocks}
                            selectedDateStr={toDateStr(selectedDate)}
                            view={view}
                            weekDays={weekDays}
                            onClose={() => setSelectedHour(null)}
                            onJobClick={(job) => {
                                setSelectedHour(null)
                                setSelectedBlock(job)
                            }}
                        />
                    ) : view === 'month' && selectedDay && selectedDateStr ? (
                        <DayDetailPanel
                            selectedDay={selectedDay}
                            selectedDateStr={selectedDateStr}
                            year={year}
                            month={month}
                            jobsByDate={jobsByDate}
                            onClose={() => setSelectedDay(null)}
                            onJobClick={setSelectedBlock}
                            lunchBreak={lunchBreak}
                        />
                    ) : view === 'month' ? (
                        <div className="bg-white rounded-xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-14 text-gray-400">
                            <Calendar className="w-10 h-10 mb-3 opacity-25" />
                            <p className="text-sm font-medium">Select a day</p>
                            <p className="text-xs mt-1 text-center px-4">Click any highlighted date to see jobs</p>
                        </div>
                    ) : null}

                    {selectedBlock && view !== 'month' && (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <h4 className="text-sm font-semibold text-gray-800">Selected Session</h4>
                                <button onClick={() => setSelectedBlock(null)} className="p-1.5 rounded-lg hover:bg-gray-200">
                                    <span className="text-gray-500 text-xs">✕</span>
                                </button>
                            </div>
                            <div className="p-3 space-y-2 text-xs">
                                <p className="font-mono font-bold text-indigo-600">{selectedBlock.job_code}</p>
                                <p className="font-semibold text-gray-800">{selectedBlock.title}</p>
                                <p className="text-gray-500">{selectedBlock.type_name}</p>
                                <div className="flex gap-2 pt-1">
                                    <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                                        <p className="text-[10px] text-gray-400">Time spent</p>
                                        <p className="font-bold text-green-600">{selectedBlock.duration_minutes ? `${selectedBlock.duration_minutes}m` : '—'}</p>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-2 rounded-lg">
                                        <p className="text-[10px] text-gray-400">Status</p>
                                        <p className="font-bold text-gray-700">{selectedBlock.status_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <MonthlySummary
                        month={month}
                        year={year}
                        summary={monthSummary}
                        jobsByDate={jobsByDate}
                        allJobs={allJobs}
                    />
                </div>
            </div>

            {loading.spinner && <LoadingSpinner />}
        </>
    )
}

export default JobCalendarMain