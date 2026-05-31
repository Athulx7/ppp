import React, { useState } from 'react'
import Breadcrumb from '../../basicComponents/BreadCrumb'
import { Coffee, Eye, Plus } from 'lucide-react'
import CommonButton from '../../basicComponents/CommonButton'
import { useNavigate } from 'react-router-dom';
import JobtrackingMain from '../components/JobtrackingMain';

function JobTrackingEntry() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState({
        normal: false,
        spinner: false
    })
    const [showLunchModal, setShowLunchModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [lunchBreak, setLunchBreak] = useState({ enabled: false, start: '13:00', end: '14:00' });
    const isLunchActive = () => {
        if (!lunchBreak?.enabled || !lunchBreak.start || !lunchBreak.end) return false;
        const now = new Date();
        const [sh, sm] = lunchBreak.start.split(':').map(Number);
        const [eh, em] = lunchBreak.end.split(':').map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        return nowMins >= sh * 60 + sm && nowMins < eh * 60 + em;
    };
    const lunchActive = isLunchActive();
    return (
        <>
            <Breadcrumb
                items={[{ label: 'My Jobs' }]}
                title="My Jobs"
                description="Create, run, and track your job sessions — manage time with precision"
                actions={
                    <div className="flex flex-wrap items-center justify-end gap-3 mb-5">
                        {lunchActive && (
                            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-sm font-medium animate-pulse">
                                <Coffee className="w-4 h-4" />Lunch Break Active – Timer Paused
                            </span>
                        )}
                        <button onClick={() => setShowLunchModal(true)}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
                            <Coffee className="w-4 h-4" />
                            {lunchBreak?.enabled ? `Lunch ${lunchBreak.start}–${lunchBreak.end}` : 'Set Lunch Break'}
                        </button>
                        <CommonButton label="Create Job" variant="primary" size="small" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCreateModal(true)} />
                        <CommonButton label="View Job Calendar" variant="success" size="small" icon={<Eye className="w-4 h-4" />} onClick={() => navigate('/admin/jobcalendar')} />
                    </div>
                }
                loading={isLoading.normal}
            />

            <JobtrackingMain
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                lunchActive={lunchActive}
                setShowLunchModal={setShowLunchModal}
                lunchBreak={lunchBreak}
                setLunchBreak={setLunchBreak}
                showLunchModal={showLunchModal}
                setShowCreateModal={setShowCreateModal}
                showCreateModal={showCreateModal}
            />

        </>
    )
}

export default JobTrackingEntry