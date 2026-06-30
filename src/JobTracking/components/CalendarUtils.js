export const MONTH_NAMES = [ 'January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December']
export const WEEK_DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const WEEK_DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const HOURS = Array.from({ length: 24 }, (_, i) => i)
export const HOUR_HEIGHT = 56 
export const MIN_BLOCK_HEIGHT = 22 

export const toDateStr = (date) => date.toISOString().slice(0, 10)

export const startOfWeek = (date) => {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay())
    return d
}

export const getWeekDays = (anchorDate) => {
    const start = startOfWeek(anchorDate)
    return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(start)
        d.setDate(start.getDate() + i)
        return d
    })
}

export const monthBounds = (year, month) => ({
    first: `${year}-${String(month).padStart(2, '0')}-01`,
    last: new Date(year, month, 0).toISOString().slice(0, 10),
})

export const formatHour = (h) => {
    if (h === 0) return '12 AM'
    if (h < 12) return `${h} AM`
    if (h === 12) return '12 PM'
    return `${h - 12} PM`
}

export const formatDuration = (totalMinutes) => {
    const mins = Number(totalMinutes) || 0
    if (mins === 0) return '0m'
    const h = Math.floor(mins / 60)
    const m = Math.floor(mins % 60)
    if (h > 0 && m > 0) return `${h}h ${m}m`
    if (h > 0) return `${h}h`
    return `${m}m`
}

export const getDensityBg = (count) => {
    if (count === 0) return 'hover:bg-gray-50'
    if (count <= 2) return 'bg-green-50 hover:bg-green-100'
    if (count <= 5) return 'bg-amber-50 hover:bg-amber-100'
    return 'bg-red-50 hover:bg-red-100'
}

export const getDensityLabel = (count) => {
    if (count === 0) return null
    if (count <= 2) return { label: 'Low', bg: 'bg-green-100', text: 'text-green-700' }
    if (count <= 5) return { label: 'Medium', bg: 'bg-amber-100', text: 'text-amber-700' }
    return { label: 'High', bg: 'bg-red-100', text: 'text-red-700' }
}

const TAILWIND_PALETTE = [
    { hex: '#6B7280', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', blockBg: 'bg-gray-400', blockText: 'text-white' },
    { hex: '#4F46E5', bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', blockBg: 'bg-indigo-500', blockText: 'text-white' },
    { hex: '#3B82F6', bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', blockBg: 'bg-blue-500', blockText: 'text-white' },
    { hex: '#8B5CF6', bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', blockBg: 'bg-purple-500', blockText: 'text-white' },
    { hex: '#22C55E', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', blockBg: 'bg-green-500', blockText: 'text-white' },
    { hex: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', blockBg: 'bg-amber-400', blockText: 'text-white' },
    { hex: '#F97316', bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', blockBg: 'bg-orange-500', blockText: 'text-white' },
    { hex: '#EF4444', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', blockBg: 'bg-red-500', blockText: 'text-white' },
]

const hexDist = (a, b) => {
    try {
        const p = (hex) => {
            const h = hex.replace('#', '')
            return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
        }
        const [r1, g1, b1] = p(a), [r2, g2, b2] = p(b)
        return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
    } catch { return Infinity }
}

export const getColorClasses = (colorCode) => {
    if (!colorCode) return TAILWIND_PALETTE[0]
    const norm = colorCode.startsWith('#') ? colorCode : `#${colorCode}`
    return TAILWIND_PALETTE.reduce((best, entry) => {
        const d = hexDist(norm, entry.hex)
        return d < hexDist(norm, best.hex) ? entry : best
    }, TAILWIND_PALETTE[0])
}

export const clusterOverlappingBlocks = (blocks) => {
    if (!blocks || blocks.length === 0) return []

    const sorted = [...blocks].sort((a, b) => a.startHour - b.startHour)
    
    const clusters = []
    let currentCluster = {
        isCluster: true,
        startHour: sorted[0].startHour,
        endHour: sorted[0].endHour,
        jobs: [sorted[0]],
        col: 0,
        totalCols: 1,
        id: `cluster-${0}`
    }

    for (let i = 1; i < sorted.length; i++) {
        const block = sorted[i]
        if (block.startHour < currentCluster.endHour) {
            currentCluster.jobs.push(block)
            currentCluster.endHour = Math.max(currentCluster.endHour, block.endHour)
        } else {
            clusters.push(currentCluster)
            currentCluster = {
                isCluster: true,
                startHour: block.startHour,
                endHour: block.endHour,
                jobs: [block],
                col: 0,
                totalCols: 1,
                id: `cluster-${i}`
            }
        }
    }
    clusters.push(currentCluster)

    return clusters.map(c => {
        if (c.jobs.length === 1) {
            return { ...c.jobs[0], col: 0, totalCols: 1 }
        }
        return c
    })
}

export const buildDayBlocks = (allBlocks, dateStr) => {
    const raw = []
    allBlocks.forEach((row) => {
        const startDate = row.start_time ? new Date(row.start_time) : null
        if (!startDate) return
        if (startDate.toISOString().slice(0, 10) !== dateStr) return

        const endDate = row.end_time ? new Date(row.end_time) : new Date()
        raw.push({
            ...row,
            startHour: startDate.getHours() + startDate.getMinutes() / 60,
            endHour: endDate.getHours() + endDate.getMinutes() / 60,
            isRunning: !row.end_time,
        })
    })
    return clusterOverlappingBlocks(raw)
}