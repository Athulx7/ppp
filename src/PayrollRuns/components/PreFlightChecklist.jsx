import React from 'react';
import { 
    CheckCircle2, AlertCircle, Clock, CalendarDays, DollarSign, 
    CreditCard, ShieldAlert, ArrowRight, RefreshCw, Eye, Check,
    AlertTriangle, Sparkles, UserCheck, FileCheck, Layers
} from 'lucide-react';

export default function PreFlightChecklist({
    verificationStatus,
    setVerificationStatus,
    onOpenLopModal,
    onOpenOtModal,
    onOpenAdvanceModal,
    metrics,
    allVerified,
    onProceedToCalculation
}) {
    const handleToggleVerification = (key) => {
        setVerificationStatus(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                verified: !prev[key].verified,
                verifiedAt: !prev[key].verified ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
            }
        }));
    };

    const handleVerifyAll = () => {
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setVerificationStatus(prev => {
            const next = {};
            Object.keys(prev).forEach(k => {
                next[k] = { ...prev[k], verified: true, verifiedAt: now };
            });
            return next;
        });
    };

    const verifiedCount = Object.values(verificationStatus).filter(v => v.verified).length;
    const totalCount = Object.keys(verificationStatus).length;
    const progressPercent = Math.round((verifiedCount / totalCount) * 100);

    const checklistItems = [
        {
            key: 'attendance_lop',
            title: 'Attendance & Loss of Pay (LOP) Verification',
            category: 'Attendance & Time',
            icon: <CalendarDays className="w-5 h-5 text-amber-500" />,
            badgeColor: 'amber',
            description: 'Calculates unapproved absences, leaves balance, and loss of pay per-day rate deduction.',
            stats: [
                { label: 'Total Working Days', value: '30 Days' },
                { label: 'Employees with LOP', value: `${metrics.lopEmployeeCount || 0} Staff` },
                { label: 'Total LOP Days', value: `${metrics.totalLopDays || 0} Days` },
                { label: 'Total LOP Deduction', value: `₹${(metrics.totalLopDeductions || 0).toLocaleString('en-IN')}`, highlight: true }
            ],
            actionInspect: onOpenLopModal,
            actionInspectLabel: 'Inspect LOP & Attendance'
        },
        {
            key: 'overtime_variable',
            title: 'Overtime, Shift & Variable Earnings Check',
            category: 'Variable Earnings',
            icon: <Clock className="w-5 h-5 text-indigo-500" />,
            badgeColor: 'indigo',
            description: 'Verifies logged overtime hours (1.5x/2x rate), shift allowances, and approved bonus inputs.',
            stats: [
                { label: 'OT Eligible Staff', value: `${metrics.otEmployeeCount || 0} Staff` },
                { label: 'Total Overtime Hours', value: `${metrics.totalOtHours || 0} Hrs` },
                { label: 'Total Overtime Payout', value: `₹${(metrics.totalOvertimePay || 0).toLocaleString('en-IN')}`, highlight: true }
            ],
            actionInspect: onOpenOtModal,
            actionInspectLabel: 'Review OT & Variable Pay'
        },
        {
            key: 'advances_loans',
            title: 'Salary Advances & Loan Recoveries',
            category: 'Deductions & Recoveries',
            icon: <CreditCard className="w-5 h-5 text-purple-500" />,
            badgeColor: 'purple',
            description: 'Syncs active employee loan EMIs, festival advances, and pending salary advance deductions.',
            stats: [
                { label: 'Active Recoveries', value: `${metrics.advanceCount || 0} Deductions` },
                { label: 'Total Advance Recovered', value: `₹${(metrics.totalAdvances || 0).toLocaleString('en-IN')}`, highlight: true }
            ],
            actionInspect: onOpenAdvanceModal,
            actionInspectLabel: 'Inspect Advance Deductions'
        },
        {
            key: 'statutory_compliance',
            title: 'Statutory Compliance & Tax Rules (PF / ESI / PT / TDS)',
            category: 'Statutory & Taxes',
            icon: <ShieldAlert className="w-5 h-5 text-emerald-500" />,
            badgeColor: 'emerald',
            description: 'Validates PF 12% cap, ESI threshold (< ₹21,000 gross), PT slabs, and monthly TDS projections.',
            stats: [
                { label: 'PF Covered Staff', value: `${metrics.pfCount || 0} Staff` },
                { label: 'ESI Covered Staff', value: `${metrics.esiCount || 0} Staff` },
                { label: 'Estimated Tax Deductions', value: `₹${(metrics.totalStatutory || 0).toLocaleString('en-IN')}`, highlight: true }
            ]
        },
        {
            key: 'employee_status',
            title: 'Employee Master & Active / Hold Status Validation',
            category: 'Master Data',
            icon: <UserCheck className="w-5 h-5 text-blue-500" />,
            badgeColor: 'blue',
            description: 'Validates bank account IFSC, PAN numbers, new joiners joining pro-rata, and salaries kept on-hold.',
            stats: [
                { label: 'Active Processed', value: `${metrics.activeCount || 0} Staff` },
                { label: 'Salary On-Hold', value: `${metrics.holdCount || 0} Staff` },
                { label: 'New Joiners this Month', value: `${metrics.newJoinersCount || 0} Staff` }
            ]
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header & Progress Banner */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileCheck className="w-5 h-5 text-indigo-600" />
                                Pre-Payroll Verification & Re-Clarification Checklist
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Required Before Execution
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 max-w-2xl">
                            In multi-tenant payroll, every company's attendance logs, leaves, and salary rules must be verified. 
                            Review each module below and click <strong>"Re-clarify / Mark as Done"</strong> to unlock payroll computation.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-center shrink-0">
                        <button
                            onClick={handleVerifyAll}
                            className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border border-gray-300"
                        >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Verify All Checkpoints
                        </button>
                        <button
                            disabled={!allVerified}
                            onClick={onProceedToCalculation}
                            className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-2 ${
                                allVerified
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Proceed to Review Table
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                        <span className="text-gray-600 flex items-center gap-1.5">
                            <span className="font-semibold text-gray-900">{verifiedCount} of {totalCount}</span> items re-clarified and confirmed
                        </span>
                        <span className={`font-bold ${progressPercent === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                            {progressPercent}% Completed
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 rounded-full ${
                                progressPercent === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Checklist Items Cards */}
            <div className="grid grid-cols-1 gap-4">
                {checklistItems.map((item, idx) => {
                    const status = verificationStatus[item.key] || { verified: false };
                    const isDone = status.verified;

                    return (
                        <div 
                            key={item.key}
                            className={`bg-white rounded-xl border transition-all duration-200 p-5 ${
                                isDone 
                                    ? 'border-emerald-200 bg-emerald-50/20 shadow-sm' 
                                    : 'border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex items-start gap-3.5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                                        isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {isDone ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : item.icon}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                Step {idx + 1}: {item.category}
                                            </span>
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {item.title}
                                            </h3>
                                            {isDone ? (
                                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                                    <Check className="w-3 h-3 text-emerald-600" />
                                                    Re-clarified & Verified {status.verifiedAt ? `at ${status.verifiedAt}` : ''}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                                    Action / Review Pending
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.description}
                                        </p>

                                        {/* Metrics Row */}
                                        <div className="flex flex-wrap items-center gap-4 mt-3 pt-2.5 border-t border-gray-100">
                                            {item.stats.map((st, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-xs">
                                                    <span className="text-gray-400">{st.label}:</span>
                                                    <span className={`font-semibold ${st.highlight ? 'text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded' : 'text-gray-800'}`}>
                                                        {st.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2.5 self-end lg:self-center shrink-0">
                                    {item.actionInspect && (
                                        <button
                                            onClick={item.actionInspect}
                                            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            {item.actionInspectLabel}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleToggleVerification(item.key)}
                                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 border shadow-sm ${
                                            isDone
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
                                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                                        }`}
                                    >
                                        {isDone ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                Done (Click to Edit)
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                                                Re-clarify & Confirm Done
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Action bar if all verified */}
            {allVerified && (
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-emerald-900">All 5 Pre-Payroll Verifications Completed!</h4>
                            <p className="text-[11px] text-emerald-700">Attendance, LOP, OT, Advances, and Statutory Slabs are re-clarified and in sync with Company DB.</p>
                        </div>
                    </div>
                    <button
                        onClick={onProceedToCalculation}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow transition-all flex items-center gap-1.5 shrink-0"
                    >
                        View Calculated Payroll Table
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
