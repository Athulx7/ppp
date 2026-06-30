import { ApiCall } from '../../library/constants'

const BASE = '/jobs/calendar'

export const fetchCalendarBlocks = async (empCode, from, to) => {
    const res = await ApiCall('get', `${BASE}?emp_code=${empCode}&from=${from}&to=${to}`)
    return res?.data?.data || []
}

export const fetchMonthActivity = async (empCode, year, month) => {
    const res = await ApiCall('get', `${BASE}/month?emp_code=${empCode}&year=${year}&month=${month}`)
    return res?.data?.data || {}
}

export const fetchMonthSummary = async (empCode, year, month) => {
    const res = await ApiCall('get', `${BASE}/summary?emp_code=${empCode}&year=${year}&month=${month}`)
    return res?.data?.data || null
}