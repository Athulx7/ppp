import { ApiCall } from '../../library/constants';

const BASE = '/jobs/calendar';

/**
 * Fetch time-log blocks for the week/day time grid.
 * from/to: 'YYYY-MM-DD'
 */
export const fetchCalendarBlocks = async (empCode, from, to) => {
    const res = await ApiCall('get', `${BASE}?emp_code=${empCode}&from=${from}&to=${to}`);
    return res?.data?.data || [];
};

/**
 * Fetch month-grid dots data.
 * Returns { "2026-06-15": [job, ...], ... }
 */
export const fetchMonthActivity = async (empCode, year, month) => {
    const res = await ApiCall('get', `${BASE}/month?emp_code=${empCode}&year=${year}&month=${month}`);
    return res?.data?.data || {};
};

/**
 * Fetch sidebar summary stats for a month.
 */
export const fetchMonthSummary = async (empCode, year, month) => {
    const res = await ApiCall('get', `${BASE}/summary?emp_code=${empCode}&year=${year}&month=${month}`);
    return res?.data?.data || null;
};