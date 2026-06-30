import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    AlertCircle, Briefcase, Clock, GitBranch, Info, List, SortDesc,
    User, Users, History as HistoryIcon,
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';
import CommonButton from '../../basicComponents/CommonButton';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import {
    StatusBadge, PriorityBadge, UserBadge, MetadataRow, ProgressBar, LiveTimer,
    formatDate, formatDuration, resolveEmployee, buildJobTree, flattenJobTree,
} from './commonFunc';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';
import jobApi from './jobApi';

function JobtrackingMain({ isLoading, setIsLoading, setShowCreateModal, showCreateModal, currentUser }) {

    const [jobs, setJobs] = useState([])
    const [masters, setMasters] = useState({
        jobTypes: [], statuses: [], priorities: [], departments: [],
        designations: [], employees: [], customFields: [],
    })
    const [loadError, setLoadError] = useState(null)

    const [showStopModal, setShowStopModal] = useState(false)
    const [showSubJobModal, setShowSubJobModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    const [createForm, setCreateForm] = useState({
        job_type_id: '', title: '', description: '', priority_id: '', status_id: '',
        assigned_department_code: '', assigned_designation_code: '', assigned_to_emp_code: '',
        due_date: '', estimated_minutes: '',
    })
    const [createCustomValues, setCreateCustomValues] = useState({})

    const [stopForm, setStopForm] = useState({
        new_status_id: '', remarks: '', refer_to_emp_code: '', refer_to_department_code: '', referType: 'user',
    })
    const [subJobForm, setSubJobForm] = useState({
        job_type_id: '', title: '', description: '', priority_id: '', estimated_minutes: '',
    })

    const [stopTargetId, setStopTargetId] = useState(null)
    const [subJobTargetId, setSubJobTargetId] = useState(null)
    const [selectedJobId, setSelectedJobId] = useState(null)
    const [selectedJobDetail, setSelectedJobDetail] = useState(null)

    const [filterStatus, setFilterStatus] = useState('all')
    const [searchQ, setSearchQ] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [filterAssignee, setFilterAssignee] = useState('all')

    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [isFetchingMore, setIsFetchingMore] = useState(false)

    const observer = useRef()
    const lastJobElementRef = useCallback((node) => {
        if (isLoading.normal || isFetchingMore) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPageNumber => prevPageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [isLoading.normal, isFetchingMore, hasMore])

    const [runningJobId, setRunningJobId] = useState(null)

    const loadMasters = useCallback(async () => {
        try {
            const data = await jobApi.fetchJobMasters()
            if (data) setMasters((prev) => ({ ...prev, ...data }))
        } catch (err) {
            console.error('Failed to load masters', err)
            setLoadError('Could not load job configuration. Please refresh.')
        }
    }, [])

    const loadJobs = useCallback(async (pageNumber = 1) => {
        if (pageNumber === 1) {
            setIsLoading((p) => ({ ...p, normal: true }))
        } else {
            setIsFetchingMore(true)
        }
        try {
            const pageSize = 2
            const filters = {
                page: pageNumber,
                pageSize,
                sortBy,
                sortOrder,
            }
            if (searchQ) filters.search = searchQ

            if (filterStatus !== 'all') {
                const sObj = masters.statuses.find(s => s.status_code === filterStatus)
                if (sObj) filters.status_id = sObj.id
            }

            if (filterAssignee !== 'all') {
                if (filterAssignee === 'unassigned') {
                    filters.assigned_to_emp_code = 'null'
                } else if (masters.departments.some(d => d.depart_code === filterAssignee)) {
                    filters.assigned_department_code = filterAssignee
                } else {
                    filters.assigned_to_emp_code = filterAssignee
                }
            } else if (!searchQ && filterAssignee === 'all') {
                filters.user_scope_emp_code = currentUser?.emp_code
            }

            const result = await jobApi.fetchJobList(filters)
            setJobs(prev => {
                if (pageNumber === 1) return result.data || []
                
                const existingIds = new Set(prev.map(j => j.job_id))
                const newJobs = (result.data || []).filter(j => !existingIds.has(j.job_id))
                return [...prev, ...newJobs]
            })
            setHasMore((result.data || []).length === pageSize)

            if (pageNumber === 1) {
                const runningJob = (result.data || []).find((j) => j.running_emp_code === currentUser?.emp_code || j.status_code === 'RUNNING')
                setRunningJobId(runningJob ? runningJob.job_id : null)
            }
        } catch (err) {
            console.error('Failed to load jobs', err)
            setLoadError('Could not load jobs. Please try again.')
        } finally {
            if (pageNumber === 1) {
                setIsLoading((p) => ({ ...p, normal: false }))
            } else {
                setIsFetchingMore(false)
            }
        }
    }, [setIsLoading, currentUser, searchQ, filterStatus, filterAssignee, sortBy, sortOrder, masters])

    useEffect(() => {
        loadMasters()
    }, [loadMasters])

    useEffect(() => {
        if (currentUser && masters.statuses && masters.statuses.length > 0) {
            loadJobs(page)
        }
    }, [loadJobs, currentUser, page, masters.statuses.length])

    useEffect(() => {
        setPage(1)
    }, [searchQ, filterStatus, filterAssignee, sortBy, sortOrder])

    const loadDeptScopedMasters = useCallback(async (departCode, target) => {
        if (!departCode) return
        try {
            const data = await jobApi.fetchJobMasters({ departmentCode: departCode })
            setMasters((prev) => ({
                ...prev,
                designations: data?.designations || [],
                employees: data?.employees || [],
            }))
        } catch (err) {
            console.error('Failed to load department masters', err)
        }
    }, [])

    const loadCustomFieldsForType = useCallback(async (jobTypeId, setValuesFn) => {
        if (!jobTypeId) {
            setMasters((prev) => ({ ...prev, customFields: [] }))
            setValuesFn({})
            return
        }
        try {
            const fields = await jobApi.fetchCustomFields(jobTypeId)
            setMasters((prev) => ({ ...prev, customFields: fields }))
            const initial = {}
            fields.forEach((f) => { initial[f.field_id] = f.field_type === 'checkbox' ? false : '' })
            setValuesFn(initial)
        } catch (err) {
            console.error('Failed to load custom fields', err)
        }
    }, [])

    const handleCreateFormChange = (field, value) => {
        setCreateForm((prev) => ({ ...prev, [field]: value }))
        if (field === 'job_type_id') loadCustomFieldsForType(value, setCreateCustomValues)
        if (field === 'assigned_department_code') {
            loadDeptScopedMasters(value)
            setCreateForm((prev) => ({ ...prev, assigned_designation_code: '', assigned_to_emp_code: '' }))
        }
    }

    const handleCreateJob = async () => {
        if (!createForm.title.trim() || !createForm.job_type_id || !createForm.priority_id) return

        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            const payload = {
                job_type_id: Number(createForm.job_type_id),
                title: createForm.title.trim(),
                description: createForm.description.trim(),
                priority_id: Number(createForm.priority_id),
                status_id: createForm.status_id ? Number(createForm.status_id) : undefined,
                assigned_department_code: createForm.assigned_department_code || null,
                assigned_designation_code: createForm.assigned_designation_code || null,
                assigned_to_emp_code: createForm.assigned_to_emp_code || null,
                due_date: createForm.due_date || null,
                created_by_emp_code: currentUser?.emp_code,
                custom_values: Object.entries(createCustomValues).map(([field_id, value]) => ({
                    field_id: Number(field_id),
                    field_value: typeof value === 'boolean' ? (value ? '1' : '0') : String(value ?? ''),
                })),
            }

            const res = await jobApi.createJob(payload)
            if (res?.success) {
                setCreateForm({
                    job_type_id: '', title: '', description: '', priority_id: '', status_id: '',
                    assigned_department_code: '', assigned_designation_code: '', assigned_to_emp_code: '',
                    due_date: '', estimated_minutes: '',
                })
                setCreateCustomValues({})
                setShowCreateModal(false)
                await loadJobs()
                
                showStatusToast(
                    {
                        type: "success",
                        title: "Success",
                        message: res.message || 'Job created successfully', 
                        autoClose: true,
                    }
                )
            } else {
                setLoadError(res?.message || 'Failed to create job')
                showStatusToast({
                    type: "error",
                    title: "Error",
                    message: res?.message || 'Failed to create job',
                    autoClose: true,
                })
            }
        } catch (err) {
            console.error('Create job failed', err)
            setLoadError('Failed to create job. Please try again.')
            showStatusToast({
                type: "error",
                title: "Error",
                message: 'Failed to create job. Please try again.',
                autoClose: true,
            })
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const handleRun = async (jobId) => {
        if (runningJobId && runningJobId !== jobId) return
        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            const runningStatus = masters.statuses.find((s) => s.status_code === 'RUNNING')
            await jobApi.startJobTimer(jobId, {
                emp_code: currentUser?.emp_code,
                running_status_id: runningStatus?.id,
            })
            setRunningJobId(jobId)
            await loadJobs()
            showStatusToast({
                type: "success",
                title: "Success",
                message: 'Timer started',
                autoClose: true,
            })
        } catch (err) {
            console.error('Failed to start timer', err)
            setLoadError('Failed to start job. Please try again.')
            showStatusToast({
                type: "error",
                title: "Error",
                message: 'Failed to start job. Please try again.',
                autoClose: true,
            })
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const openStopModal = (jobId) => {
        setStopTargetId(jobId)
        setStopForm({ new_status_id: '', remarks: '', refer_to_emp_code: '', refer_to_department_code: '', referType: 'user' })
        setShowStopModal(true)
    }

    const isReferStatus = useMemo(() => {
        const referStatus = masters.statuses.find((s) => s.status_code === 'REFERRED')
        return referStatus && String(stopForm.new_status_id) === String(referStatus.id)
    }, [stopForm.new_status_id, masters.statuses])

    const handleStop = async () => {
        if (!stopTargetId) return
        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            await jobApi.stopJobTimer(stopTargetId, {
                emp_code: currentUser?.emp_code,
                log_type: 'STOP',
                remarks: stopForm.remarks,
                new_status_id: stopForm.new_status_id ? Number(stopForm.new_status_id) : undefined,
                refer_to_emp_code: isReferStatus && stopForm.referType === 'user' ? stopForm.refer_to_emp_code : undefined,
                refer_to_department_code: isReferStatus && stopForm.referType === 'department' ? stopForm.refer_to_department_code : undefined,
            })
            setRunningJobId(null)
            setShowStopModal(false)
            setStopTargetId(null)
            await loadJobs()
            showStatusToast({
                type: "success",
                title: "Success",
                message: 'Timer stopped',
                autoClose: true,
            })
        } catch (err) {
            console.error('Failed to stop timer', err)
            setLoadError('Failed to stop job. Please try again.')
            showStatusToast({
                type: "error",
                title: "Error",
                message: 'Failed to stop job. Please try again.',
                autoClose: true,
            })
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const openSubJobModal = (parentId) => {
        setSubJobTargetId(parentId)
        setSubJobForm({ job_type_id: '', title: '', description: '', priority_id: '', estimated_minutes: '' })
        setShowSubJobModal(true)
    }

    const handleCreateSubJob = async () => {
        if (!subJobForm.title.trim() || !subJobTargetId) return
        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            const parentJob = jobs.find((j) => String(j.job_id) === String(subJobTargetId))
            const payload = {
                job_type_id: subJobForm.job_type_id ? Number(subJobForm.job_type_id) : Number(parentJob?.job_type_id),
                title: subJobForm.title.trim(),
                description: subJobForm.description.trim(),
                priority_id: subJobForm.priority_id ? Number(subJobForm.priority_id) : Number(parentJob?.priority_id),
                created_by_emp_code: currentUser?.emp_code,
                parent_job_id: subJobTargetId,
            }
            const res = await jobApi.createSubJob(subJobTargetId, payload)
            if (res?.success) {
                setSubJobForm({ job_type_id: '', title: '', description: '', priority_id: '', estimated_minutes: '' })
                setShowSubJobModal(false)
                setSubJobTargetId(null)
                await loadJobs()
                showStatusToast({
                    type: "success",
                    title: "Success",
                    message: res.message || 'Sub-job created successfully',
                    autoClose: true,
                })
            } else {
                setLoadError(res?.message || 'Failed to create sub-job')
                showStatusToast({
                    type: "error",
                    title: "Error",
                    message: res?.message || 'Failed to create sub-job',
                    autoClose: true,
                })
            }
        } catch (err) {
            console.error('Failed to create sub-job', err)
            setLoadError('Failed to create sub-job. Please try again.')
            showStatusToast({
                type: "error",
                title: "Error",
                message: 'Failed to create sub-job. Please try again.',
                autoClose: true,
            })
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const openJobDetails = async (jobId) => {
        setSelectedJobId(jobId)
        setShowDetailsModal(true)
        setIsLoading((p) => ({ ...p, spinner: true }))
        try {
            const detail = await jobApi.fetchJobById(jobId)
            setSelectedJobDetail(detail)
        } catch (err) {
            console.error('Failed to load job detail', err)
        } finally {
            setIsLoading((p) => ({ ...p, spinner: false }))
        }
    }

    const visibleJobs = useMemo(() => {
        const tree = buildJobTree(jobs)
        const flat = flattenJobTree(tree)
        // Frontend filtering is no longer needed as we pass filters to the backend API.
        return flat
    }, [jobs])

    const statCounts = useMemo(() => {
        const flat = flattenJobTree(buildJobTree(jobs))
        const userJobs = flat.filter(j =>
            j.created_by_emp_code === currentUser?.emp_code ||
            j.assigned_to_emp_code === currentUser?.emp_code ||
            j.running_emp_code === currentUser?.emp_code
        );

        const byCode = (code) => userJobs.filter((j) => j.status_code === code).length
        return {
            total: userJobs.length,
            running: userJobs.filter(j => j.running_emp_code === currentUser?.emp_code || j.status_code === 'RUNNING').length,
            completed: byCode('DONE') + byCode('CLOSED'),
            referred: byCode('REFERRED'),
        }
    }, [jobs, currentUser])

    const findStatusObj = (statusId) => masters.statuses.find((s) => s.id === statusId)
    const findPriorityObj = (priorityId) => masters.priorities.find((p) => p.priority_id === priorityId)

    return (
        <>
            {loadError && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {loadError}
                    <button onClick={() => setLoadError(null)} className="ml-auto text-rose-400 hover:text-rose-600">✕</button>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                    { label: 'Total Jobs', value: statCounts.total, color: 'indigo' },
                    { label: 'Running', value: statCounts.running, color: 'blue' },
                    { label: 'Completed', value: statCounts.completed, color: 'green' },
                    { label: 'Referred', value: statCounts.referred, color: 'orange' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-md border border-gray-200 shadow-sm p-4">
                        <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                        <p className={`text-2xl font-bold text-${stat.color}-600 mt-1`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text" placeholder="Search by title or job code..."
                    value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                    className="flex-1 min-w-[180px] px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <select
                    value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="createdAt">Sort: Date</option>
                    <option value="priority">Sort: Priority</option>
                    <option value="dueDate">Sort: Due Date</option>
                    <option value="title">Sort: Title</option>
                </select>
                <div className="flex gap-1 flex-wrap">
                    <button onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                        All
                    </button>
                    {masters.statuses.map((s) => (
                        <button key={s.id} onClick={() => setFilterStatus(s.status_code)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterStatus === s.status_code ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
                            {s.status_name}
                        </button>
                    ))}
                </div>
                <button onClick={() => setSortOrder((p) => (p === 'asc' ? 'desc' : 'asc'))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                    <SortDesc className="w-4 h-4" />
                </button>
            </div>

            {runningJobId && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-indigo-800">
                        Active Job: <span className="font-mono">{jobs.find((j) => j.job_id === runningJobId)?.job_code}</span>
                    </span>
                </div>
            )}

            {!isLoading.normal && visibleJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Briefcase className="w-12 h-12 mb-3 opacity-30" />
                    <p className="text-sm font-medium">No jobs found</p>
                    <p className="text-xs mt-1">Create a new job to get started</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {visibleJobs.map((job, index) => {
                        const statusObj = findStatusObj(job.status_id) || { status_code: job.status_code, status_name: job.status_name, color_code: job.status_color };
                        const priorityObj = findPriorityObj(job.priority_id) || { priority_name: job.priority_name, color_code: job.priority_color };
                        const isRunning = job.running_emp_code === currentUser?.emp_code || statusObj.status_code === 'RUNNING';
                        const canRun = !runningJobId || runningJobId === job.job_id;
                        const isSubJob = !!job.parent_job_id;
                        const isDone = statusObj.status_code === 'DONE' || statusObj.status_code === 'CLOSED';

                        return (
                            <div key={job.job_id}
                                ref={visibleJobs.length === index + 1 ? lastJobElementRef : null}
                                className={`bg-white rounded-lg border shadow-sm hover:shadow-md transition-all
                                    ${isRunning ? 'border-indigo-300 ring-1 ring-indigo-200' :
                                        isSubJob ? 'border-l-4 border-l-purple-400 border-gray-200' : 'border-gray-200'}`}>
                                <div className="flex items-center gap-4 px-4 py-3">
                                    <div className={`w-1 h-12 rounded-full flex-shrink-0`} style={{ backgroundColor: priorityObj.color_code || '#94A3B8' }} />
                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openJobDetails(job.job_id)}>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border
                                                ${isSubJob ? 'text-purple-600 bg-purple-50 border-purple-100' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                                                {job.job_code}
                                            </span>
                                            <PriorityBadge priority={priorityObj} />
                                            <StatusBadge status={statusObj} />
                                            {job.sub_job_count > 0 && (
                                                <span className="text-[10px] text-indigo-500 flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 rounded-full border border-indigo-100">
                                                    <GitBranch className="w-3 h-3" />{job.sub_job_count} sub-jobs
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{job.title}</h3>
                                            {job.assigned_to_emp_code && (
                                                <UserBadge empCode={job.assigned_to_emp_code} employees={masters.employees} />
                                            )}
                                        </div>
                                        <MetadataRow job={job} employees={masters.employees} className="mt-1" />
                                    </div>

                                    {isRunning && (
                                        <div className="text-right bg-indigo-50 px-3 py-1 rounded-md">
                                            <div className="text-xs text-indigo-400">Running</div>
                                            <LiveTimer startTime={job.running_start_time || job.time_summary?.running_start_time || job.start_date} small />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1">
                                        <button onClick={() => openJobDetails(job.job_id)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all" title="View details">
                                            <Info className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => openSubJobModal(job.job_id)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all" title="Add sub-job">
                                            <GitBranch className="w-4 h-4" />
                                        </button>
                                        {!isRunning && !isDone && (
                                            <button onClick={() => handleRun(job.job_id)} disabled={!canRun}
                                                className="flex items-center gap-1.5 px-3 py-1 text-sm text-white font-semibold border border-green-500 bg-green-500 rounded-md cursor-pointer hover:bg-green-600 transition-all">
                                                Run
                                            </button>
                                        )}
                                        {isRunning && (
                                            <button onClick={() => openStopModal(job.job_id)}
                                                className="flex items-center gap-1.5 px-3 py-1 text-sm text-white font-semibold border border-red-500 bg-red-500 rounded-md cursor-pointer hover:bg-red-600 transition-all">
                                                Stop
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {isFetchingMore && (
                        <div className="py-4 flex justify-center">
                            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            )}

            <CommonModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}
                title="Create New Job" size="3xl" animation="slide"
                customFooter={
                    <div className="flex justify-end gap-2">
                        <CommonButton label="Cancel" variant="outline" size="small" onClick={() => setShowCreateModal(false)} />
                        <CommonButton label="Create Job" variant="primary" size="small" onClick={handleCreateJob}
                            disabled={!createForm.title.trim() || !createForm.job_type_id || !createForm.priority_id} />
                    </div>
                }>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonInputField label="Job Title" required value={createForm.title}
                            onChange={(v) => handleCreateFormChange('title', v)} placeholder="e.g. Implement login API" />
                        <CommonDropDown label="Job Type" required value={createForm.job_type_id}
                            onChange={(v) => handleCreateFormChange('job_type_id', v)}
                            options={masters.jobTypes.map((t) => ({ label: t.type_name, value: t.job_type_id }))} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CommonDropDown label="Priority" required value={createForm.priority_id}
                            onChange={(v) => handleCreateFormChange('priority_id', v)}
                            options={masters.priorities.map((p) => ({ label: p.priority_name, value: p.priority_id }))} />
                        <CommonDropDown label="Status" value={createForm.status_id}
                            onChange={(v) => handleCreateFormChange('status_id', v)}
                            options={masters.statuses.map((s) => ({ label: s.status_name, value: s.id }))} />
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Due Date</label>
                            <input type="date" value={createForm.due_date}
                                onChange={(e) => handleCreateFormChange('due_date', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Assign To (optional)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CommonDropDown label="Department" value={createForm.assigned_department_code}
                                onChange={(v) => handleCreateFormChange('assigned_department_code', v)}
                                options={masters.departments.map((d) => ({ label: d.depart_name, value: d.depart_code }))} />
                            <CommonDropDown label="Designation" value={createForm.assigned_designation_code}
                                onChange={(v) => handleCreateFormChange('assigned_designation_code', v)}
                                options={masters.designations.map((d) => ({ label: d.desig_name, value: d.desig_code }))}
                                disabled={!createForm.assigned_department_code} />
                            <CommonDropDown label="Employee" value={createForm.assigned_to_emp_code}
                                onChange={(v) => handleCreateFormChange('assigned_to_emp_code', v)}
                                options={masters.employees.map((e) => ({ label: e.emp_name, value: e.emp_code }))}
                                disabled={!createForm.assigned_department_code} />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={createForm.description}
                            onChange={(e) => handleCreateFormChange('description', e.target.value)}
                            placeholder="Describe the job objective, requirements, and any important details..."
                            rows={4} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>

                    {masters.customFields.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {masters.customFields.map((field) => (
                                    <CustomFieldInput
                                        key={field.field_id}
                                        field={field}
                                        value={createCustomValues[field.field_id]}
                                        onChange={(val) => setCreateCustomValues((p) => ({ ...p, [field.field_id]: val }))}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </CommonModal>

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
                        <span>This will stop the timer for <strong className="font-mono">{jobs.find((j) => j.job_id === stopTargetId)?.job_code}</strong>. Please provide completion details below.</span>
                    </div>
                    <CommonDropDown label="Job Status" required value={stopForm.new_status_id}
                        onChange={(v) => setStopForm((p) => ({ ...p, new_status_id: v }))}
                        options={masters.statuses.filter((s) => s.status_code !== 'RUNNING').map((s) => ({ label: s.status_name, value: s.id }))} />

                    {isReferStatus && (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">Refer Type</label>
                                <div className="flex gap-4">
                                    {['user', 'department'].map((t) => (
                                        <label key={t} className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" value={t} checked={stopForm.referType === t}
                                                onChange={(e) => setStopForm((p) => ({ ...p, referType: e.target.value }))} className="text-indigo-600" />
                                            <span className="text-sm capitalize">{t === 'user' ? 'Employee' : 'Department'}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {stopForm.referType === 'user' ? (
                                <CommonDropDown label="Refer to Employee" value={stopForm.refer_to_emp_code}
                                    onChange={(v) => setStopForm((p) => ({ ...p, refer_to_emp_code: v }))}
                                    options={masters.employees.map((e) => ({ label: `${e.emp_name} (${e.depart_code})`, value: e.emp_code }))} />
                            ) : (
                                <CommonDropDown label="Refer to Department" value={stopForm.refer_to_department_code}
                                    onChange={(v) => setStopForm((p) => ({ ...p, refer_to_department_code: v }))}
                                    options={masters.departments.map((d) => ({ label: d.depart_name, value: d.depart_code }))} />
                            )}
                        </>
                    )}

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Notes / Remarks</label>
                        <textarea value={stopForm.remarks} onChange={(e) => setStopForm((p) => ({ ...p, remarks: e.target.value }))}
                            placeholder={isReferStatus ? 'Reason for referral and any context...' : 'Any additional notes...'}
                            rows={3} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                </div>
            </CommonModal>

            <CommonModal isOpen={showSubJobModal} onClose={() => setShowSubJobModal(false)}
                title={<span>Add Sub-Job under <span className="font-mono text-indigo-600 font-semibold">{jobs.find((j) => j.job_id === subJobTargetId)?.job_code}</span></span>}
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
                            The sub-job ID is generated automatically once saved.
                        </span>
                    </div>
                    <CommonInputField label="Sub-Job Title" required value={subJobForm.title}
                        onChange={(v) => setSubJobForm((p) => ({ ...p, title: v }))} placeholder="e.g. Write unit tests" />
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                        <textarea value={subJobForm.description} onChange={(e) => setSubJobForm((p) => ({ ...p, description: e.target.value }))}
                            placeholder="What does this sub-task involve?"
                            rows={2} className="w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                    </div>
                    <CommonDropDown label="Priority" value={subJobForm.priority_id}
                        onChange={(v) => setSubJobForm((p) => ({ ...p, priority_id: v }))}
                        options={masters.priorities.map((p) => ({ label: p.priority_name, value: p.priority_id }))} />
                    <p className="text-xs text-gray-500 flex items-start gap-1.5">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Sub-jobs inherit the parent's job type and assignment by default.
                    </p>
                </div>
            </CommonModal>

            {selectedJobDetail && (
                <CommonModal isOpen={showDetailsModal} onClose={() => { setShowDetailsModal(false); setSelectedJobDetail(null); }}
                    title={
                        <div className="flex items-center gap-2">
                            <span>Job Details: {selectedJobDetail.job_code}</span>
                            {selectedJobDetail.parent_job_id && (
                                <span className="text-xs font-normal text-purple-600 bg-purple-50 px-2 py-1 rounded-full border border-purple-200">
                                    Sub-job
                                </span>
                            )}
                        </div>
                    }
                    size="4xl" animation="slide">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-1">Title</h4>
                                <p className="text-base font-semibold">{selectedJobDetail.title}</p>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Status</h4>
                                    <StatusBadge status={{ status_code: selectedJobDetail.status_code, status_name: selectedJobDetail.status_name, color_code: selectedJobDetail.status_color }} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 mb-1">Priority</h4>
                                    <PriorityBadge priority={{ priority_name: selectedJobDetail.priority_name, color_code: selectedJobDetail.priority_color }} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Created By</h4>
                                <div className="flex items-center gap-2">
                                    <UserBadge empCode={selectedJobDetail.created_by_emp_code} employees={masters.employees} />
                                    <span className="text-xs text-gray-400">{formatDate(selectedJobDetail.created_date)}</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Assigned To</h4>
                                {selectedJobDetail.assigned_to_emp_code ? (
                                    <UserBadge empCode={selectedJobDetail.assigned_to_emp_code} employees={masters.employees} />
                                ) : selectedJobDetail.assigned_department_code ? (
                                    <span className="text-sm bg-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
                                        <Users className="w-4 h-4" />
                                        {masters.departments.find((d) => d.depart_code === selectedJobDetail.assigned_department_code)?.depart_name || selectedJobDetail.assigned_department_code}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-400">Unassigned</span>
                                )}
                            </div>
                        </div>

                        {selectedJobDetail.description && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Description</h4>
                                <p className="text-sm bg-gray-50 p-4 rounded-xl">{selectedJobDetail.description}</p>
                            </div>
                        )}

                        {selectedJobDetail.custom_fields?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-2">Additional Details</h4>
                                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl">
                                    {selectedJobDetail.custom_fields.map((f) => (
                                        <div key={f.field_id}>
                                            <p className="text-[10px] text-gray-400">{f.field_label}</p>
                                            <p className="text-sm text-gray-700">{f.field_value || '—'}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-3">Time Tracking</h4>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Time Spent', value: formatDuration(selectedJobDetail.time_summary?.total_minutes), color: 'text-green-600' },
                                    { label: 'Due Date', value: selectedJobDetail.due_date ? new Date(selectedJobDetail.due_date).toLocaleDateString() : 'N/A', color: 'text-gray-600' },
                                    { label: 'Started', value: selectedJobDetail.start_date ? formatDate(selectedJobDetail.start_date) : 'Not started', color: 'text-indigo-600' },
                                ].map((t) => (
                                    <div key={t.label} className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-xs text-gray-500">{t.label}</p>
                                        <p className={`text-lg font-bold ${t.color}`}>{t.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {selectedJobDetail.assignment_history?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1.5">
                                    <HistoryIcon className="w-4 h-4" />
                                    Assignment / Referral History
                                </h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedJobDetail.assignment_history.map((h) => (
                                        <div key={h.assignment_id} className="bg-gray-50 p-3 rounded-lg text-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-gray-700">{h.action_type}</span>
                                                <span className="text-gray-400">{formatDate(h.action_date)}</span>
                                            </div>
                                            <p className="text-gray-600">
                                                {resolveEmployee(h.from_emp_code, masters.employees)?.emp_name || h.from_department_code || 'Unassigned'}
                                                {' → '}
                                                {resolveEmployee(h.to_emp_code, masters.employees)?.emp_name || h.to_department_code || 'Unassigned'}
                                            </p>
                                            {h.remarks && <p className="text-gray-500 mt-1 italic">"{h.remarks}"</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedJobDetail.status_history?.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 mb-3">Status History</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {selectedJobDetail.status_history.map((h) => (
                                        <div key={h.history_id} className="bg-gray-50 p-3 rounded-lg text-xs flex items-center gap-3">
                                            <span className="text-gray-400">{formatDate(h.changed_date)}</span>
                                            <span className="text-gray-700">
                                                {h.old_status_name ? `${h.old_status_name} → ` : ''}{h.new_status_name}
                                            </span>
                                            {h.remarks && <span className="text-gray-500 italic">"{h.remarks}"</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </CommonModal>
            )}

            {isLoading.spinner && <LoadingSpinner />}
        </>
    );
}

function CustomFieldInput({ field, value, onChange }) {
    const commonClasses = "w-full px-3 py-2 rounded-lg text-sm border border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

    if (field.field_type === 'checkbox') {
        return (
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
                <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
                {field.field_label}
            </label>
        )
    }

    return (
        <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
                {field.field_label}{field.is_required && <span className="text-rose-500"> *</span>}
            </label>
            {field.field_type === 'textarea' ? (
                <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3} className={`${commonClasses} resize-none`} />
            ) : field.field_type === 'dropdown' ? (
                <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={commonClasses}>
                    <option value="">Select {field.field_label}</option>
                    {(field.field_options || []).map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            ) : (
                <input
                    type={field.field_type === 'number' ? 'number' : field.field_type === 'date' ? 'date' : 'text'}
                    value={value || ''} onChange={(e) => onChange(e.target.value)} className={commonClasses}
                />
            )}
        </div>
    )
}

export default JobtrackingMain