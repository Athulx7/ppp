import { ApiCall } from '../../library/constants';

const BASE = '/jobs'

export const fetchJobMasters = async (params = {}) => {
    const query = new URLSearchParams()
    if (params.departmentCode) query.set('department_code', params.departmentCode)
    if (params.jobTypeId) query.set('job_type_id', params.jobTypeId)
    const qs = query.toString()
    const res = await ApiCall('get', `${BASE}/masters${qs ? `?${qs}` : ''}`)
    return res?.data?.data || null
}

export const fetchCustomFields = async (jobTypeId) => {
    if (!jobTypeId) return []
    const res = await ApiCall('get', `${BASE}/custom-fields/${jobTypeId}`)
    return res?.data?.data || []
}

export const fetchJobList = async (filters = {}) => {
    const query = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
            query.set(key, value)
        }
    })
    const qs = query.toString()
    const res = await ApiCall('get', `${BASE}${qs ? `?${qs}` : ''}`)
    return {
        data: res?.data?.data || [],
        page: res?.data?.page || 1,
        pageSize: res?.data?.pageSize || 20,
    }
}

export const fetchJobById = async (jobId) => {
    const res = await ApiCall('get', `${BASE}/${jobId}`)
    return res?.data?.data || null
}

export const createJob = async (payload) => {
    const res = await ApiCall('post', `${BASE}`, payload)
    return res?.data
}

export const createSubJob = async (parentJobId, payload) => {
    const res = await ApiCall('post', `${BASE}/${parentJobId}/sub-job`, payload)
    return res?.data
}

export const updateJobStatus = async (jobId, payload) => {
    // payload: { new_status_id, remarks, changed_by_emp_code }
    const res = await ApiCall('post', `${BASE}/${jobId}/status`, payload)
    return res?.data
}

export const assignOrReferJob = async (jobId, payload) => {
    // payload: { action_type, to_emp_code, to_department_code, to_designation_code, remarks, action_by_emp_code }
    const res = await ApiCall('post', `${BASE}/${jobId}/assign`, payload)
    return res?.data
}

export const startJobTimer = async (jobId, payload) => {
    // payload: { emp_code }
    const res = await ApiCall('post', `${BASE}/${jobId}/run`, payload)
    return res?.data
}

export const stopJobTimer = async (jobId, payload) => {
    // payload: { emp_code, log_type: 'PAUSE' | 'STOP', remarks, new_status_id, refer_to_emp_code, refer_to_department_code }
    const res = await ApiCall('post', `${BASE}/${jobId}/stop`, payload)
    return res?.data
}

export const fetchLunchBreak = async (empCode) => {
    const res = await ApiCall('get', `/lunch-break?emp_code=${empCode}`)
    return res?.data?.data || null
}

export const saveLunchBreak = async (payload) => {
    // payload: { emp_code, is_enabled, start_time, end_time }
    const res = await ApiCall('post', '/lunch-break', payload)
    return res?.data
}

export const fetchEmployeeByCode = async (empCode) => {
    const res = await ApiCall('get', `/empmst/getemployee/${empCode}`)
    return res?.data?.data || null
}

export default {
    fetchJobMasters,
    fetchCustomFields,
    fetchJobList,
    fetchJobById,
    createJob,
    createSubJob,
    updateJobStatus,
    assignOrReferJob,
    startJobTimer,
    stopJobTimer,
    fetchLunchBreak,
    saveLunchBreak,
    fetchEmployeeByCode,
}