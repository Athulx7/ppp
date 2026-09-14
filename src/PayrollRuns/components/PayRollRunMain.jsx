import React, { useEffect, useState, useMemo, useCallback } from "react";
import LoadingSpinner from "../../basicComponents/LoadingSpinner";
import { 
    ArrowRight, Calculator, Calendar, CheckCircle2, RefreshCw, 
    ShieldCheck, AlertTriangle, Users, Info, X, ChevronRight, UserX
} from "lucide-react";
import PreFlightChecklist from "./PreFlightChecklist";
import PayrollSummaryCards from "./PayrollSummaryCards";
import PayrollEmployeeTable from "./PayrollEmployeeTable";
import PayrollSuccessView from "./PayrollSuccessView";
import LopAttendanceReviewModal from "./LopAttendanceReviewModal";
import OvertimeReviewModal from "./OvertimeReviewModal";
import AdvanceReviewModal from "./AdvanceReviewModal";
import EmployeePayrollDetailModal from "./EmployeePayrollDetailModal";
import PayrollProcessingModal from "./PayrollProcessingModal";
import AutoRunBanner from "./AutoRunBanner";
import CommonDropDown from "../../basicComponents/CommonDropDown";
import CommonDatePicker from "../../basicComponents/CommonDatePicker";
import CommonModal from "../../basicComponents/CommonModal";
import { ApiCall } from "../../library/constants";

