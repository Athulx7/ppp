import React from 'react';
import { Calendar, Settings, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRoleBasePath } from '../../library/constants';

export default function AutoRunBanner({ autoConfig, currentMonth, currentYear }) {
    const navigate = useNavigate();
    const basePath = getRoleBasePath();

    return (
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg text-gray-800 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">
                        Automated Payroll Scheduling
                    </h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                        Automated payroll scheduling is available. Configure auto-run schedules, cut-off dates, and biometric sync rules in Payroll Settings.
                    </p>
                </div>
            </div>

            <button
                onClick={() => navigate(`${basePath}/payrollsettings`)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
            >
                <Settings className="w-3.5 h-3.5" />
                Configure Auto-Run
                <ArrowRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

