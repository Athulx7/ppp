import React from 'react'
import { Plus, AlarmClock, BellPlus } from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import { useCalendarState } from '../hooks/useCalendarState'
import CalendarGrid from '../components/CalendarGrid'
import HoursSummary from '../components/HoursSummary'
import TeamLeaves from '../components/TeamLeaves'
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
        // state
        selectedDate, view, setView,
        modal, openModal, closeModal,
        leaveForm, setLeaveForm,
        regForm, setRegForm, attendance, regRequests,
        reminderForm, setReminderForm,
        reminders, detailDate,
        // derived
        year, month, firstDay, daysInMonth, selDs,
        totalExtraMins, totalDeficitMins,
        upcomingReminders, upcomingEvents,
        // helpers
        getEvents, getExtra,
        // handlers
        prevMonth, nextMonth, goToToday,
        handleLeaveSubmit, handleRegSubmit,
        handleReminderSubmit, handleReminderComplete, handleReminderDelete,
        handleDateClick,
        // meta
        isManager,
    } = useCalendarState()

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <BreadCrumb
                items={[{ label: 'My Calendar' }]}
                title="My Calendar"
                description="Leave apply, regularization, reminders, important dates and time tracking"
                actions={
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => openModal('leave')}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <Plus size={15} /> Apply Leave
                        </button>
                        <button onClick={() => openModal('regularize')}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                            <AlarmClock size={15} /> Regularize
                        </button>
                        <button onClick={() => { openModal('reminder') }}
                            className="px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors flex items-center gap-2">
                            <BellPlus size={15} /> Add Reminder
                        </button>
                    </div>
                }
            />

            <div className="flex flex-wrap gap-3 mb-5">
                {[
                    { color: 'bg-red-400', label: 'Holiday' },
                    { color: 'bg-pink-400', label: 'Birthday' },
                    { color: 'bg-purple-400', label: 'Anniversary' },
                    { color: 'bg-blue-400', label: 'My Leave' },
                    { color: 'bg-yellow-400', label: 'Reminder' },
                    { color: 'bg-indigo-400', label: 'Event' },
                    { color: 'bg-emerald-400', label: 'Extra Hours' },
                    { color: 'bg-rose-400', label: 'Absent' },
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
                    />

                    <HoursSummary
                        month={month}
                        attendance={attendance}
                        totalExtraMins={totalExtraMins}
                        totalDeficitMins={totalDeficitMins}
                        openModal={openModal}
                        setRegForm={setRegForm}
                    />

                    <TeamLeaves />
                </div>

                <div className="space-y-5">
                    <SelectedDayPanel
                        selectedDate={selectedDate}
                        selDs={selDs}
                        getEvents={getEvents}
                        openModal={openModal}
                    />

                    <LeaveBalance openModal={openModal} />

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
            />

            <RegularizeModal
                isOpen={modal === 'regularize'}
                onClose={closeModal}
                regForm={regForm}
                setRegForm={setRegForm}
                regRequests={regRequests}
                handleRegSubmit={handleRegSubmit}
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
            />
        </div>
    )
}

export default MyCalendarEntry