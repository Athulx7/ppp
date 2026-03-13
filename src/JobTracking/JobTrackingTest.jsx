import React, { useState } from 'react';
import { Briefcase, Calendar, Users, LayoutGrid } from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import JobTrackingMain from './JobTrackingMain';
import JobCalendar from './JobCalendar';
import JobAdminView from './JobAdminView';

const TABS = [
    { id: 'jobs', label: 'My Jobs', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'calendar', label: 'Job Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin / HR View', icon: <Users className="w-4 h-4" /> },
];

function JobTrackingTest() {
    const [activeTab, setActiveTab] = useState('jobs');

    // Shared state: all jobs and lunch break config live here
    const [jobs, setJobs] = useState([]);
    const [lunchBreak, setLunchBreak] = useState({ enabled: false, start: '13:00', end: '14:00' });

    return (
        <>
            {/* Tab Nav */}
            {/* <div className="flex gap-1 p-1.5 bg-gray-100 rounded-xl mb-5 w-fit flex-wrap">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${activeTab === tab.id
                                ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div> */}

            {/* Tab Content */}
            {activeTab === 'jobs' && (
                <JobTrackingMain
                    jobs={jobs}
                    setJobs={setJobs}
                    lunchBreak={lunchBreak}
                    setLunchBreak={setLunchBreak}
                />
            )}
            {activeTab === 'calendar' && (
                <JobCalendar
                    jobs={jobs}
                    lunchBreak={lunchBreak}
                />
            )}
            {activeTab === 'admin' && (
                <JobAdminView
                    jobs={jobs}
                />
            )}
        </>
    );
}

export default JobTrackingTest;