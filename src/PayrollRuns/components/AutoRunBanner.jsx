import React, { useState } from 'react';
import { Clock, Calendar, Zap, Info, ShieldCheck, CheckCircle2, ChevronRight, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasePath } from '../../library/constants';

export default function AutoRunBanner({ autoConfig, currentMonth, currentYear }) {
    const navigate = useNavigate();
    const [showDetails, setShowDetails] = useState(false);
    const basePath = getRoleBasePath();

    const isAutoRunEnabled = autoConfig?.enabled ?? true;
    const scheduledDay = autoConfig?.scheduled_day || 28;
    const cutoffDay = autoConfig?.cutoff_day || 25;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentMonthName = monthNames[currentMonth];

    return (
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-xl text-white p-4 sm:p-5 shadow-lg border border-indigo-700/50 mb-6 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-indigo-200 border border-white/10 shrink-0 mt-0.5">
                        <Zap className="w-5 h-5 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-semibold text-white tracking-wide">
                                Automated Multi-Tenant Payroll Scheduler
                            </h3>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                                isAutoRunEnabled 
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isAutoRunEnabled ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                                {isAutoRunEnabled ? 'Auto-Run Scheduled' : 'Manual Run Mode'}
                            </span>
                        </div>
                        <p className="text-xs text-indigo-200/90 mt-1 leading-relaxed max-w-3xl">
                            {isAutoRunEnabled 
                                ? `Company DB backend cron is set to automatically compute LOP, pull biometric logs, and finalize ${currentMonthName} ${currentYear} payroll on day ${scheduledDay} (Cut-off: day ${cutoffDay}). You can also run it manually below.`
                                : `Automatic payroll trigger is currently paused in Company Settings. Manual verification of Attendance, LOP, and Salary deductions is required.`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-indigo-100 rounded-lg text-xs font-medium border border-white/15 transition-all flex items-center gap-1.5"
                    >
                        <Info className="w-3.5 h-3.5" />
                        {showDetails ? 'Hide Multi-Tenant Info' : 'Multi-Tenant Architecture'}
                    </button>
                    <button
                        onClick={() => navigate(`${basePath}/payrollsettings`)}
                        className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Configure Auto-Run
                    </button>
                </div>
            </div>

            {showDetails && (
                <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 font-semibold text-indigo-200 mb-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Tenant DB Isolation
                        </div>
                        <p className="text-indigo-200/80">
                            Admin DB maps Company ID to Client Database credentials. Every query and payroll transaction strictly runs on your isolated company database.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 font-semibold text-indigo-200 mb-1">
                            <Clock className="w-4 h-4 text-amber-400" />
                            Scheduled Cron Worker
                        </div>
                        <p className="text-indigo-200/80">
                            Backend scheduler polls tenant configurations daily. On day {scheduledDay}, it executes the calculation pipeline automatically if manual run was not executed prior.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 font-semibold text-indigo-200 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-blue-400" />
                            Cut-Off & LOP Sync
                        </div>
                        <p className="text-indigo-200/80">
                            Attendance cut-off is day {cutoffDay}. All leave approvals, unapproved absences, and LOP days after this date rollover to next month's calculation.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
