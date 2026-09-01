import React, { useEffect, useState } from 'react';
import { 
    Loader2, CheckCircle2, Database, ShieldCheck, 
    Zap, Sparkles, FileText, Send, Lock
} from 'lucide-react';
import CommonModal from '../../basicComponents/CommonModal';

export default function PayrollProcessingModal({
    isOpen,
    progress,
    stepMessage,
    onComplete
}) {
    if (!isOpen) return null;

    const stages = [
        { label: 'Connecting to Tenant Database & Locking Period', threshold: 15, icon: <Database className="w-4 h-4" /> },
        { label: 'Syncing Attendance & Calculating LOP Deductions', threshold: 35, icon: <Zap className="w-4 h-4" /> },
        { label: 'Computing Overtime & Variable Pay Additions', threshold: 55, icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Applying Statutory PF, ESI, PT & TDS Deductions', threshold: 75, icon: <ShieldCheck className="w-4 h-4" /> },
        { label: 'Generating Encrypted Employee Payslip Records', threshold: 90, icon: <FileText className="w-4 h-4" /> },
        { label: 'Finalizing Batch Run & Generating Bank Payout Sheet', threshold: 100, icon: <Lock className="w-4 h-4" /> }
    ];

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={() => {}}
            closeButton={false}
            overlayClose={false}
            size="md"
            title=""
        >
            <div className="p-6 text-center space-y-5">
                {/* Spinning Core Icon */}
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-30"></div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                </div>

                {/* Title */}
                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        Running Payroll Execution Pipeline
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                        {stepMessage || 'Processing multi-tenant calculation engine...'}
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                        <span>Progress</span>
                        <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Step List */}
                <div className="text-left space-y-2 pt-2 border-t border-gray-100 text-xs">
                    {stages.map((st, i) => {
                        const isDone = progress >= st.threshold;
                        const isCurrent = progress < st.threshold && (i === 0 || progress >= stages[i - 1].threshold);

                        return (
                            <div 
                                key={i}
                                className={`flex items-center gap-2.5 py-1 px-2 rounded-lg transition-colors ${
                                    isDone 
                                        ? 'text-emerald-700 bg-emerald-50/50' 
                                        : isCurrent 
                                            ? 'text-indigo-700 bg-indigo-50 font-semibold' 
                                            : 'text-gray-400 opacity-60'
                                }`}
                            >
                                {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : isCurrent ? (
                                    <Loader2 className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[9px] shrink-0">
                                        {i + 1}
                                    </div>
                                )}
                                <span className="line-clamp-1">{st.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </CommonModal>
    );
}
