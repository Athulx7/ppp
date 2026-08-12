import { useEffect, useState } from 'react';
import { ApiCall } from '../../library/constants';
import { showStatusToast } from '../../basicComponents/CommonStatusPopUp';

export function calculateLeaveDays(from, to, halfDay = false) {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    let days = 0;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) days++;
    }
    return halfDay ? Math.max(0.5, days - 0.5) : days;
}

export function parseHHMM(str) {
    if (!str) return 0;
    const [h, m] = str.split(':').map(Number);
    return h * 60 + (m || 0);
}

export function minutesToHHMM(mins) {
    if (mins <= 0) return '0h 0m';
    const h = Math.floor(Math.abs(mins) / 60);
    const m = Math.abs(mins) % 60;
    return `${h}h ${m}m`;
}

export const STANDARD_WORK_MINS = 8 * 60;
export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const TEAM_MEMBERS = [
    { id: 'emp1', name: 'John Smith', role: 'Developer' },
    { id: 'emp2', name: 'Sarah Johnson', role: 'Designer' },
    { id: 'emp3', name: 'Mike Chen', role: 'QA' },
];

export function useCalendarState() {
    const userRole = localStorage.getItem('userRole') || 'employee';
    const isManager = ['admin', 'hr', 'payroll_manager', 'manager'].includes(userRole);

    const [currentDate, setCurrent] = useState(new Date());
    const [selectedDate, setSelected] = useState(new Date());
    const [view, setView] = useState('month');

    const [modal, setModal] = useState(null);
    const openModal = (name) => setModal(name);
    const closeModal = () => setModal(null);

    const [workSchedule, setWorkSchedule] = useState(null);
    const [holidays, setHolidays] = useState([]);
    const [leaveBalance, setLeaveBalance] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [regRequests, setRegRequests] = useState([]);
    const [reminders, setReminders] = useState([]);

    const [leaveForm, setLeaveForm] = useState({
        leave_type: '', from_date: '', to_date: '',
        half_day: false, half_day_type: 'first_half',
        reason: '', contact_number: '', address: '',
        handover_notes: '', urgent: false,
    });

    const [regForm, setRegForm] = useState({ date: '', punch_in: '', punch_out: '', reason: '' });

    const [reminderForm, setReminderForm] = useState({
        title: '', time: '09:00', type: 'personal', priority: 'medium', note: '', forUserId: null,
    });

    const [detailDate, setDetailDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        fetchInitialData();
    }, []);

    async function fetchInitialData() {
        try {
            const schedRes = await ApiCall('GET', '/leaverequest/userWorkSchedule');
            if (schedRes?.data?.data) {
                setWorkSchedule(schedRes.data.data);
            }

            const holidayRes = await ApiCall('GET', '/leaverequest/holidays');
            if (holidayRes?.data?.data) {
                setHolidays(Array.isArray(holidayRes.data.data) ? holidayRes.data.data : []);
            }

            const balanceRes = await ApiCall('GET', '/myleaves/getAllMyLeaves');
            const resData = balanceRes?.data?.data?.data || balanceRes?.data?.data || balanceRes?.data || {};
            const rawBalance = resData.leaveBalance || resData.leave_balance || resData.balances || (Array.isArray(resData) ? resData : []);
            if (Array.isArray(rawBalance)) {
                const formattedBalance = rawBalance.map(item => ({
                    id: item.id,
                    leave_type_id: item.leave_type_id,
                    leave_code: item.LeaveTypeCode || item.leave_code || '',
                    leave_name: item.LeaveTypeName || item.leave_name || '',
                    total: Number(item.allocated_days ?? item.total ?? 0),
                    used: Number(item.used_days ?? item.used ?? 0),
                    pending: Number(item.pending_days ?? item.pending ?? 0),
                    available: Number(item.available_days ?? item.available ?? 0),
                    carry_forward: Number(item.carry_forward_days ?? item.carry_forward ?? 0)
                }));
                setLeaveBalance(formattedBalance);
            }

            const reqRes = await ApiCall('GET', '/leaverequest/myRequests');
            if (Array.isArray(reqRes?.data?.data)) {
                setLeaveRequests(reqRes.data.data);
            }

            const attRes = await ApiCall('GET', '/attendance/myAttendance');
            if (Array.isArray(attRes?.data?.data)) {
                setAttendance(attRes.data.data);
            }

            const regRes = await ApiCall('GET', '/attendance/myRegularizations');
            if (Array.isArray(regRes?.data?.data)) {
                setRegRequests(regRes.data.data);
            }
        } catch (err) {
            console.error('Error fetching calendar data:', err);
        }
    }

    const getDaysInMonth = () => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const prevMonth = () => {
        if (view === 'week') {
            const prevW = new Date(currentDate);
            prevW.setDate(prevW.getDate() - 7);
            setCurrent(prevW);
            setSelected(prevW);
        } else {
            setCurrent(new Date(year, month - 1, 1));
        }
    };

    const nextMonth = () => {
        if (view === 'week') {
            const nextW = new Date(currentDate);
            nextW.setDate(nextW.getDate() + 7);
            setCurrent(nextW);
            setSelected(nextW);
        } else {
            setCurrent(new Date(year, month + 1, 1));
        }
    };

    const goToToday = () => { const t = new Date(); setCurrent(t); setSelected(t); };

    const formatDateLocal = (y, m, d) => {
        const monthStr = String(m + 1).padStart(2, '0');
        const dayStr = String(d).padStart(2, '0');
        return `${y}-${monthStr}-${dayStr}`;
    };

    const dateStr = (d) => formatDateLocal(year, month, d);

    const activeWorkWeek = workSchedule?.work_week && Array.isArray(workSchedule.work_week)
        ? workSchedule.work_week.map(w => String(w).toLowerCase())
        : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

    const standardWorkMins = workSchedule?.working_hours_per_day
        ? Math.round(Number(workSchedule.working_hours_per_day) * 60)
        : STANDARD_WORK_MINS;

    const isOvertimeApplicable = workSchedule
        ? (Number(workSchedule.overtime_applicable) === 1 || workSchedule.overtime_applicable === true || workSchedule.overtime_applicable === '1')
        : true;

    const getEvents = (ds) => {
        const events = [];

        (holidays || []).filter(e => e.holiday_date === ds).forEach(e => {
            events.push({ title: e.holiday_name, name: e.holiday_name, type: 'holiday', category: 'Holiday', color: 'bg-amber-100 text-amber-800' });
        });

        (leaveRequests || []).filter(l => l.status !== 'rejected' && l.status !== 'cancelled' && ds >= l.from_date && ds <= l.to_date).forEach(l => {
            events.push({ title: l.leave_name || l.leave_type, name: l.leave_name || l.leave_type, type: 'leave', category: 'My Leave', color: 'bg-indigo-100 text-indigo-800', status: l.status });
        });

        (attendance || []).filter(a => a.date === ds || a.attendance_date === ds).forEach(a => {
            const pIn = a.punch_in_time || a.punch_in || '--';
            const pOut = a.punch_out_time || a.punch_out || '--';
            events.push({ title: `Punch: ${pIn} - ${pOut}`, category: 'Attendance', status: a.status, color: 'bg-emerald-100 text-emerald-800' });
        });

        (regRequests || []).filter(r => r.date === ds || r.attendance_date === ds).forEach(r => {
            events.push({ title: `Regularize (${r.punch_in || ''} - ${r.punch_out || ''})`, category: 'Regularization', status: r.status, color: 'bg-blue-100 text-blue-800' });
        });

        (reminders || []).filter(r => r.status === 'pending' && r.date === ds).forEach(r => {
            events.push({ ...r, category: 'Reminder', color: 'bg-yellow-100 text-yellow-800' });
        });

        return events
    }

    const getExtra = (ds) => {
        if (!isOvertimeApplicable) return 0;
        const rec = (attendance || []).find(a => (a.date === ds || a.attendance_date === ds));
        const punchIn = rec?.punch_in_time || rec?.punch_in;
        const punchOut = rec?.punch_out_time || rec?.punch_out;
        if (!rec || !punchIn || !punchOut) return 0;
        const worked = parseHHMM(punchOut) - parseHHMM(punchIn);
        return worked - standardWorkMins;
    };

    const today = new Date(); today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today); nextWeek.setDate(today.getDate() + 14);

    const upcomingReminders = reminders
        .filter(r => r.status === 'pending' && new Date(r.date) >= today && new Date(r.date) <= nextWeek)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const upcomingEvents = (holidays || [])
        .map(e => ({ title: e.holiday_name, date: e.holiday_date, category: 'Holiday', color: 'bg-amber-100 text-amber-800' }))
        .filter(e => { const d = new Date(e.date); return d >= today && d <= nextWeek; })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    const overtimeCarryForward = workSchedule
        ? (Number(workSchedule.overtime_carry_forward) === 1 || workSchedule.overtime_carry_forward === true || workSchedule.overtime_carry_forward === '1')
        : false;

    const maxCarryMinsPerDay = workSchedule?.overtime_carry_forward_max_mins !== undefined
        ? Number(workSchedule.overtime_carry_forward_max_mins)
        : 30;

    const carryForwardScope = workSchedule?.overtime_carry_forward_scope || 'weekly';

    const totalExtraMins = (attendance || []).reduce((sum, a) => {
        const extra = getExtra(a.date || a.attendance_date);
        return sum + (extra > 0 ? extra : 0);
    }, 0);

    const totalDeficitMins = (attendance || []).reduce((sum, a) => {
        const extra = getExtra(a.date || a.attendance_date);
        return sum + (extra < 0 ? Math.abs(extra) : 0);
    }, 0);

    const totalCarryForwardMins = (attendance || []).reduce((sum, a) => {
        if (!overtimeCarryForward) return 0;
        const ds = a.date || a.attendance_date;
        if (carryForwardScope === 'weekly') {
            const curr = new Date(selectedDate);
            const first = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() - curr.getDay());
            const last = new Date(first); last.setDate(first.getDate() + 6);
            const firstDs = formatDateLocal(first.getFullYear(), first.getMonth(), first.getDate());
            const lastDs = formatDateLocal(last.getFullYear(), last.getMonth(), last.getDate());
            if (ds < firstDs || ds > lastDs) return sum; // Weekly reset: no carry forward to next week!
        }
        const extra = getExtra(ds);
        const cappedExtra = extra > 0 ? Math.min(extra, maxCarryMinsPerDay) : 0;
        return sum + cappedExtra;
    }, 0);

    const handleLeaveSubmit = async () => {
        if (!leaveForm.leave_type || !leaveForm.from_date || !leaveForm.to_date || !leaveForm.reason.trim()) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'Please fill all required fields' });
            return;
        }

        const selectedLeaveType = leaveBalance.find(l => l.leave_code === leaveForm.leave_type);
        if (!selectedLeaveType) {
            showStatusToast({ type: 'warning', title: 'Invalid Selection', message: 'Selected leave type is invalid or not allocated' });
            return;
        }

        const days = calculateLeaveDays(leaveForm.from_date, leaveForm.to_date, leaveForm.half_day);
        if (days <= 0) {
            showStatusToast({ type: 'warning', title: 'Invalid Date Range', message: 'The selected date range contains no working days' });
            return;
        }

        if (selectedLeaveType.available !== undefined && selectedLeaveType.available < days) {
            showStatusToast({
                type: 'warning',
                title: 'Insufficient Leave Balance',
                message: `You have ${selectedLeaveType.available} days available for ${selectedLeaveType.leave_name}, but requested ${days} days.`
            });
            return;
        }

        let conflictDate = null;
        for (let d = new Date(leaveForm.from_date); d <= new Date(leaveForm.to_date); d.setDate(d.getDate() + 1)) {
            const dStr = formatDateLocal(d.getFullYear(), d.getMonth(), d.getDate());
            const att = (attendance || []).find(a => (a.date === dStr || a.attendance_date === dStr));
            if (att && (att.punch_in_time || att.punch_in) && (att.punch_out_time || att.punch_out)) {
                conflictDate = dStr;
                break;
            }
        }
        if (conflictDate) {
            showStatusToast({
                type: 'warning',
                title: 'Validation Warning',
                message: `Attendance punch in & out already exists for ${conflictDate}. You cannot apply leave for days already worked.`
            });
            return;
        }

        try {
            const payload = {
                leave_type_id: selectedLeaveType.leave_type_id,
                from_date: leaveForm.from_date,
                to_date: leaveForm.to_date,
                total_days: days,
                is_half_day: leaveForm.half_day,
                half_day_session: leaveForm.half_day ? leaveForm.half_day_type : null,
                reason: leaveForm.reason,
                contact_number: leaveForm.contact_number,
                address_during_leave: leaveForm.address,
                handover_notes: leaveForm.handover_notes,
                is_urgent: leaveForm.urgent
            };

            const response = await ApiCall('POST', '/leaverequest/apply', payload);
            if (response?.data?.success) {
                showStatusToast({ type: 'success', title: 'Success', message: 'Leave request submitted successfully!' });
                closeModal();
                setLeaveForm({
                    leave_type: '', from_date: '', to_date: '',
                    half_day: false, half_day_type: 'first_half',
                    reason: '', contact_number: '', address: '',
                    handover_notes: '', urgent: false
                });
                fetchInitialData();
            } else {
                showStatusToast({ type: 'error', title: 'Error', message: response?.data?.message || 'Failed to submit leave request' });
            }
        } catch (err) {
            showStatusToast({ type: 'error', title: 'Error', message: err.data?.message || err.message || 'Error submitting leave request' });
        }
    };

    const handleRegSubmit = async () => {
        if (!regForm.date || !regForm.punch_in || !regForm.punch_out || !regForm.reason.trim()) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'Please fill all required fields' });
            return;
        }

        const todayDsStr = formatDateLocal(today.getFullYear(), today.getMonth(), today.getDate());
        if (regForm.date > todayDsStr) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'You cannot apply regularization for future dates.' });
            return;
        }

        const inMins = parseHHMM(regForm.punch_in);
        const outMins = parseHHMM(regForm.punch_out);
        if (outMins <= inMins) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'Punch Out time must be after Punch In time.' });
            return;
        }

        const existingLeave = (leaveRequests || []).find(l => l.status === 'approved' && regForm.date >= l.from_date && regForm.date <= l.to_date && !l.is_half_day);
        if (existingLeave) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: `An approved leave (${existingLeave.leave_name || 'Leave'}) already exists for ${regForm.date}.` });
            return;
        }

        try {
            const payload = {
                attendance_date: regForm.date,
                requested_punch_in: regForm.punch_in,
                requested_punch_out: regForm.punch_out,
                reason: regForm.reason
            };

            const response = await ApiCall('POST', '/attendance/applyRegularization', payload);
            if (response?.data?.success) {
                showStatusToast({ type: 'success', title: 'Success', message: 'Attendance regularization request submitted successfully!' });
                closeModal();
                setRegForm({ date: '', punch_in: '', punch_out: '', reason: '' });
                fetchInitialData();
            } else {
                showStatusToast({ type: 'error', title: 'Error', message: response?.data?.message || 'Failed to submit regularization request' });
            }
        } catch (err) {
            showStatusToast({ type: 'error', title: 'Error', message: err.data?.message || err.message || 'Error submitting regularization request' });
        }
    };

    const handleReminderSubmit = () => {
        if (!reminderForm.title.trim()) {
            showStatusToast({ type: 'warning', title: 'Validation Warning', message: 'Please enter a title for reminder' });
            return;
        }
        const y = selectedDate.getFullYear();
        const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const d = String(selectedDate.getDate()).padStart(2, '0');
        const newRem = {
            id: Date.now(),
            ...reminderForm,
            date: `${y}-${m}-${d}`,
            status: 'pending',
        };
        setReminders(prev => [...prev, newRem]);
        setReminderForm({ title: '', time: '09:00', type: 'personal', priority: 'medium', note: '', forUserId: null });
        closeModal();
    };

    const handleReminderComplete = (id) => setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));
    const handleReminderDelete = (id) => setReminders(prev => prev.filter(r => r.id !== id));

    const handleDateClick = (d) => {
        const ds = dateStr(d);
        setSelected(new Date(year, month, d));
        const events = getEvents(ds);
        const attRec = (attendance || []).find(a => a.date === ds || a.attendance_date === ds);
        const extra = getExtra(ds);
        setDetailDate({ ds, events, attRec, extra });
        openModal('dateDetail');
    };

    const { firstDay, daysInMonth } = getDaysInMonth();
    const selDs = formatDateLocal(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    return {
        currentDate, selectedDate, view, setView,
        modal, openModal, closeModal,
        leaveForm, setLeaveForm, leaveRequests, leaveBalance,
        regForm, setRegForm, attendance, regRequests,
        reminderForm, setReminderForm, reminders,
        detailDate, workSchedule, holidays, activeWorkWeek,
        year, month, firstDay, daysInMonth, selDs,
        totalExtraMins, totalDeficitMins, totalCarryForwardMins,
        upcomingReminders, upcomingEvents,
        dateStr, getEvents, getExtra,
        prevMonth, nextMonth, goToToday,
        handleLeaveSubmit, handleRegSubmit,
        handleReminderSubmit, handleReminderComplete, handleReminderDelete,
        handleDateClick,
        isManager,
        isOvertimeApplicable,
        overtimeCarryForward,
    };
}
