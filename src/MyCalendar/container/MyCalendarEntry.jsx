import React from 'react'
import { Plus, AlarmClock, BellPlus } from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import { useCalendarState } from '../hooks/useCalendarState'
import CalendarGrid from '../components/CalendarGrid'
import HoursSummary from '../components/HoursSummary'
import SelectedDayPanel from '../components/SelectedDayPanel'
import LeaveBalance from '../components/LeaveBalance'
import UpcomingEvents from '../components/UpcomingEvents'
import RemindersPanel from '../components/RemindersPanel'
import RegularizationsPanel from '../components/RegularizationsPanel'
import LeaveModal from '../components/LeaveModal'
import RegularizeModal from '../components/RegularizeModal'
import ReminderModal from '../components/ReminderModal'
import DateDetailModal from '../components/DateDetailModal'

function MyCalendarEntry() {
    const {
        selectedDate, view, setView,
        modal, openModal, closeModal,
        leaveForm, setLeaveForm,
        regForm, setRegForm, attendance, regRequests,
        reminderForm, setReminderForm,
        reminders, detailDate, workSchedule, holidays, leaveBalance,
        year, month, firstDay, daysInMonth, selDs,
        totalExtraMins, totalDeficitMins, totalCarryForwardMins,
        upcomingReminders, upcomingEvents,
        getEvents, getExtra,
        prevMonth, nextMonth, goToToday,
        handleLeaveSubmit, handleRegSubmit,
        handleReminderSubmit, handleReminderComplete, handleReminderDelete,
        handleDateClick,
        isManager,
        isOvertimeApplicable,
    } = useCalendarState()

    return (
        <>
            <BreadCrumb
                items={[{ label: 'My Calendar' }]}
                title="My Calendar"
                description="Leave apply, regularization, reminders, important dates and time tracking"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => openModal('leave')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer">
                            <Plus size={15} /> Apply Leave
                        </button>
                        <button onClick={() => openModal('regularize')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 cursor-pointer">
                            <AlarmClock size={15} /> Regularize
                        </button>
                        <button onClick={() => { openModal('reminder') }}
                            className="px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2 cursor-pointer">
                            <BellPlus size={15} /> Add Reminder
                        </button>
                    </div>
                }
            />

            <div className="flex flex-wrap gap-3 mb-5">
                {[
                    { color: 'bg-amber-500', label: 'Holiday' },
                    { color: 'bg-indigo-600', label: 'My Leave' },
                    { color: 'bg-emerald-600', label: 'Attendance' },
                    { color: 'bg-blue-500', label: 'Regularization' },
                    { color: 'bg-yellow-500', label: 'Reminder' },
                    { color: 'bg-red-500', label: 'Off Day' },
                ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
                        <span className="text-xs text-gray-600">{l.label}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                <div className="lg:col-span-2 space-y-5">
                    <CalendarGrid
                        year={year} month={month}
                        firstDay={firstDay} daysInMonth={daysInMonth}
                        view={view} setView={setView}
                        prevMonth={prevMonth} nextMonth={nextMonth} goToToday={goToToday}
                        selectedDate={selectedDate}
                        handleDateClick={handleDateClick}
                        getEvents={getEvents} getExtra={getExtra}
                        attendance={attendance}
                        workSchedule={workSchedule}
                        holidays={holidays}
                        isOvertimeApplicable={isOvertimeApplicable}
                    />

                    <HoursSummary
                        month={month}
                        attendance={attendance}
                        totalExtraMins={totalExtraMins}
                        totalDeficitMins={totalDeficitMins}
                        totalCarryForwardMins={totalCarryForwardMins}
                        openModal={openModal}
                        setRegForm={setRegForm}
                        isOvertimeApplicable={isOvertimeApplicable}
                        selectedDate={selectedDate}
                    />

                </div>

                <div className="space-y-5">
                    <SelectedDayPanel
                        selectedDate={selectedDate}
                        selDs={selDs}
                        getEvents={getEvents}
                        openModal={openModal}
                    />

                    <LeaveBalance openModal={openModal} leaveBalance={leaveBalance} />

                    <UpcomingEvents upcomingEvents={upcomingEvents} />

                    <RemindersPanel
                        upcomingReminders={upcomingReminders}
                        handleReminderComplete={handleReminderComplete}
                        handleReminderDelete={handleReminderDelete}
                    />

                    <RegularizationsPanel
                        regRequests={regRequests}
                        openModal={openModal}
                    />
                </div>
            </div>

            <LeaveModal
                isOpen={modal === 'leave'}
                onClose={closeModal}
                leaveForm={leaveForm}
                setLeaveForm={setLeaveForm}
                handleLeaveSubmit={handleLeaveSubmit}
                leaveBalance={leaveBalance}
            />

            <RegularizeModal
                isOpen={modal === 'regularize'}
                onClose={closeModal}
                regForm={regForm}
                setRegForm={setRegForm}
                regRequests={regRequests}
                handleRegSubmit={handleRegSubmit}
                workSchedule={workSchedule}
            />

            <ReminderModal
                isOpen={modal === 'reminder'}
                onClose={closeModal}
                selectedDate={selectedDate}
                reminderForm={reminderForm}
                setReminderForm={setReminderForm}
                handleReminderSubmit={handleReminderSubmit}
                isManager={isManager}
            />

            <DateDetailModal
                isOpen={modal === 'dateDetail'}
                onClose={closeModal}
                detailDate={detailDate}
                openModal={openModal}
                isOvertimeApplicable={isOvertimeApplicable}
            />
        </>
    )
}

export default MyCalendarEntry