function PayRollRunMain({ isLoading, setIsLoading }) {
    const [currentStep, setCurrentStep] = useState(1);

    const [autoConfig, setAutoConfig] = useState({
        enabled: true,
        scheduled_day: 28,
        cutoff_day: 25,
        calculation_basis: 'calendar_days'
    });

    const currentDate = useMemo(() => new Date(), []);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); 

    const [payrollConfig, setPayrollConfig] = useState({
        month: currentMonth,
        year: currentYear,
        pay_period: 'monthly',
        payment_date: new Date(currentYear, currentMonth, 28).toISOString().split('T')[0]
    });

    const ALL_MONTHS = useMemo(() => [
        { value: 0, label: 'January' },
        { value: 1, label: 'February' },
        { value: 2, label: 'March' },
        { value: 3, label: 'April' },
        { value: 4, label: 'May' },
        { value: 5, label: 'June' },
        { value: 6, label: 'July' },
        { value: 7, label: 'August' },
        { value: 8, label: 'September' },
        { value: 9, label: 'October' },
        { value: 10, label: 'November' },
        { value: 11, label: 'December' }
    ], []);

    const yearOptions = useMemo(() => {
        const years = [];
        for (let y = currentYear - 3; y <= currentYear; y++) {
            years.push({ value: y, label: String(y) });
        }
        return years;
    }, [currentYear]);

    const monthOptions = useMemo(() => {
        return ALL_MONTHS.map(m => {
            const isFuture = payrollConfig.year > currentYear || (payrollConfig.year === currentYear && m.value > currentMonth);
            return {
                ...m,
                disabled: isFuture
            };
        });
    }, [ALL_MONTHS, payrollConfig.year, currentYear, currentMonth]);

    const isFuturePeriod = useMemo(() => {
        return payrollConfig.year > currentYear || (payrollConfig.year === currentYear && payrollConfig.month > currentMonth);
    }, [payrollConfig.year, payrollConfig.month, currentYear, currentMonth])

    useEffect(() => {
        if (payrollConfig.year > currentYear) {
            setPayrollConfig(prev => ({ ...prev, year: currentYear, month: currentMonth }));
        } else if (payrollConfig.year === currentYear && payrollConfig.month > currentMonth) {
            setPayrollConfig(prev => ({ ...prev, month: currentMonth }));
        }
    }, [payrollConfig.year, payrollConfig.month, currentYear, currentMonth]);

    const payPeriodOptions = useMemo(() => [
        { value: 'monthly', label: 'Monthly Full-Time' },
        { value: 'contract', label: 'Contractor (Timesheet)' }
    ], []);

    const [employees, setEmployees] = useState([]);
    const [unmappedEmployees, setUnmappedEmployees] = useState([]);
    const [periodInfo, setPeriodInfo] = useState(null);
    const [summaryMetrics, setSummaryMetrics] = useState({});

    const [verificationStatus, setVerificationStatus] = useState({
        attendance_lop: { verified: false, verifiedAt: null },
        overtime_variable: { verified: false, verifiedAt: null },
        advances_loans: { verified: false, verifiedAt: null },
        statutory_compliance: { verified: false, verifiedAt: null },
        employee_status: { verified: false, verifiedAt: null }
    });

    const [modals, setModals] = useState({
        lop: false,
        ot: false,
        advance: false,
        employeeDetail: false,
        processing: false,
        unmappedView: false
    });
    const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState(null);

    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingMessage, setProcessingMessage] = useState('');
    const [runResult, setRunResult] = useState(null);

    useEffect(() => {
        const fetchAutoConfig = async () => {
            try {
                const res = await ApiCall('get', '/payroll/auto-run-config');
                if (res?.data?.success && res.data.data) {
                    setAutoConfig(res.data.data);
                }
            } catch (err) {
                console.error("Failed to load auto-run config:", err);
            }
        };
        fetchAutoConfig();
    }, []);

    const fetchPreflightData = useCallback(async () => {
        if (isFuturePeriod) {
            setEmployees([]);
            setUnmappedEmployees([]);
            setPeriodInfo({ is_future_period: true });
            setSummaryMetrics({});
            return;
        }

        setIsLoading(prev => ({ ...prev, normal: true }));
        try {
            const m = payrollConfig.month + 1;
            const y = payrollConfig.year;
            const res = await ApiCall('get', `/payroll/preflight-checks?month=${m}&year=${y}`);
            if (res?.data?.success && res.data.data) {
                const { employees: fetchedEmployees, unmapped_employees, metrics, period } = res.data.data;
                setEmployees(fetchedEmployees || []);
                setUnmappedEmployees(unmapped_employees || []);
                setPeriodInfo(period || null);
                if (metrics) {
                    setSummaryMetrics(metrics);
                }
            }
        } catch (err) {
            console.error("Failed to fetch preflight data from backend:", err);
        } finally {
            setIsLoading(prev => ({ ...prev, normal: false }));
        }
    }, [isFuturePeriod, payrollConfig.month, payrollConfig.year, setIsLoading]);

    useEffect(() => {
        fetchPreflightData();
    }, [fetchPreflightData]);

    const calculateSummaryMetrics = useCallback(() => {
        const selected = employees.filter(e => e.selected);

        const metrics = {
            total_salary: selected.reduce((sum, e) => sum + (e.gross_salary || 0), 0),
            total_lop_deductions: selected.reduce((sum, e) => sum + (e.lop_deduction || 0), 0),
            total_overtime_pay: selected.reduce((sum, e) => sum + (e.overtime_pay || 0), 0),
            total_deductions: selected.reduce((sum, e) => sum + (e.total_deductions || 0), 0),
            net_payable: selected.reduce((sum, e) => sum + (e.net_pay || 0), 0),
            employer_contribution: selected.reduce((sum, e) => sum + (e.employer_total || 0), 0),

            lopEmployeeCount: selected.filter(e => (e.lop_days || 0) > 0).length,
            totalLopDays: selected.reduce((sum, e) => sum + (e.lop_days || 0), 0),
            otEmployeeCount: selected.filter(e => (e.overtime_hours || 0) > 0).length,
            totalOtHours: selected.reduce((sum, e) => sum + (e.overtime_hours || 0), 0),
            advanceCount: selected.filter(e => (e.advance_recovery || 0) > 0 || (e.loan_recovery || 0) > 0).length,
            totalAdvances: selected.reduce((sum, e) => sum + (e.advance_recovery || 0) + (e.loan_recovery || 0), 0),
            pfCount: selected.filter(e => (e.pf || 0) > 0).length,
            esiCount: selected.filter(e => (e.esi || 0) > 0).length,
            totalStatutory: selected.reduce((sum, e) => sum + (e.pf || 0) + (e.esi || 0) + (e.professional_tax || 0) + (e.tds || 0), 0),
            activeCount: selected.filter(e => e.status === 'active').length,
            holdCount: employees.filter(e => e.status === 'hold').length,
            unmappedCount: unmappedEmployees.length
        };

        setSummaryMetrics(metrics);
    }, [employees, unmappedEmployees.length]);

    useEffect(() => {
        calculateSummaryMetrics();
    }, [calculateSummaryMetrics]);

    const handleUpdateEmployeeLop = (empId, newLopDays) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === empId || emp.employee_code === empId) {
                const totalDays = emp.working_days || 30;
                const perDay = (emp.gross_salary || 0) / totalDays;
                const newDeduction = Math.round(perDay * newLopDays);
                const diff = newDeduction - (emp.lop_deduction || 0);

                return {
                    ...emp,
                    lop_days: newLopDays,
                    present_days: Math.max(0, totalDays - newLopDays - (emp.leave_days || 0)),
                    lop_deduction: newDeduction,
                    total_deductions: Math.max(0, (emp.total_deductions || 0) + diff),
                    net_pay: Math.max(0, (emp.net_pay || 0) - diff)
                };
            }
            return emp;
        }));
    };

    const handleUpdateEmployeeOt = (empId, newOtHours) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === empId || emp.employee_code === empId) {
                const hourlyRate = ((emp.gross_salary || 0) / 30 / 8) * 1.5;
                const newOtPay = Math.round(hourlyRate * newOtHours);
                const diff = newOtPay - (emp.overtime_pay || 0);

                return {
                    ...emp,
                    overtime_hours: newOtHours,
                    overtime_pay: newOtPay,
                    net_pay: Math.max(0, (emp.net_pay || 0) + diff)
                };
            }
            return emp;
        }));
    };

    const handleToggleSelectEmployee = (empId) => {
        setEmployees(prev => prev.map(emp =>
            emp.id === empId ? { ...emp, selected: !emp.selected } : emp
        ));
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setEmployees(prev => prev.map(emp => ({ ...emp, selected: checked })));
    };

    const handleToggleHoldStatus = (empId) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === empId) {
                const newStatus = emp.status === 'hold' ? 'active' : 'hold';
                return { ...emp, status: newStatus, selected: newStatus === 'active' };
            }
            return emp;
        }));
    };

    const executePayroll = async () => {
        if (isFuturePeriod) {
            alert("Future payroll runs are disabled. Cannot run payroll for an upcoming period.");
            return;
        }

        const selectedEmployees = employees.filter(e => e.selected);
        if (selectedEmployees.length === 0) {
            alert("No employees selected for this payroll run. Please select at least one employee.");
            return;
        }

        setModals(prev => ({ ...prev, processing: true }));
        setProcessingProgress(20);
        setProcessingMessage('Connecting to Tenant Database & Verifying Period...');

        try {
            setProcessingProgress(45);
            setProcessingMessage('Syncing Attendance, LOP & Overtime Calculations...');

            const payload = {
                month: payrollConfig.month + 1,
                year: payrollConfig.year,
                payment_date: payrollConfig.payment_date,
                run_type: 'manual',
                allow_override: true,
                employees: selectedEmployees
            };

            setProcessingProgress(75);
            setProcessingMessage('Applying Statutory Deductions, Advances & Committing Records...');

            const response = await ApiCall('post', '/payroll/run', payload);

            if (response?.data?.success) {
                setProcessingProgress(100);
                setProcessingMessage('Finalizing Batch Run & Generating Payout Sheet...');

                const result = response.data.data;
                setTimeout(() => {
                    setModals(prev => ({ ...prev, processing: false }));
                    setRunResult({
                        run_id: result.run_id || result.payroll_run_code,
                        employee_count: result.employee_count,
                        total_net: result.total_net,
                        payment_date: result.payment_date || payrollConfig.payment_date,
                        periodName: result.periodName || `${monthOptions[payrollConfig.month]?.label} ${payrollConfig.year}`,
                        employees: selectedEmployees
                    });
                    setCurrentStep(4);
                }, 800);
            } else {
                throw new Error(response?.data?.message || 'Payroll run execution failed');
            }
        } catch (err) {
            console.error("Execute Payroll Error:", err);
            setModals(prev => ({ ...prev, processing: false }));
            alert(`Payroll Run Failed: ${err?.data?.message || err?.message || 'Transaction could not be completed'}`);
        }
    };

    const allVerified = Object.values(verificationStatus).every(v => v.verified);
    const selectedCount = employees.filter(e => e.selected).length;
    const isAllSelected = selectedCount === employees.length && employees.length > 0;

    return (
        <>
            {currentStep < 4 && (
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                        {[1, 2, 3].map(step => (
                            <React.Fragment key={step}>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${currentStep === step
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : currentStep > step
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px]">{step}</div>}
                                    <span className="hidden sm:inline">
                                        {step === 1 ? 'Configuration' : step === 2 ? 'Pre-Flight Checks' : 'Review & Execute'}
                                    </span>
                                </div>
                                {step < 3 && <div className={`w-4 sm:w-8 h-0.5 ${currentStep > step ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                        ))}
                    </div>

                    <div>
                        {currentStep === 1 && (
                            <div className="flex items-center gap-3">
                                {isFuturePeriod && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-lg">
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                        <span>Future Period Disabled</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    disabled={employees.length === 0 || isFuturePeriod}
                                    className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${employees.length > 0 && !isFuturePeriod ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    Start Pre-Flight Checks <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {currentStep === 2 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setCurrentStep(3)}
                                    disabled={!allVerified}
                                    className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${allVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    Review Computed Payroll <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={executePayroll}
                                    disabled={selectedCount === 0}
                                    className={`px-5 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 ${selectedCount > 0 ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <ShieldCheck className="w-5 h-5" /> Execute & Finalize Payroll
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                    <AutoRunBanner
                        autoConfig={autoConfig}
                        currentMonth={payrollConfig.month}
                        currentYear={payrollConfig.year}
                    />

                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-indigo-600" />
                                Select Payroll Period & Target
                            </h3>
                            <button
                                onClick={fetchPreflightData}
                                disabled={isFuturePeriod}
                                className={`text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${isFuturePeriod
                                    ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                                    : 'text-indigo-600 hover:text-indigo-800 bg-indigo-50 border-indigo-200'
                                    }`}
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Sync Latest DB Records
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            <CommonDropDown
                                label="Processing Month"
                                required
                                options={monthOptions}
                                value={payrollConfig.month}
                                onChange={(val) => setPayrollConfig(prev => ({ ...prev, month: Number(val) }))}
                                placeholder="Select Month"
                                showSearch={false}
                            />
                            <CommonDropDown
                                label="Processing Year"
                                required
                                options={yearOptions}
                                value={payrollConfig.year}
                                onChange={(val) => setPayrollConfig(prev => ({ ...prev, year: Number(val) }))}
                                placeholder="Select Year"
                                showSearch={false}
                            />
                            <CommonDropDown
                                label="Pay Group / Frequency"
                                required
                                options={payPeriodOptions}
                                value={payrollConfig.pay_period}
                                onChange={(val) => setPayrollConfig(prev => ({ ...prev, pay_period: val }))}
                                placeholder="Select Pay Period"
                                showSearch={false}
                            />
                            <CommonDatePicker
                                label="Target Payment Date"
                                required
                                value={payrollConfig.payment_date}
                                onChange={(dateStr) => setPayrollConfig(prev => ({ ...prev, payment_date: dateStr }))}
                                placeholder="Select Payment Date"
                            />
                        </div>

                        {isFuturePeriod && (
                            <div className="mt-4 bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-800">
                                    <p className="font-semibold text-amber-900 text-sm">
                                        Future Payroll Runs Disabled
                                    </p>
                                    <p className="mt-0.5 leading-relaxed">
                                        Payroll runs cannot be processed for upcoming periods ({ALL_MONTHS[payrollConfig.month]?.label} {payrollConfig.year}). Biometric punches, leave reconciliations, overtime logs, and statutory deductions have not yet finalized. Please select the current month ({ALL_MONTHS[currentMonth]?.label} {currentYear}) or a past period to proceed.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                    <Users className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-800 font-medium">Mapped Eligible Employees</p>
                                    <p className="text-base font-bold text-emerald-950">{employees.length} Ready for Run</p>
                                </div>
                            </div>

                            <div className={`rounded-xl p-3.5 flex items-center gap-3 border transition-all ${unmappedEmployees.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${unmappedEmployees.length > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-200 text-gray-600'}`}>
                                    <UserX className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-amber-800 font-medium">Unmapped Employees Excluded</p>
                                    <p className="text-base font-bold text-amber-950">{unmappedEmployees.length} Excluded</p>
                                </div>
                                {unmappedEmployees.length > 0 && (
                                    <button
                                        onClick={() => setModals(prev => ({ ...prev, unmappedView: true }))}
                                        className="text-xs text-amber-800 underline font-semibold hover:text-amber-950 flex items-center gap-0.5"
                                    >
                                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-indigo-800 font-medium">Total Working Days</p>
                                    <p className="text-base font-bold text-indigo-950">{periodInfo?.total_working_days || 30} Days ({autoConfig.calculation_basis || 'calendar'})</p>
                                </div>
                            </div>
                        </div>

                        {/* Unmapped Employees Warning Banner */}
                        {unmappedEmployees.length > 0 && (
                            <div className="mt-4 bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="flex-1 text-xs text-amber-800">
                                    <p className="font-semibold text-amber-900">
                                        Active Structure Mapping Safeguard Active
                                    </p>
                                    <p className="mt-0.5 leading-relaxed">
                                        {unmappedEmployees.length} active employee(s) in this tenant database do not have an active salary structure assigned. To safeguard payroll integrity, they are <strong>excluded</strong> from this payroll calculation and won&apos;t appear with zero or corrupted totals.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setModals(prev => ({ ...prev, unmappedView: true }))}
                                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold shrink-0 transition-all"
                                >
                                    View Excluded Staff
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* STEP 2: Pre-Flight Checklist */}
            {currentStep === 2 && (
                <div className="animate-fadeIn">
                    <PreFlightChecklist
                        verificationStatus={verificationStatus}
                        setVerificationStatus={setVerificationStatus}
                        metrics={summaryMetrics}
                        featureFlags={periodInfo?.feature_flags || summaryMetrics?.feature_flags}
                        allVerified={allVerified}
                        onProceedToCalculation={() => setCurrentStep(3)}
                        onOpenLopModal={() => setModals(prev => ({ ...prev, lop: true }))}
                        onOpenOtModal={() => setModals(prev => ({ ...prev, ot: true }))}
                        onOpenAdvanceModal={() => setModals(prev => ({ ...prev, advance: true }))}
                    />
                </div>
            )}

            {/* STEP 3: Review & Execution Table */}
            {currentStep === 3 && (
                <div className="animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-indigo-600" />
                            Computed Payroll Review ({monthOptions[payrollConfig.month]?.label} {payrollConfig.year})
                        </h3>
                        <button
                            onClick={calculateSummaryMetrics}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200"
                        >
                            <RefreshCw className="w-3.5 h-3.5" /> Recalculate Totals
                        </button>
                    </div>

                    <PayrollSummaryCards
                        summary={summaryMetrics}
                        selectedCount={selectedCount}
                        totalCount={employees.length}
                    />

                    <PayrollEmployeeTable
                        employees={employees}
                        onToggleSelectEmployee={handleToggleSelectEmployee}
                        onSelectAll={handleSelectAll}
                        selectAll={isAllSelected}
                        onViewDetail={(emp) => {
                            setSelectedEmployeeForDetail(emp);
                            setModals(prev => ({ ...prev, employeeDetail: true }));
                        }}
                        onToggleHoldStatus={handleToggleHoldStatus}
                    />
                </div>
            )}

            {/* STEP 4: Success View */}
            {currentStep === 4 && runResult && (
                <PayrollSuccessView
                    runResult={runResult}
                    onResetToNewRun={() => {
                        setCurrentStep(1);
                        setVerificationStatus({
                            attendance_lop: { verified: false, verifiedAt: null },
                            overtime_variable: { verified: false, verifiedAt: null },
                            advances_loans: { verified: false, verifiedAt: null },
                            statutory_compliance: { verified: false, verifiedAt: null },
                            employee_status: { verified: false, verifiedAt: null }
                        });
                        setRunResult(null);
                        fetchPreflightData();
                    }}
                />
            )}

            {/* ---- MODALS ---- */}

            <LopAttendanceReviewModal
                isOpen={modals.lop}
                onClose={() => setModals(prev => ({ ...prev, lop: false }))}
                employees={employees}
                month={payrollConfig.month + 1}
                year={payrollConfig.year}
                onUpdateEmployeeLop={handleUpdateEmployeeLop}
                onConfirmVerification={() => {
                    setVerificationStatus(prev => ({
                        ...prev,
                        attendance_lop: {
                            verified: true,
                            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    }));
                }}
            />

            <OvertimeReviewModal
                isOpen={modals.ot}
                onClose={() => setModals(prev => ({ ...prev, ot: false }))}
                employees={employees}
                month={payrollConfig.month + 1}
                year={payrollConfig.year}
                onUpdateEmployeeOt={handleUpdateEmployeeOt}
                onConfirmVerification={() => {
                    setVerificationStatus(prev => ({
                        ...prev,
                        overtime_variable: {
                            verified: true,
                            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    }));
                }}
            />

            <AdvanceReviewModal
                isOpen={modals.advance}
                onClose={() => setModals(prev => ({ ...prev, advance: false }))}
                employees={employees}
                month={payrollConfig.month + 1}
                year={payrollConfig.year}
                onConfirmVerification={() => {
                    setVerificationStatus(prev => ({
                        ...prev,
                        advances_loans: {
                            verified: true,
                            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                    }));
                }}
            />

            <EmployeePayrollDetailModal
                isOpen={modals.employeeDetail}
                onClose={() => setModals(prev => ({ ...prev, employeeDetail: false }))}
                employee={selectedEmployeeForDetail}
            />

            <PayrollProcessingModal
                isOpen={modals.processing}
                progress={processingProgress}
                stepMessage={processingMessage}
            />

            {/* Modal to Inspect Excluded Unmapped Employees */}
            <CommonModal
                isOpen={modals.unmappedView}
                onClose={() => setModals(prev => ({ ...prev, unmappedView: false }))}
                size="xl"
                title={`Unmapped Employees Excluded from Payroll (${unmappedEmployees.length})`}
            >
                <div className="p-5 space-y-4">
                    <p className="text-xs text-gray-500 leading-relaxed">
                        These employees do not currently have an active salary structure assigned directly or through their designation. Map their salary structures in <strong>Salary Structure &gt; Assignments</strong> to include them in future payroll runs.
                    </p>

                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                                <tr>
                                    <th className="py-2.5 px-3">Emp Code</th>
                                    <th className="py-2.5 px-3">Name</th>
                                    <th className="py-2.5 px-3">Department</th>
                                    <th className="py-2.5 px-3">Designation</th>
                                    <th className="py-2.5 px-3">Exclusion Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {unmappedEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50/70">
                                        <td className="py-2 px-3 font-mono font-bold text-gray-800">{emp.id}</td>
                                        <td className="py-2 px-3 text-gray-900 font-medium">{emp.name}</td>
                                        <td className="py-2 px-3 text-gray-600">{emp.department}</td>
                                        <td className="py-2 px-3 text-gray-600">{emp.designation}</td>
                                        <td className="py-2 px-3 text-amber-700 font-medium">{emp.reason}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CommonModal>

            {isLoading.spinner && <LoadingSpinner />}
        </>
    );
}

export default PayRollRunMain;