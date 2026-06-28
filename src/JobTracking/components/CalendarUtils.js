/**
 * calendarUtils.js
 * Pure utility functions for the Job Calendar — no React, no API calls.
 * Covers: date helpers, block overlap layout engine, color-from-DB mapping.
 */

// ─── Constants ─────────────────────────────────────────────────────────────

export const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
export const WEEK_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const WEEK_DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const HOURS = Array.from({ length: 24 }, (_, i) => i);
export const HOUR_HEIGHT = 56; // px per hour in the time grid
export const MIN_BLOCK_HEIGHT = 22; // minimum block px height

// ─── Date helpers ───────────────────────────────────────────────────────────

export const toDateStr = (date) => date.toISOString().slice(0, 10);

export const startOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
};

export const getWeekDays = (anchorDate) => {
    const start = startOfWeek(anchorDate);
    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
    });
};

/** Returns 'YYYY-MM-DD' for the first and last days of a given month. */
export const monthBounds = (year, month) => ({
    first: `${year}-${String(month).padStart(2, '0')}-01`,
    last: new Date(year, month, 0).toISOString().slice(0, 10), // day 0 = last of prev month
});

export const formatHour = (h) => {
    if (h === 0) return '12 AM';
    if (h < 12) return `${h} AM`;
    if (h === 12) return '12 PM';
    return `${h - 12} PM`;
};

export const formatDuration = (totalMinutes) => {
    const mins = Number(totalMinutes) || 0;
    if (mins === 0) return '0m';
    const h = Math.floor(mins / 60);
    const m = Math.floor(mins % 60);
    if (h > 0 && m > 0) return `${h}h ${m}m`;
    if (h > 0) return `${h}h`;
    return `${m}m`;
};

// ─── Density helpers ────────────────────────────────────────────────────────

export const getDensityBg = (count) => {
    if (count === 0) return 'hover:bg-gray-50';
    if (count <= 2) return 'bg-green-50 hover:bg-green-100';
    if (count <= 5) return 'bg-amber-50 hover:bg-amber-100';
    return 'bg-red-50 hover:bg-red-100';
};

export const getDensityLabel = (count) => {
    if (count === 0) return null;
    if (count <= 2) return { label: 'Low', bg: 'bg-green-100', text: 'text-green-700' };
    if (count <= 5) return { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700' };
    return { label: 'High', bg: 'bg-red-100', text: 'text-red-700' };
};

// ─── Hex → Tailwind color mapping ──────────────────────────────────────────
// Maps DB color_code values to Tailwind classes (same mapping as commonFunc.js).

const TAILWIND_PALETTE = [
    { hex: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', blockBg: 'bg-gray-400', blockText: 'text-white' },
    { hex: '#4F46E5', bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', blockBg: 'bg-indigo-500', blockText: 'text-white' },
    { hex: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', blockBg: 'bg-blue-500', blockText: 'text-white' },
    { hex: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', blockBg: 'bg-purple-500', blockText: 'text-white' },
    { hex: '#22C55E', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', blockBg: 'bg-green-500', blockText: 'text-white' },
    { hex: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', blockBg: 'bg-amber-400', blockText: 'text-white' },
    { hex: '#F97316', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', blockBg: 'bg-orange-500', blockText: 'text-white' },
    { hex: '#EF4444', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', blockBg: 'bg-red-500', blockText: 'text-white' },
];

const hexDist = (a, b) => {
    try {
        const p = (hex) => {
            const h = hex.replace('#', '');
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        };
        const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b);
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
    } catch { return Infinity; }
};

export const getColorClasses = (colorCode) => {
    if (!colorCode) return TAILWIND_PALETTE[0];
    const norm = colorCode.startsWith('#') ? colorCode : `#${colorCode}`;
    return TAILWIND_PALETTE.reduce((best, entry) => {
        const d = hexDist(norm, entry.hex);
        return d < hexDist(norm, best.hex) ? entry : best;
    }, TAILWIND_PALETTE[0]);
};

// ─── Block overlap layout engine ─────────────────────────────────────────────
/**
 * Given an array of { startHour, endHour, ...data } blocks for one day,
 * assigns each block a `col` and `totalCols` so overlapping blocks render
 * side-by-side without covering each other.
 */
export const computeOverlapLayout = (blocks) => {
    if (!blocks.length) return [];
    const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour);
    const result = sorted.map(b => ({ ...b, col: 0, totalCols: 1 }));

    const cols = []; // cols[c] = endHour of last block placed in column c
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

    // Compute totalCols for every block based on its overlap group
    for (let i = 0; i < result.length; i++) {
        let max = result[i].col;
        for (let j = 0; j < result.length; j++) {
            if (i !== j
                && result[i].startHour < result[j].endHour
                && result[i].endHour > result[j].startHour) {
                max = Math.max(max, result[j].col);
            }
        }
        result[i].totalCols = max + 1;
    }
    return result;
};

/**
 * Converts an array of raw tbl_job_time_log rows (from the API) into
 * positioned block objects ready for the time grid, filtered to a specific date.
 * Handles currently-running (end_time = null) rows by using NOW as end.
 */
export const buildDayBlocks = (allBlocks, dateStr) => {
    const raw = [];
    allBlocks.forEach((row) => {
        const startDate = row.start_time ? new Date(row.start_time) : null;
        if (!startDate) return;
        if (startDate.toISOString().slice(0, 10) !== dateStr) return;

        const endDate = row.end_time ? new Date(row.end_time) : new Date(); // running = now
        raw.push({
            ...row,
            startHour: startDate.getHours() + startDate.getMinutes() / 60,
            endHour: endDate.getHours() + endDate.getMinutes() / 60,
            isRunning: !row.end_time,
        });
    });
    return computeOverlapLayout(raw);
};