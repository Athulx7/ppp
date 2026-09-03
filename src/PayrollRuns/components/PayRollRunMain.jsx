import React, { useEffect, useState, useMemo } from "react";
import LoadingSpinner from "../../basicComponents/LoadingSpinner"
import { ArrowRight, Calculator, Calendar, CheckCircle2, RefreshCw, ShieldCheck } from "lucide-react";
import PreFlightChecklist from "./PreFlightChecklist";
import PayrollSummaryCards from "./PayrollSummaryCards";
import PayrollEmployeeTable from "./PayrollEmployeeTable";
import PayrollSuccessView from "./PayrollSuccessView";
import LopAttendanceReviewModal from "./LopAttendanceReviewModal";
import OvertimeReviewModal from "./OvertimeReviewModal";
import AdvanceReviewModal from "./AdvanceReviewModal";
import EmployeePayrollDetailModal from "./EmployeePayrollDetailModal";
import PayrollProcessingModal from "./PayrollProcessingModal";
import CommonDropDown from "../../basicComponents/CommonDropDown";
import CommonDatePicker from "../../basicComponents/CommonDatePicker";

function PayRollRunMain({ isLoading, setIsLoading }) {
    const [currentStep, setCurrentStep] = useState(1);

    // Auto-Run Backend Config (Simulated from Tenant DB)
    const [autoConfig, setAutoConfig] = useState({
        enabled: true,
        scheduled_day: 28,
        cutoff_day: 25
    });

    const [payrollConfig, setPayrollConfig] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        pay_period: 'monthly',
        payment_date: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString().split('T')[0]
    });

    const monthOptions = useMemo(() => [
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

    const yearOptions = useMemo(() => [
        { value: 2023, label: '2023' },
        { value: 2024, label: '2024' },
        { value: 2025, label: '2025' },
        { value: 2026, label: '2026' }
    ], []);

    const payPeriodOptions = useMemo(() => [
        { value: 'monthly', label: 'Monthly Full-Time' },
        { value: 'contract', label: 'Contractor (Timesheet)' }
    ], []);

    const [employees, setEmployees] = useState([]);

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
        processing: false
    });
    const [selectedEmployeeForDetail, setSelectedEmployeeForDetail] = useState(null);

    const [processingProgress, setProcessingProgress] = useState(0);
    const [processingMessage, setProcessingMessage] = useState('');
    const [runResult, setRunResult] = useState(null);

    useEffect(() => {
        generateDummyData();
    }, []);

    useEffect(() => {
        calculateSummaryMetrics();
    }, [employees]);

    const generateDummyData = () => {
        const dummyEmployees = [];
        const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
        const statuses = ['active', 'hold', 'resigned'];

        for (let i = 1; i <= 150; i++) {
            const baseSalary = Math.floor(Math.random() * 150000) + 25000;
            const variablePay = Math.floor(baseSalary * (Math.random() * 0.2));
            const status = Math.random() > 0.9 ? statuses[Math.floor(Math.random() * 3)] : 'active';

            const lopDays = status === 'active' ? (Math.random() > 0.8 ? Math.floor(Math.random() * 4) : 0) : 0;
            const lopDeduction = Math.floor((baseSalary / 30) * lopDays);

            const overtimeHours = Math.random() > 0.85 ? Math.floor(Math.random() * 15) + 5 : 0;
            const overtimePay = Math.floor((baseSalary / 30 / 8) * 1.5 * overtimeHours);

            const advanceRecovery = Math.random() > 0.9 ? 5000 : 0;
            const loanRecovery = Math.random() > 0.95 ? 8000 : 0;

            const pf = Math.floor(baseSalary * 0.12);
            const esi = baseSalary <= 21000 ? Math.floor(baseSalary * 0.0075) : 0;
            const professionalTax = 200;
            const tds = Math.floor(baseSalary * 0.05);

            const totalDeductions = lopDeduction + pf + esi + professionalTax + tds + advanceRecovery + loanRecovery;
            const grossSalary = baseSalary + variablePay;
            const netPay = grossSalary + overtimePay - totalDeductions;

            dummyEmployees.push({
                id: `EMP${String(i).padStart(3, '0')}`,
                name: `Employee ${i}`,
                department: departments[Math.floor(Math.random() * departments.length)],
                designation: 'Software Engineer',
                status: status,
                selected: status === 'active',

                working_days: 30,
                present_days: 30 - lopDays,
                leave_days: 0,
                lop_days: lopDays,
                gross_salary: grossSalary,
                basic: Math.floor(baseSalary * 0.5),
                hra: Math.floor(baseSalary * 0.4),
                conveyance: 1600,
                medical: 1250,
                special: Math.floor(baseSalary * 0.1),
                variable_pay: variablePay,
                overtime_hours: overtimeHours,
                overtime_pay: overtimePay,

                lop_deduction: lopDeduction,
                pf: pf,
                esi: esi,
                professional_tax: professionalTax,
                tds: tds,
                advance_recovery: advanceRecovery,
                loan_recovery: loanRecovery,
                total_deductions: totalDeductions,

                net_pay: netPay,

                employer_pf: pf,
                employer_esi: esi > 0 ? Math.floor(baseSalary * 0.0325) : 0,
                employer_gratuity: Math.floor(baseSalary * 0.0417),
                employer_total: pf + (esi > 0 ? Math.floor(baseSalary * 0.0325) : 0) + Math.floor(baseSalary * 0.0417)
            });
        }
        setEmployees(dummyEmployees);
    };

    const calculateSummaryMetrics = () => {
        const selected = employees.filter(e => e.selected);

        const metrics = {
            total_salary: selected.reduce((sum, e) => sum + e.gross_salary, 0),
            total_lop_deductions: selected.reduce((sum, e) => sum + e.lop_deduction, 0),
            total_overtime_pay: selected.reduce((sum, e) => sum + e.overtime_pay, 0),
            total_deductions: selected.reduce((sum, e) => sum + e.total_deductions, 0),
            net_payable: selected.reduce((sum, e) => sum + e.net_pay, 0),
            employer_contribution: selected.reduce((sum, e) => sum + e.employer_total, 0),

            lopEmployeeCount: selected.filter(e => e.lop_days > 0).length,
            totalLopDays: selected.reduce((sum, e) => sum + e.lop_days, 0),
            otEmployeeCount: selected.filter(e => e.overtime_hours > 0).length,
            totalOtHours: selected.reduce((sum, e) => sum + e.overtime_hours, 0),
            advanceCount: selected.filter(e => e.advance_recovery > 0 || e.loan_recovery > 0).length,
            totalAdvances: selected.reduce((sum, e) => sum + e.advance_recovery + e.loan_recovery, 0),
            pfCount: selected.filter(e => e.pf > 0).length,
            esiCount: selected.filter(e => e.esi > 0).length,
            totalStatutory: selected.reduce((sum, e) => sum + e.pf + e.esi + e.professional_tax + e.tds, 0),
            activeCount: selected.filter(e => e.status === 'active').length,
            holdCount: employees.filter(e => e.status === 'hold').length,
            newJoinersCount: 5
        };

        setSummaryMetrics(metrics);
    };

    const handleUpdateEmployeeLop = (empId, newLopDays) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === empId) {
                const perDay = emp.gross_salary / (emp.working_days || 30);
                const newDeduction = Math.floor(perDay * newLopDays);
                const diff = newDeduction - emp.lop_deduction;

                return {
                    ...emp,
                    lop_days: newLopDays,
                    present_days: (emp.working_days || 30) - newLopDays - emp.leave_days,
                    lop_deduction: newDeduction,
                    total_deductions: emp.total_deductions + diff,
                    net_pay: emp.net_pay - diff
                };
            }
            return emp;
        }));
    };

    const handleUpdateEmployeeOt = (empId, newOtHours) => {
        setEmployees(prev => prev.map(emp => {
            if (emp.id === empId) {
                const hourlyRate = (emp.gross_salary / 30 / 8) * 1.5;
                const newOtPay = Math.floor(hourlyRate * newOtHours);
                const diff = newOtPay - emp.overtime_pay;

                return {
                    ...emp,
                    overtime_hours: newOtHours,
                    overtime_pay: newOtPay,
                    net_pay: emp.net_pay + diff
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

    const executePayroll = () => {
        setModals(prev => ({ ...prev, processing: true }));

        const steps = [
            { p: 15, m: 'Connecting to Tenant Database & Verifying Period...' },
            { p: 35, m: 'Syncing Attendance & Calculating LOP Deductions...' },
            { p: 55, m: 'Computing Overtime & Variable Pay Additions...' },
            { p: 75, m: 'Applying Statutory PF, ESI, PT & TDS Deductions...' },
            { p: 90, m: 'Generating Encrypted Employee Payslip Records...' },
            { p: 100, m: 'Finalizing Batch Run & Generating Bank Payout Sheet...' }
        ];

        steps.forEach((step, index) => {
            setTimeout(() => {
                setProcessingProgress(step.p);
                setProcessingMessage(step.m);

                if (index === steps.length - 1) {
                    setTimeout(() => {
                        setModals(prev => ({ ...prev, processing: false }));
                        setRunResult({
                            run_id: `PR${payrollConfig.year}${String(payrollConfig.month + 1).padStart(2, '0')}${Math.floor(Math.random() * 1000)}`,
                            employee_count: employees.filter(e => e.selected).length,
                            total_net: summaryMetrics.net_payable,
                            payment_date: payrollConfig.payment_date,
                            periodName: `${new Date(0, payrollConfig.month).toLocaleString('default', { month: 'long' })} ${payrollConfig.year}`
                        });
                        setCurrentStep(4);
                    }, 1500);
                }
            }, (index + 1) * 1200);
        });
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
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-bold shadow-sm flex items-center gap-2 transition-all"
                            >
                                Start Pre-Flight Checks <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        {currentStep === 2 && (
                            <button
                                onClick={() => setCurrentStep(3)}
                                disabled={!allVerified}
                                className={`px-5 py-2 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2 transition-all ${allVerified ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Review Computed Payroll <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                        {currentStep === 3 && (
                            <button
                                onClick={executePayroll}
                                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-sm font-bold shadow-lg flex items-center gap-2 transition-all transform hover:scale-105"
                            >
                                <ShieldCheck className="w-5 h-5" /> Execute & Finalize Payroll
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* WIZARD STEP CONTENT */}

            {/* STEP 1: Configuration */}
            {currentStep === 1 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6 pb-32 min-h-[160px] shadow-sm animate-fadeIn">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        Select Payroll Period & Target
                    </h3>

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
                </div>
            )}

            {/* STEP 2: Pre-Flight Checklist */}
            {currentStep === 2 && (
                <div className="animate-fadeIn">
                    <PreFlightChecklist
                        verificationStatus={verificationStatus}
                        setVerificationStatus={setVerificationStatus}
                        metrics={summaryMetrics}
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
                            Computed Payroll Review
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
                    }}
                />
            )}

            {/* ---- MODALS ---- */}

            <LopAttendanceReviewModal
                isOpen={modals.lop}
                onClose={() => setModals(prev => ({ ...prev, lop: false }))}
                employees={employees}
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

            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default PayRollRunMain