import React, { useEffect, useMemo, useState } from 'react'
import {
    Users, Building, Clock, Save, Trash2, Edit, X,
    CheckCircle, Search, Loader2, AlertCircle
} from 'lucide-react'
import CommonSwitch from '../../basicComponents/CommonSwitch'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonAccordion from '../../basicComponents/CommonAccordion'
import CommonMultiSelectionDropdown from '../../basicComponents/CommonMultiSelectionDropdwon'
import { ApiCall } from '../../library/constants'

const WEEK_DAYS = [
    { value: 'monday', label: 'Monday', short: 'Mon' },
    { value: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { value: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { value: 'thursday', label: 'Thursday', short: 'Thu' },
    { value: 'friday', label: 'Friday', short: 'Fri' },
    { value: 'saturday', label: 'Saturday', short: 'Sat' },
    { value: 'sunday', label: 'Sunday', short: 'Sun' }
]

function CustomWorkSchedule({ isTabLoading, currentTitle }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const [targetType, setTargetType] = useState('department')

    const [departments, setDepartments] = useState([])
    const [designations, setDesignations] = useState([])
    const [employees, setEmployees] = useState([])
    const [schedules, setSchedules] = useState([])

    const [selectedDepartmentCodes, setSelectedDepartmentCodes] = useState([])
    const [filterDeptCode, setFilterDeptCode] = useState('all')
    const [filterDesigCode, setFilterDesigCode] = useState('all')
    const [selectedEmployeeCodes, setSelectedEmployeeCodes] = useState([])

    const [workWeek, setWorkWeek] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])
    const [workingHoursPerDay, setWorkingHoursPerDay] = useState(9)
    const [isFixedStartEnd, setIsFixedStartEnd] = useState(true)
    const [startTime, setStartTime] = useState('09:00')
    const [endTime, setEndTime] = useState('18:00')
    const [overtimeApplicable, setOvertimeApplicable] = useState(false)
    const [overtimeRate, setOvertimeRate] = useState(1.5)
    const [shiftAllowance, setShiftAllowance] = useState(0)

    const [editingSchedule, setEditingSchedule] = useState(null)
    const [tableSearch, setTableSearch] = useState('')

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await ApiCall('get', '/payrollsettings/work-schedules')
            if (res.data?.success) {
                setDepartments(res.data.data.departments || [])
                setDesignations(res.data.data.designations || [])
                setEmployees(res.data.data.employees || [])
                setSchedules(res.data.data.schedules || [])
            }
        } catch (err) {
            console.error('Error loading work schedules data:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const filteredDesignations = useMemo(() => {
        if (filterDeptCode === 'all') return designations
        return designations.filter(d => d.departmentCode === filterDeptCode)
    }, [designations, filterDeptCode])

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesDept = filterDeptCode === 'all' || emp.departmentCode === filterDeptCode
            const matchesDesig = filterDesigCode === 'all' || emp.designationCode === filterDesigCode
            return matchesDept && matchesDesig
        })
    }, [employees, filterDeptCode, filterDesigCode])

    const handleDepartmentFilterChange = (deptCode) => {
        setFilterDeptCode(deptCode)
        setFilterDesigCode('all')
        setSelectedEmployeeCodes([])
    }

    const toggleDay = (dayValue) => {
        setWorkWeek(prev =>
            prev.includes(dayValue)
                ? prev.filter(d => d !== dayValue)
                : [...prev, dayValue]
        )
    }

    const handleApplySchedule = async () => {
        setErrorMessage('')
        if (targetType === 'department' && selectedDepartmentCodes.length === 0) {
            setErrorMessage('Please select at least one department.')
            return
        }
        if (targetType === 'employee' && selectedEmployeeCodes.length === 0) {
            setErrorMessage('Please select at least one employee.')
            return
        }

        setSaving(true)
        try {
            const payload = {
                targetType,
                departmentCodes: selectedDepartmentCodes,
                employeeCodes: selectedEmployeeCodes,
                schedule: {
                    workWeek,
                    workingHoursPerDay: parseFloat(workingHoursPerDay),
                    isFixedStartEnd,
                    startTime,
                    endTime,
                    overtimeApplicable,
                    overtimeRate: parseFloat(overtimeRate),
                    shiftAllowance: parseFloat(shiftAllowance)
                }
            }

            const res = await ApiCall('post', '/payrollsettings/work-schedules', payload)
            if (res.data?.success) {
                setSaveSuccess(res.data.message || 'Schedule applied successfully!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setSelectedDepartmentCodes([])
                setSelectedEmployeeCodes([])
                await loadData()
            }
        } catch (err) {
            console.error('Error applying schedule:', err)
            setErrorMessage(err.response?.data?.message || 'Failed to apply schedule')
        } finally {
            setSaving(false)
        }
    }

    const handleSaveSingleEdit = async () => {
        if (!editingSchedule) return
        setSaving(true)
        try {
            const res = await ApiCall('put', `/payrollsettings/work-schedules/${editingSchedule.id}`, editingSchedule)
            if (res.data?.success) {
                setSaveSuccess('Schedule updated successfully!')
                setTimeout(() => setSaveSuccess(''), 3000)
                setEditingSchedule(null)
                await loadData()
            }
        } catch (err) {
            console.error('Error updating schedule:', err)
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteSchedule = async (id) => {
        if (!window.confirm('Are you sure you want to delete this schedule entry?')) return
        try {
            const res = await ApiCall('delete', `/payrollsettings/work-schedules/${id}`)
            if (res.data?.success) {
                await loadData()
            }
        } catch (err) {
            console.error('Error deleting schedule:', err)
        }
    }

    const filteredSchedulesTable = useMemo(() => {
        if (!tableSearch) return schedules
        const query = tableSearch.toLowerCase()
        return schedules.filter(s =>
            s.employeeName?.toLowerCase().includes(query) ||
            s.userCode?.toLowerCase().includes(query) ||
            s.department?.toLowerCase().includes(query) ||
            s.designation?.toLowerCase().includes(query)
        )
    }, [schedules, tableSearch])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-sm font-medium">Loading...</span>
            </div>
        )
    }

    return (
        <div className="space-y-5 overflow-y-auto max-h-[80vh] hide-scrollbar">
            {
                !isTabLoading && <div className="flex items-start gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">{currentTitle}</h3>
                        {currentTitle && <p className="text-xs text-gray-500 mt-0.5">{currentTitle}</p>}
                    </div>
                </div>
            }

            <CommonAccordion
                title="Work Schedule Configuration"
                icon={<Clock className="w-4 h-4 text-indigo-600" />}
                defaultOpen={false}
            >
                <div className="space-y-6 py-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                Step 1: Select Target ({targetType === 'department' ? 'Departments' : 'Employees'})
                            </h4>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Choose whether to apply this schedule by Department or by individual Employees
                            </p>
                        </div>

                        <div className="flex items-center bg-gray-100 rounded-md self-start md:self-auto">
                            <button
                                type="button"
                                onClick={() => setTargetType('department')}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${targetType === 'department'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Building className="w-3.5 h-3.5" />
                                Department Wise
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetType('employee')}
                                className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer flex items-center gap-1.5 ${targetType === 'employee'
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Employee Wise
                            </button>
                        </div>
                    </div>

                    {targetType === 'department' ? (
                        <div>
                            <CommonMultiSelectionDropdown
                                label="Select Departments"
                                placeholder="Choose one or more departments"
                                options={departments.map(d => ({ label: d.label, value: d.value }))}
                                value={selectedDepartmentCodes}
                                onChange={(vals) => setSelectedDepartmentCodes(vals)}
                                showSelectAll={true}
                                showSearch={true}
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CommonDropDown
                                    label="Department"
                                    value={filterDeptCode}
                                    options={[
                                        { label: 'All Departments', value: 'all' },
                                        ...departments.map(d => ({ label: d.label, value: d.value }))
                                    ]}
                                    onChange={handleDepartmentFilterChange}
                                />

                                <CommonDropDown
                                    label="Designation"
                                    value={filterDesigCode}
                                    options={[
                                        { label: 'All Designations', value: 'all' },
                                        ...filteredDesignations.map(d => ({ label: d.label, value: d.value }))
                                    ]}
                                    onChange={(val) => setFilterDesigCode(val)}
                                />
                            </div>

                            <div>
                                <CommonMultiSelectionDropdown
                                    label={`Employees (${filteredEmployees.length} available)`}
                                    placeholder="Choose one or more employees"
                                    options={filteredEmployees.map(emp => ({
                                        label: `${emp.name} (${emp.userCode}) - ${emp.department}`,
                                        value: emp.userCode
                                    }))}
                                    value={selectedEmployeeCodes}
                                    onChange={(vals) => setSelectedEmployeeCodes(vals)}
                                    showSelectAll={true}
                                    showSearch={true}
                                />
                            </div>
                        </div>
                    )}

                    <div className="pt-2 space-y-5">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            Step 2: Configure Work Schedule & Timings
                        </h4>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                                Working Days ({workWeek.length} days selected)
                            </label>
                            <div className="grid grid-cols-7 gap-2">
                                {WEEK_DAYS.map((day) => {
                                    const isSelected = workWeek.includes(day.value)
                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            className={`py-2 px-2 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${isSelected
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                                }`}
                                        >
                                            {day.short}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                            <CommonInputField
                                label="Working Hours per Day"
                                type="number"
                                value={workingHoursPerDay}
                                onChange={(e) => setWorkingHoursPerDay(e)}
                            />

                            <CommonSwitch
                                checked={isFixedStartEnd}
                                onChange={(checked) => setIsFixedStartEnd(checked)}
                                label={'Fixed Shift Timings'}
                            />

                            {isFixedStartEnd && (
                                <div className="grid grid-cols-2 gap-3">
                                    <CommonInputField
                                        label="Start Time"
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e)}
                                    />
                                    <CommonInputField
                                        label="End Time"
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e)}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">

                            <CommonSwitch
                                checked={overtimeApplicable}
                                onChange={(checked) => setOvertimeApplicable(checked)}
                                label={'Overtime Applicable'}
                            />

                            {overtimeApplicable && (
                                <CommonInputField
                                    label="Overtime Rate (Multiplier)"
                                    type="number"
                                    value={overtimeRate}
                                    onChange={(e) => setOvertimeRate(e)}
                                />
                            )}

                            <CommonInputField
                                label="Shift Allowance (₹)"
                                type="number"
                                value={shiftAllowance}
                                onChange={(e) => setShiftAllowance(e)}
                            />
                        </div>

                        {errorMessage && (
                            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                {errorMessage}
                            </div>
                        )}

                        {saveSuccess && (
                            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                {saveSuccess}
                            </div>
                        )}

                        <div className="flex justify-end ">
                            <button
                                type="button"
                                onClick={handleApplySchedule}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Apply Schedule ({targetType === 'department' ? `${selectedDepartmentCodes.length} Depts` : `${selectedEmployeeCodes.length} Employees`})
                            </button>
                        </div>
                    </div>
                </div>
            </CommonAccordion>

            <CommonAccordion
                title="Configured Employee Work Schedules"
                icon={<Users className="w-4 h-4 text-indigo-600" />}
                defaultOpen={true}
            >
                <div className="space-y-4 py-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Individual employee schedules with inline edit support</p>

                        <div className="relative w-full md:w-64">
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                            <input
                                type="text"
                                placeholder="Search employee or department..."
                                value={tableSearch}
                                onChange={(e) => setTableSearch(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-lg w-full focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto overflow-y max-h-[50vh] scrollbar">
                        <table className="w-full text-left text-xs text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-3">Employee</th>
                                    <th className="px-4 py-3">Department / Designation</th>
                                    <th className="px-4 py-3">Working Days</th>
                                    <th className="px-4 py-3">Hours / Timing</th>
                                    <th className="px-4 py-3">OT Rate</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSchedulesTable.map((sched) => (
                                    <tr key={sched.id} className="hover:bg-gray-50/70 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-gray-900">
                                            {sched.employeeName}
                                            <span className="block text-[11px] font-normal text-gray-400">{sched.userCode}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-800">{sched.department}</span>
                                            <span className="block text-[11px] text-gray-500">{sched.designation}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1">
                                                {WEEK_DAYS.map(day => (
                                                    <span
                                                        key={day.value}
                                                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sched.workWeek?.includes(day.value)
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                    >
                                                        {day.short[0]}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-gray-800">{sched.workingHoursPerDay} hrs/day</span>
                                            {sched.isFixedStartEnd && (
                                                <span className="block text-[11px] text-gray-500">
                                                    {sched.startTime} - {sched.endTime}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {sched.overtimeApplicable ? (
                                                <span className="text-emerald-700 font-semibold">{sched.overtimeRate}x</span>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingSchedule(sched)}
                                                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Edit schedule"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteSchedule(sched.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete schedule"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredSchedulesTable.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                                            No employee work schedules found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CommonAccordion>

            {editingSchedule && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Edit Work Schedule: {editingSchedule.employeeName}
                                </h3>
                                <p className="text-xs text-gray-500">{editingSchedule.userCode} • {editingSchedule.department}</p>
                            </div>
                            <button onClick={() => setEditingSchedule(null)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Working Days</label>
                                <div className="grid grid-cols-7 gap-1">
                                    {WEEK_DAYS.map(day => {
                                        const isSelected = editingSchedule.workWeek?.includes(day.value)
                                        return (
                                            <button
                                                key={day.value}
                                                type="button"
                                                onClick={() => {
                                                    const updatedDays = isSelected
                                                        ? editingSchedule.workWeek.filter(d => d !== day.value)
                                                        : [...(editingSchedule.workWeek || []), day.value]
                                                    setEditingSchedule({ ...editingSchedule, workWeek: updatedDays })
                                                }}
                                                className={`py-1.5 text-xs font-semibold rounded border cursor-pointer ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-500 border-gray-200'
                                                    }`}
                                            >
                                                {day.short[0]}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Hours/Day"
                                    type="number"
                                    value={editingSchedule.workingHoursPerDay || 9}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, workingHoursPerDay: e.target.value })}
                                />
                                <CommonInputField
                                    label="OT Rate"
                                    type="number"
                                    value={editingSchedule.overtimeRate || 1.5}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, overtimeRate: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Start Time"
                                    type="time"
                                    value={editingSchedule.startTime || '09:00'}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, startTime: e.target.value })}
                                />
                                <CommonInputField
                                    label="End Time"
                                    type="time"
                                    value={editingSchedule.endTime || '18:00'}
                                    onChange={(e) => setEditingSchedule({ ...editingSchedule, endTime: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setEditingSchedule(null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveSingleEdit}
                                disabled={saving}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                            >
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                Update Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CustomWorkSchedule
