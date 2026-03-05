import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Upload, Download, Calendar,
    DollarSign, Percent, Clock, CheckCircle, XCircle,
    AlertCircle, Info, Loader, ChevronDown, Plus, Minus,
    Trash2, Edit, Copy, Search, RefreshCcw, Settings,
    Users, Building, Shield, Zap, Gauge, Sliders,
    Globe, Lock, Briefcase, Filter, ChevronRight,
    Users as UsersIcon, Clock as ClockIcon, Target,
    TrendingUp, Award, PieChart, FileText, DownloadCloud,
    Printer, MessageSquare, Mail, Smartphone, Bell,
    Moon, Sun, Monitor, Palette, Type, Layout,
    Grid, List, ToggleLeft, ToggleRight, Check,
    FolderOpen, FolderTree, Layers, Box, Package,
    Activity, AlertTriangle, ShieldAlert, Fingerprint,
    Power, RefreshCcw as RefreshIcon, Undo, Redo,
    Paperclip, Link2, Unlink, ExternalLink,
    Maximize2, Minimize2, Move, MoreVertical,
    Calendar as CalendarIcon, Clock3, Clock4, Clock9,
    Hourglass, Timer, Sunrise, Sunset, Coffee,
    Moon as MoonIcon, Sun as SunIcon, Cloud as CloudIcon,
    Umbrella, Snowflake, Wind, Droplets, Flame,
    Wallet, CreditCard, Banknote, Receipt, Scale,
    Calculator, LineChart, BarChart as BarChartIcon,
    PieChart as PieChartIcon, CircleDollarSign,
    Landmark, PiggyBank, ShieldCheck, Eye,
    EyeOff, Key, KeyRound, LockKeyhole, UnlockKeyhole, MinusCircle
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonDatePicker from '../basicComponents/CommonDatePicker';
import CommonTable from '../basicComponents/commonTable';
import CommonCheckbox from '../basicComponents/CommonCheckbox';
import CommonBadge from '../basicComponents/CommonBadge';
import CommonSwitch from '../basicComponents/CommonSwitch';

function PayrollSettings() {
    const navigate = useNavigate();
    // Work schedule form states
    const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
    const [workingDays, setWorkingDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
    const [workingHours, setWorkingHours] = useState(9);
    const [overtimeApplicable, setOvertimeApplicable] = useState('no');
    const [overtimeRate, setOvertimeRate] = useState(1.5);
    const [maxOvertimePerDay, setMaxOvertimePerDay] = useState(4);
    const [maxOvertimePerMonth, setMaxOvertimePerMonth] = useState(60);
    const [shiftAllowance, setShiftAllowance] = useState(0);
    const [nightShiftAllowance, setNightShiftAllowance] = useState(0);
    const [holidayAllowance, setHolidayAllowance] = useState(0);

    // Active tab
    const [activeTab, setActiveTab] = useState('general');

    // Loading states
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState(null);

    // Search
    const [searchQuery, setSearchQuery] = useState('');

    // Departments list (from company master)
    const [departments] = useState([
        { id: 1, name: 'Customer Support', code: 'CS' },
        { id: 2, name: 'Software Engineering', code: 'SE' },
        { id: 3, name: 'Sales', code: 'SAL' },
        { id: 4, name: 'Marketing', code: 'MKT' },
        { id: 5, name: 'Human Resources', code: 'HR' },
        { id: 6, name: 'Finance', code: 'FIN' },
        { id: 7, name: 'Operations', code: 'OPS' },
        { id: 8, name: 'Administration', code: 'ADMIN' }
    ]);

    // Designations list
    const [designations] = useState([
        { id: 1, name: 'Customer Support Executive', department: 'Customer Support' },
        { id: 2, name: 'Senior Customer Support', department: 'Customer Support' },
        { id: 3, name: 'Support Team Lead', department: 'Customer Support' },
        { id: 4, name: 'Software Engineer', department: 'Software Engineering' },
        { id: 5, name: 'Senior Software Engineer', department: 'Software Engineering' },
        { id: 6, name: 'Tech Lead', department: 'Software Engineering' },
        { id: 7, name: 'Engineering Manager', department: 'Software Engineering' },
        { id: 8, name: 'Sales Executive', department: 'Sales' },
        { id: 9, name: 'Sales Manager', department: 'Sales' },
        { id: 10, name: 'Marketing Executive', department: 'Marketing' }
    ]);

    // Main settings state
    const [settings, setSettings] = useState({
        // Basic Payroll Settings
        general: {
            payroll_frequency: 'monthly',
            payroll_period: 'calendar_month',
            payroll_start_day: 1,
            payroll_end_day: 31,
            payroll_processing_day: 5,
            salary_calculation_basis: 'calendar_days',
            rounding_method: 'nearest_rupee',
            rounding_precision: 0,
            financial_year_start: '2024-04-01',
            financial_year_end: '2025-03-31',
            currency: 'INR',

            // Auto-run settings
            auto_run_payroll: true,
            auto_run_frequency: 'monthly',
            auto_run_day: 1,
            auto_run_time: '10:00',
            auto_run_include_holidays: false,
            auto_run_notify_before: 2,
            auto_run_notify_after: true,

            // Date range settings
            payroll_date_range: {
                type: 'fixed_range', // fixed_range, last_day, custom
                start_day: 1,
                end_day: 31,
                include_current_month: true,
                cut_off_day: 25
            }
        },

        // Department-wise Work Schedule
        department_schedules: [
            {
                id: 1,
                department: 'Customer Support',
                work_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                off_days: ['sunday'],
                working_hours_per_day: 9,
                overtime_applicable: true,
                overtime_rate: 2.0,
                shift_allowance_applicable: true,
                shift_allowance_amount: 200,
                night_shift_allowance: 250,
                holiday_work_allowance: 500
            },
            {
                id: 2,
                department: 'Software Engineering',
                work_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                off_days: ['saturday', 'sunday'],
                working_hours_per_day: 9,
                overtime_applicable: true,
                overtime_rate: 1.5,
                shift_allowance_applicable: false,
                shift_allowance_amount: 0,
                night_shift_allowance: 0,
                holiday_work_allowance: 0
            },
            {
                id: 3,
                department: 'Sales',
                work_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
                off_days: ['sunday'],
                working_hours_per_day: 9,
                overtime_applicable: true,
                overtime_rate: 1.5,
                shift_allowance_applicable: true,
                shift_allowance_amount: 150,
                night_shift_allowance: 200,
                holiday_work_allowance: 400
            },
            {
                id: 4,
                department: 'Marketing',
                work_week: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                off_days: ['saturday', 'sunday'],
                working_hours_per_day: 8,
                overtime_applicable: false,
                overtime_rate: 0,
                shift_allowance_applicable: false,
                shift_allowance_amount: 0,
                night_shift_allowance: 0,
                holiday_work_allowance: 0
            }
        ],

        // Designation-wise Settings (optional override)
        designation_settings: [
            {
                id: 1,
                designation: 'Senior Customer Support',
                department: 'Customer Support',
                overtime_applicable: true,
                overtime_rate: 2.5,
                shift_allowance_amount: 250,
                special_allowance: 1000
            },
            {
                id: 2,
                designation: 'Tech Lead',
                department: 'Software Engineering',
                overtime_applicable: false,
                overtime_rate: 0,
                shift_allowance_amount: 0,
                special_allowance: 5000
            }
        ],

        // Salary Advance Settings
        salary_advance: {
            enabled: true,

            // General rules
            max_advance_percentage: 50, // % of monthly salary
            min_advance_amount: 1000,
            max_advance_amount: 50000,
            advance_processing_fee: 100,
            interest_rate: 0, // 0% interest

            // Eligibility rules
            eligibility_criteria: 'completed_probation', // immediate, completed_probation, completed_months
            minimum_service_months: 6,
            maximum_advances_per_month: 1,
            maximum_advances_per_year: 3,

            // Recovery rules
            recovery_start_month: 'next_month', // current_month, next_month
            recovery_tenure_months: 6,
            recovery_method: 'equal_installments', // equal_installments, custom_percentage
            recovery_percentage: 10, // if custom_percentage

            // Approval workflow
            approval_required: true,
            approval_levels: 2,
            auto_approve_upto: 10000,

            // Department-wise limits (override)
            department_limits: [
                {
                    department: 'Customer Support',
                    max_advance_percentage: 40,
                    max_advance_amount: 30000,
                    min_service_months: 3
                },
                {
                    department: 'Software Engineering',
                    max_advance_percentage: 60,
                    max_advance_amount: 75000,
                    min_service_months: 6
                },
                {
                    department: 'Sales',
                    max_advance_percentage: 50,
                    max_advance_amount: 50000,
                    min_service_months: 6
                }
            ],

            // Designation-wise limits
            designation_limits: [
                {
                    designation: 'Software Engineer',
                    max_advance_amount: 50000
                },
                {
                    designation: 'Senior Software Engineer',
                    max_advance_amount: 75000
                },
                {
                    designation: 'Tech Lead',
                    max_advance_amount: 100000
                }
            ],

            // Blackout periods (no advances during these times)
            blackout_periods: [
                {
                    start_month: 3, // March
                    start_day: 1,
                    end_month: 3,
                    end_day: 31,
                    reason: 'Financial Year End'
                }
            ]
        },

        // Overtime Settings
        overtime_settings: {
            enabled: true,
            calculation_type: 'daily', // daily, weekly, monthly
            overtime_threshold: 9, // hours per day
            weekly_overtime_threshold: 48, // hours per week

            // Rates (multiplier of hourly wage)
            normal_overtime_rate: 2.0,
            holiday_overtime_rate: 2.5,
            weekly_off_overtime_rate: 2.5,
            night_shift_overtime_rate: 2.5,

            // Department-wise overtime applicability
            department_overtime: [
                { department: 'Customer Support', applicable: true, max_hours_per_day: 4, max_hours_per_month: 60 },
                { department: 'Software Engineering', applicable: true, max_hours_per_day: 3, max_hours_per_month: 40 },
                { department: 'Sales', applicable: true, max_hours_per_day: 4, max_hours_per_month: 50 },
                { department: 'Marketing', applicable: false, max_hours_per_day: 0, max_hours_per_month: 0 }
            ],

            // Approval required
            approval_required: true,
            approval_level: 'manager' // manager, hr, both
        },

        // LOP (Loss of Pay) Settings
        lop_settings: {
            enabled: true,
            calculation_basis: 'calendar_days', // calendar_days, working_days
            consider_leave_balance: true,
            auto_apply_lop: true,

            // Leave balance rules
            leave_balance_priority: ['privilege_leave', 'casual_leave', 'sick_leave'],
            allow_negative_leave_balance: false,
            lop_after_exhausting_leave: true,

            // Department-wise LOP rules
            department_lop: [
                {
                    department: 'Customer Support',
                    grace_period_minutes: 15,
                    half_day_threshold_minutes: 240,
                    full_day_absence_minutes: 480,
                    consider_late_marks: true
                },
                {
                    department: 'Software Engineering',
                    grace_period_minutes: 30,
                    half_day_threshold_minutes: 240,
                    full_day_absence_minutes: 480,
                    consider_late_marks: false
                }
            ]
        },

        // Payroll Components Settings
        payroll_components: {
            // Earnings components enabled
            earnings: [
                { name: 'Basic', enabled: true, mandatory: true, taxable: true },
                { name: 'House Rent Allowance', enabled: true, mandatory: true, taxable: true },
                { name: 'Conveyance Allowance', enabled: true, mandatory: true, taxable: false },
                { name: 'Medical Allowance', enabled: true, mandatory: true, taxable: false },
                { name: 'Special Allowance', enabled: true, mandatory: false, taxable: true },
                { name: 'Performance Bonus', enabled: true, mandatory: false, taxable: true },
                { name: 'Sales Commission', enabled: true, mandatory: false, taxable: true },
                { name: 'Shift Allowance', enabled: true, mandatory: false, taxable: true },
                { name: 'Overtime Wages', enabled: true, mandatory: false, taxable: true }
            ],

            // Deductions components enabled
            deductions: [
                { name: 'Provident Fund', enabled: true, mandatory: true },
                { name: 'Employee State Insurance', enabled: true, mandatory: true },
                { name: 'Professional Tax', enabled: true, mandatory: true },
                { name: 'Income Tax', enabled: true, mandatory: true },
                { name: 'Loan Recovery', enabled: true, mandatory: false },
                { name: 'Salary Advance', enabled: true, mandatory: false },
                { name: 'Voluntary PF', enabled: false, mandatory: false }
            ]
        },

        // Statutory Settings
        statutory: {
            pf_applicable: true,
            pf_limit: 15000,
            esi_applicable: true,
            esi_limit: 21000,
            professional_tax_applicable: true,
            professional_tax_state: 'Maharashtra',
            tds_applicable: true,
            gratuity_applicable: true,
            bonus_applicable: true
        },

        // Payment Settings
        payment_settings: {
            payment_mode: 'bank_transfer', // bank_transfer, cheque, cash
            payment_date_type: 'fixed_date', // fixed_date, last_day, custom
            payment_fixed_date: 7,
            bank_file_format: 'sbi_collect',
            auto_generate_bank_file: true,
            payment_advice_format: 'pdf',
            auto_send_payslip: true,
            payslip_delivery: ['email'], // email, sms, whatsapp, app
            payment_approval_required: true,
            payment_approval_levels: 2
        },

        // Notification Settings
        notifications: {
            payroll_processed: { email: true, sms: false, push: true },
            payslip_generated: { email: true, sms: false, push: true },
            payment_initiated: { email: true, sms: true, push: true },
            payment_failed: { email: true, sms: true, push: true },
            approval_pending: { email: true, sms: false, push: true },
            advance_approved: { email: true, sms: true, push: true },
            advance_rejected: { email: true, sms: true, push: true },
            lop_applied: { email: true, sms: false, push: true }
        }
    });

    // Tabs configuration (simplified)
    const tabs = [
        { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
        { id: 'schedules', label: 'Work Schedules', icon: <Clock className="w-4 h-4" /> },
        { id: 'advance', label: 'Salary Advance', icon: <Wallet className="w-4 h-4" /> },
        { id: 'overtime', label: 'Overtime', icon: <Timer className="w-4 h-4" /> },
        { id: 'lop', label: 'LOP Rules', icon: <MinusCircle className="w-4 h-4" /> },
        { id: 'components', label: 'Payroll Components', icon: <PieChart className="w-4 h-4" /> },
        { id: 'statutory', label: 'Statutory', icon: <Shield className="w-4 h-4" /> },
        { id: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> }
    ];

    // Week days for selection
    const weekDays = [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' }
    ];

    // Handle select all departments
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const handleSelectAllDepartments = () => {
        if (selectedDepartments.length === departments.length) {
            setSelectedDepartments([]);
        } else {
            setSelectedDepartments(departments.map(d => d.name));
        }
    };

    // Handle multiple department selection
    const handleDepartmentSelect = (deptName) => {
        if (selectedDepartments.includes(deptName)) {
            setSelectedDepartments(selectedDepartments.filter(d => d !== deptName));
        } else {
            setSelectedDepartments([...selectedDepartments, deptName]);
        }
    };

    // Handle save settings
    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        setSaveError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            setSaveError('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Payroll', to: '/payroll' },
                    { label: 'Settings' }
                ]}
                title="Payroll Settings"
                description="Configure payroll rules, work schedules, and advance limits"
                actions={
                    <div className="flex items-center gap-2">
                        {saveSuccess && (
                            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm">Saved successfully</span>
                            </div>
                        )}

                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 text-sm ${isSaving
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Settings
                                </>
                            )}
                        </button>
                    </div>
                }
            />

            {/* Settings Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search settings..."
                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full md:w-96"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Settings Tabs */}
            <div className="bg-white rounded-xl shadow-sm mb-4 overflow-x-auto">
                <div className="flex border-b min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Settings Content */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Payroll Processing Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <CommonDropDown
                                    label="Payroll Frequency"
                                    value={settings.general.payroll_frequency}
                                    onChange={(val) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, payroll_frequency: val }
                                    })}
                                    options={[
                                        { value: 'weekly', label: 'Weekly' },
                                        { value: 'biweekly', label: 'Bi-Weekly' },
                                        { value: 'monthly', label: 'Monthly' }
                                    ]}
                                />

                                <CommonInputField
                                    label="Payroll Start Day"
                                    type="number"
                                    value={settings.general.payroll_start_day}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, payroll_start_day: parseInt(e.target.value) }
                                    })}
                                    min="1"
                                    max="31"
                                />

                                <CommonInputField
                                    label="Payroll End Day"
                                    type="number"
                                    value={settings.general.payroll_end_day}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, payroll_end_day: parseInt(e.target.value) }
                                    })}
                                    min="1"
                                    max="31"
                                />

                                <CommonInputField
                                    label="Processing Day (of month)"
                                    type="number"
                                    value={settings.general.payroll_processing_day}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, payroll_processing_day: parseInt(e.target.value) }
                                    })}
                                    min="1"
                                    max="28"
                                />

                                <CommonDropDown
                                    label="Calculation Basis"
                                    value={settings.general.salary_calculation_basis}
                                    onChange={(val) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, salary_calculation_basis: val }
                                    })}
                                    options={[
                                        { value: 'calendar_days', label: 'Calendar Days' },
                                        { value: 'working_days', label: 'Working Days' },
                                        { value: '30_days', label: '30 Days Fixed' }
                                    ]}
                                />

                                <CommonDropDown
                                    label="Rounding Method"
                                    value={settings.general.rounding_method}
                                    onChange={(val) => setSettings({
                                        ...settings,
                                        general: { ...settings.general, rounding_method: val }
                                    })}
                                    options={[
                                        { value: 'nearest_rupee', label: 'Nearest Rupee' },
                                        { value: 'nearest_5', label: 'Nearest 5 Rupees' },
                                        { value: 'nearest_10', label: 'Nearest 10 Rupees' },
                                        { value: 'floor', label: 'Floor' },
                                        { value: 'ceil', label: 'Ceil' }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Auto-Run Payroll Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <CommonCheckbox
                                        label="Enable Auto-Run Payroll"
                                        checked={settings.general.auto_run_payroll}
                                        onChange={(checked) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, auto_run_payroll: checked }
                                        })}
                                    />

                                    {settings.general.auto_run_payroll && (
                                        <>
                                            <CommonDropDown
                                                label="Run Frequency"
                                                value={settings.general.auto_run_frequency}
                                                onChange={(val) => setSettings({
                                                    ...settings,
                                                    general: { ...settings.general, auto_run_frequency: val }
                                                })}
                                                options={[
                                                    { value: 'monthly', label: 'Monthly' },
                                                    { value: 'biweekly', label: 'Bi-Weekly' },
                                                    { value: 'weekly', label: 'Weekly' }
                                                ]}
                                            />

                                            <CommonInputField
                                                label="Run Day (of month)"
                                                type="number"
                                                value={settings.general.auto_run_day}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    general: { ...settings.general, auto_run_day: parseInt(e.target.value) }
                                                })}
                                                min="1"
                                                max="28"
                                            />

                                            <CommonInputField
                                                label="Run Time"
                                                type="time"
                                                value={settings.general.auto_run_time}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    general: { ...settings.general, auto_run_time: e.target.value }
                                                })}
                                            />
                                        </>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <CommonCheckbox
                                        label="Include Holidays in Auto-Run"
                                        checked={settings.general.auto_run_include_holidays}
                                        onChange={(checked) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, auto_run_include_holidays: checked }
                                        })}
                                    />

                                    <CommonInputField
                                        label="Notify Before (days)"
                                        type="number"
                                        value={settings.general.auto_run_notify_before}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, auto_run_notify_before: parseInt(e.target.value) }
                                        })}
                                        min="0"
                                        max="7"
                                    />

                                    <CommonCheckbox
                                        label="Send Notification After Run"
                                        checked={settings.general.auto_run_notify_after}
                                        onChange={(checked) => setSettings({
                                            ...settings,
                                            general: { ...settings.general, auto_run_notify_after: checked }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium mb-4">Date Range Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CommonDropDown
                                    label="Date Range Type"
                                    value={settings.general.payroll_date_range.type}
                                    onChange={(val) => setSettings({
                                        ...settings,
                                        general: {
                                            ...settings.general,
                                            payroll_date_range: { ...settings.general.payroll_date_range, type: val }
                                        }
                                    })}
                                    options={[
                                        { value: 'fixed_range', label: 'Fixed Range (e.g., 1st to 31st)' },
                                        { value: 'last_day', label: 'Last Day of Month' },
                                        { value: 'custom', label: 'Custom Range per Month' }
                                    ]}
                                />

                                <CommonInputField
                                    label="Cut-off Day"
                                    type="number"
                                    value={settings.general.payroll_date_range.cut_off_day}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        general: {
                                            ...settings.general,
                                            payroll_date_range: { ...settings.general.payroll_date_range, cut_off_day: parseInt(e.target.value) }
                                        }
                                    })}
                                    min="1"
                                    max="28"
                                    helpText="Last day to include attendance data"
                                />
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <Info className="w-4 h-4 inline mr-1" />
                                    Current payroll period will be calculated from {settings.general.payroll_start_day}st to {settings.general.payroll_end_day}st of each month
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Work Schedules Tab */}
                {/* Work Schedules Tab */}
                {activeTab === 'schedules' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Department Work Schedules</h3>
                            <CommonBadge
                                text={`${selectedDepartments.length} Departments Selected`}
                                color={selectedDepartments.length > 0 ? 'blue' : 'gray'}
                            />
                        </div>

                        {/* Department Selection Card */}
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-medium mb-4">Step 1: Select Departments</h4>

                            {/* Multi-select Department Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowDepartmentDropdown(!showDepartmentDropdown)}
                                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <span className="text-gray-700">
                                        {selectedDepartments.length === 0
                                            ? 'Select departments...'
                                            : `${selectedDepartments.length} department(s) selected`}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showDepartmentDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showDepartmentDropdown && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        <div className="p-2 border-b bg-gray-50">
                                            <label className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDepartments.length === departments.length}
                                                    onChange={handleSelectAllDepartments}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-medium">Select All Departments</span>
                                            </label>
                                        </div>
                                        <div className="p-2">
                                            {departments.map((dept) => (
                                                <label
                                                    key={dept.id}
                                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedDepartments.includes(dept.name)}
                                                        onChange={() => handleDepartmentSelect(dept.name)}
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <div>
                                                        <span className="text-sm font-medium">{dept.name}</span>
                                                        <span className="text-xs text-gray-500 ml-2">({dept.code})</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedDepartments.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedDepartments.map((dept) => (
                                        <span
                                            key={dept}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                                        >
                                            {dept}
                                            <button
                                                onClick={() => handleDepartmentSelect(dept)}
                                                className="hover:text-indigo-900"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Work Schedule Configuration Card */}
                        {selectedDepartments.length > 0 && (
                            <div className="bg-white border rounded-lg p-6">
                                <h4 className="font-medium mb-4">Step 2: Configure Work Schedule</h4>

                                <div className="space-y-6">
                                    {/* Working Days Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Working Days
                                        </label>
                                        <div className="grid grid-cols-7 gap-2">
                                            {weekDays.map((day) => (
                                                <button
                                                    key={day.value}
                                                    onClick={() => {
                                                        const newWorkingDays = workingDays.includes(day.value)
                                                            ? workingDays.filter(d => d !== day.value)
                                                            : [...workingDays, day.value];
                                                        setWorkingDays(newWorkingDays);
                                                    }}
                                                    className={`
                                        py-3 px-2 rounded-lg text-sm font-medium transition-colors
                                        ${workingDays.includes(day.value)
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }
                                    `}
                                                >
                                                    {day.label.substring(0, 3)}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Selected: {workingDays.length} working days ({workingDays.map(d => d.substring(0, 3)).join(', ')})
                                        </p>
                                    </div>

                                    {/* Working Hours */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CommonInputField
                                            label="Working Hours per Day"
                                            type="number"
                                            value={workingHours}
                                            onChange={(e) => setWorkingHours(parseFloat(e.target.value))}
                                            min="1"
                                            max="24"
                                            step="0.5"
                                        />

                                        <CommonDropDown
                                            label="Overtime Applicable"
                                            value={overtimeApplicable}
                                            onChange={setOvertimeApplicable}
                                            options={[
                                                { value: 'yes', label: 'Yes' },
                                                { value: 'no', label: 'No' }
                                            ]}
                                        />
                                    </div>

                                    {/* Overtime Settings (conditional) */}
                                    {overtimeApplicable === 'yes' && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                            <CommonInputField
                                                label="Overtime Rate (multiplier)"
                                                type="number"
                                                value={overtimeRate}
                                                onChange={(e) => setOvertimeRate(parseFloat(e.target.value))}
                                                step="0.1"
                                                min="1"
                                            />

                                            <CommonInputField
                                                label="Max Overtime Hours/Day"
                                                type="number"
                                                value={maxOvertimePerDay}
                                                onChange={(e) => setMaxOvertimePerDay(parseInt(e.target.value))}
                                                min="0"
                                            />

                                            <CommonInputField
                                                label="Max Overtime Hours/Month"
                                                type="number"
                                                value={maxOvertimePerMonth}
                                                onChange={(e) => setMaxOvertimePerMonth(parseInt(e.target.value))}
                                                min="0"
                                            />
                                        </div>
                                    )}

                                    {/* Allowances Section */}
                                    <div className="border-t pt-4">
                                        <h5 className="font-medium mb-3">Allowances (Optional)</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <CommonInputField
                                                label="Shift Allowance (₹)"
                                                type="number"
                                                value={shiftAllowance}
                                                onChange={(e) => setShiftAllowance(parseInt(e.target.value))}
                                                min="0"
                                            />

                                            <CommonInputField
                                                label="Night Shift Allowance (₹)"
                                                type="number"
                                                value={nightShiftAllowance}
                                                onChange={(e) => setNightShiftAllowance(parseInt(e.target.value))}
                                                min="0"
                                            />

                                            <CommonInputField
                                                label="Holiday Work Allowance (₹)"
                                                type="number"
                                                value={holidayAllowance}
                                                onChange={(e) => setHolidayAllowance(parseInt(e.target.value))}
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setSelectedDepartments([]);
                                                setWorkingDays(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
                                                setWorkingHours(9);
                                                setOvertimeApplicable('no');
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Save schedule for selected departments
                                                const newSchedule = {
                                                    workingDays,
                                                    workingHours,
                                                    overtimeApplicable: overtimeApplicable === 'yes',
                                                    overtimeRate: overtimeApplicable === 'yes' ? overtimeRate : 0,
                                                    maxOvertimePerDay: overtimeApplicable === 'yes' ? maxOvertimePerDay : 0,
                                                    maxOvertimePerMonth: overtimeApplicable === 'yes' ? maxOvertimePerMonth : 0,
                                                    shiftAllowance,
                                                    nightShiftAllowance,
                                                    holidayAllowance
                                                };

                                                // Update settings for each selected department
                                                const updatedSchedules = [...settings.department_schedules];
                                                selectedDepartments.forEach(deptName => {
                                                    const existingIndex = updatedSchedules.findIndex(s => s.department === deptName);
                                                    const newDeptSchedule = {
                                                        id: existingIndex >= 0 ? updatedSchedules[existingIndex].id : Date.now() + Math.random(),
                                                        department: deptName,
                                                        work_week: workingDays,
                                                        off_days: weekDays.filter(day => !workingDays.includes(day.value)).map(d => d.value),
                                                        working_hours_per_day: workingHours,
                                                        overtime_applicable: overtimeApplicable === 'yes',
                                                        overtime_rate: overtimeApplicable === 'yes' ? overtimeRate : 0,
                                                        max_overtime_per_day: overtimeApplicable === 'yes' ? maxOvertimePerDay : 0,
                                                        max_overtime_per_month: overtimeApplicable === 'yes' ? maxOvertimePerMonth : 0,
                                                        shift_allowance_applicable: shiftAllowance > 0,
                                                        shift_allowance_amount: shiftAllowance,
                                                        night_shift_allowance: nightShiftAllowance,
                                                        holiday_work_allowance: holidayAllowance
                                                    };

                                                    if (existingIndex >= 0) {
                                                        updatedSchedules[existingIndex] = newDeptSchedule;
                                                    } else {
                                                        updatedSchedules.push(newDeptSchedule);
                                                    }
                                                });

                                                setSettings({
                                                    ...settings,
                                                    department_schedules: updatedSchedules
                                                });

                                                // Show success message
                                                setSaveSuccess(true);
                                                setTimeout(() => setSaveSuccess(false), 3000);

                                                // Clear selection
                                                setSelectedDepartments([]);
                                            }}
                                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                        >
                                            Apply Schedule to {selectedDepartments.length} Department(s)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Existing Schedules Preview */}
                        <div className="bg-white border rounded-lg p-6">
                            <h4 className="font-medium mb-4">Current Department Schedules</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Working Days</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hours/Day</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">OT Rate</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {settings.department_schedules.map((schedule) => (
                                            <tr key={schedule.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm font-medium">{schedule.department}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-1">
                                                        {weekDays.map(day => (
                                                            <span
                                                                key={day.value}
                                                                className={`text-xs px-1.5 py-0.5 rounded ${schedule.work_week.includes(day.value)
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-400'
                                                                    }`}
                                                            >
                                                                {day.label.substring(0, 1)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{schedule.working_hours_per_day}h</td>
                                                <td className="px-4 py-3 text-sm">
                                                    {schedule.overtime_applicable ? `${schedule.overtime_rate}x` : '-'}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <button
                                                        onClick={() => {
                                                            // Load this schedule for editing
                                                            setSelectedDepartments([schedule.department]);
                                                            setWorkingDays(schedule.work_week);
                                                            setWorkingHours(schedule.working_hours_per_day);
                                                            setOvertimeApplicable(schedule.overtime_applicable ? 'yes' : 'no');
                                                            setOvertimeRate(schedule.overtime_rate || 1.5);
                                                            setMaxOvertimePerDay(schedule.max_overtime_per_day || 4);
                                                            setMaxOvertimePerMonth(schedule.max_overtime_per_month || 60);
                                                            setShiftAllowance(schedule.shift_allowance_amount || 0);
                                                            setNightShiftAllowance(schedule.night_shift_allowance || 0);
                                                            setHolidayAllowance(schedule.holiday_work_allowance || 0);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-800 mr-2"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-800">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Salary Advance Tab */}
                {activeTab === 'advance' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Salary Advance Settings</h3>
                            <CommonSwitch
                                label="Enable Salary Advance"
                                checked={settings.salary_advance.enabled}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    salary_advance: { ...settings.salary_advance, enabled: checked }
                                })}
                            />
                        </div>

                        {settings.salary_advance.enabled && (
                            <>
                                {/* General Rules */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-3">General Rules</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <CommonInputField
                                            label="Max Advance (% of salary)"
                                            type="number"
                                            value={settings.salary_advance.max_advance_percentage}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    max_advance_percentage: parseInt(e.target.value)
                                                }
                                            })}
                                            min="0"
                                            max="100"
                                        />

                                        <CommonInputField
                                            label="Minimum Amount (₹)"
                                            type="number"
                                            value={settings.salary_advance.min_advance_amount}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    min_advance_amount: parseInt(e.target.value)
                                                }
                                            })}
                                        />

                                        <CommonInputField
                                            label="Maximum Amount (₹)"
                                            type="number"
                                            value={settings.salary_advance.max_advance_amount}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    max_advance_amount: parseInt(e.target.value)
                                                }
                                            })}
                                        />

                                        <CommonInputField
                                            label="Processing Fee (₹)"
                                            type="number"
                                            value={settings.salary_advance.advance_processing_fee}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    advance_processing_fee: parseInt(e.target.value)
                                                }
                                            })}
                                        />

                                        <CommonInputField
                                            label="Interest Rate (%)"
                                            type="number"
                                            value={settings.salary_advance.interest_rate}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    interest_rate: parseFloat(e.target.value)
                                                }
                                            })}
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                {/* Eligibility Rules */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Eligibility Rules</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CommonDropDown
                                            label="Eligibility Criteria"
                                            value={settings.salary_advance.eligibility_criteria}
                                            onChange={(val) => setSettings({
                                                ...settings,
                                                salary_advance: { ...settings.salary_advance, eligibility_criteria: val }
                                            })}
                                            options={[
                                                { value: 'immediate', label: 'Immediate (from day 1)' },
                                                { value: 'completed_probation', label: 'After Probation' },
                                                { value: 'completed_months', label: 'After Specific Months' }
                                            ]}
                                        />

                                        {settings.salary_advance.eligibility_criteria === 'completed_months' && (
                                            <CommonInputField
                                                label="Minimum Service (months)"
                                                type="number"
                                                value={settings.salary_advance.minimum_service_months}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    salary_advance: {
                                                        ...settings.salary_advance,
                                                        minimum_service_months: parseInt(e.target.value)
                                                    }
                                                })}
                                                min="1"
                                                max="24"
                                            />
                                        )}

                                        <CommonInputField
                                            label="Max Advances per Month"
                                            type="number"
                                            value={settings.salary_advance.maximum_advances_per_month}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    maximum_advances_per_month: parseInt(e.target.value)
                                                }
                                            })}
                                            min="1"
                                        />

                                        <CommonInputField
                                            label="Max Advances per Year"
                                            type="number"
                                            value={settings.salary_advance.maximum_advances_per_year}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    maximum_advances_per_year: parseInt(e.target.value)
                                                }
                                            })}
                                            min="1"
                                        />
                                    </div>
                                </div>

                                {/* Recovery Rules */}
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Recovery Rules</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CommonDropDown
                                            label="Recovery Start Month"
                                            value={settings.salary_advance.recovery_start_month}
                                            onChange={(val) => setSettings({
                                                ...settings,
                                                salary_advance: { ...settings.salary_advance, recovery_start_month: val }
                                            })}
                                            options={[
                                                { value: 'current_month', label: 'Current Month' },
                                                { value: 'next_month', label: 'Next Month' }
                                            ]}
                                        />

                                        <CommonInputField
                                            label="Recovery Tenure (months)"
                                            type="number"
                                            value={settings.salary_advance.recovery_tenure_months}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                salary_advance: {
                                                    ...settings.salary_advance,
                                                    recovery_tenure_months: parseInt(e.target.value)
                                                }
                                            })}
                                            min="1"
                                            max="24"
                                        />

                                        <CommonDropDown
                                            label="Recovery Method"
                                            value={settings.salary_advance.recovery_method}
                                            onChange={(val) => setSettings({
                                                ...settings,
                                                salary_advance: { ...settings.salary_advance, recovery_method: val }
                                            })}
                                            options={[
                                                { value: 'equal_installments', label: 'Equal Monthly Installments' },
                                                { value: 'custom_percentage', label: 'Fixed Percentage of Salary' }
                                            ]}
                                        />

                                        {settings.salary_advance.recovery_method === 'custom_percentage' && (
                                            <CommonInputField
                                                label="Recovery Percentage"
                                                type="number"
                                                value={settings.salary_advance.recovery_percentage}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    salary_advance: {
                                                        ...settings.salary_advance,
                                                        recovery_percentage: parseInt(e.target.value)
                                                    }
                                                })}
                                                min="1"
                                                max="50"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Department-wise Limits */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Department-wise Limits (Override)</h4>
                                        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <Plus className="w-3 h-3" />
                                            Add Department Limit
                                        </button>
                                    </div>

                                    <CommonTable
                                        columns={[
                                            { header: "Department", accessor: "department" },
                                            { header: "Max %", cell: row => `${row.max_advance_percentage}%` },
                                            { header: "Max Amount", cell: row => `₹${row.max_advance_amount.toLocaleString()}` },
                                            { header: "Min Service", cell: row => `${row.min_service_months} months` },
                                            {
                                                header: "Actions", cell: row => (
                                                    <div className="flex gap-1">
                                                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                            <Edit className="w-3 h-3" />
                                                        </button>
                                                        <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                )
                                            }
                                        ]}
                                        data={settings.salary_advance.department_limits}
                                    />
                                </div>

                                {/* Blackout Periods */}
                                <div className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Blackout Periods (No Advances)</h4>
                                        <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                                            <Plus className="w-3 h-3" />
                                            Add Period
                                        </button>
                                    </div>

                                    {settings.salary_advance.blackout_periods.map((period, index) => (
                                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg mb-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm">
                                                {new Date(2024, period.start_month - 1, period.start_day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                {' - '}
                                                {new Date(2024, period.end_month - 1, period.end_day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </span>
                                            <span className="text-xs text-gray-500 flex-1">{period.reason}</span>
                                            <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Overtime Tab */}
                {activeTab === 'overtime' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Overtime Settings</h3>
                            <CommonSwitch
                                label="Enable Overtime"
                                checked={settings.overtime_settings.enabled}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    overtime_settings: { ...settings.overtime_settings, enabled: checked }
                                })}
                            />
                        </div>

                        {settings.overtime_settings.enabled && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CommonDropDown
                                        label="Calculation Type"
                                        value={settings.overtime_settings.calculation_type}
                                        onChange={(val) => setSettings({
                                            ...settings,
                                            overtime_settings: { ...settings.overtime_settings, calculation_type: val }
                                        })}
                                        options={[
                                            { value: 'daily', label: 'Daily Overtime' },
                                            { value: 'weekly', label: 'Weekly Overtime' },
                                            { value: 'monthly', label: 'Monthly Overtime' }
                                        ]}
                                    />

                                    <CommonInputField
                                        label="Daily Overtime Threshold (hours)"
                                        type="number"
                                        value={settings.overtime_settings.overtime_threshold}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            overtime_settings: { ...settings.overtime_settings, overtime_threshold: parseFloat(e.target.value) }
                                        })}
                                        step="0.5"
                                    />

                                    <CommonInputField
                                        label="Weekly Overtime Threshold (hours)"
                                        type="number"
                                        value={settings.overtime_settings.weekly_overtime_threshold}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            overtime_settings: { ...settings.overtime_settings, weekly_overtime_threshold: parseFloat(e.target.value) }
                                        })}
                                        step="0.5"
                                    />
                                </div>

                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-3">Overtime Rates (Multiplier)</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <CommonInputField
                                            label="Normal OT Rate"
                                            type="number"
                                            value={settings.overtime_settings.normal_overtime_rate}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                overtime_settings: { ...settings.overtime_settings, normal_overtime_rate: parseFloat(e.target.value) }
                                            })}
                                            step="0.1"
                                        />

                                        <CommonInputField
                                            label="Holiday OT Rate"
                                            type="number"
                                            value={settings.overtime_settings.holiday_overtime_rate}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                overtime_settings: { ...settings.overtime_settings, holiday_overtime_rate: parseFloat(e.target.value) }
                                            })}
                                            step="0.1"
                                        />

                                        <CommonInputField
                                            label="Weekly Off Rate"
                                            type="number"
                                            value={settings.overtime_settings.weekly_off_overtime_rate}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                overtime_settings: { ...settings.overtime_settings, weekly_off_overtime_rate: parseFloat(e.target.value) }
                                            })}
                                            step="0.1"
                                        />

                                        <CommonInputField
                                            label="Night Shift Rate"
                                            type="number"
                                            value={settings.overtime_settings.night_shift_overtime_rate}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                overtime_settings: { ...settings.overtime_settings, night_shift_overtime_rate: parseFloat(e.target.value) }
                                            })}
                                            step="0.1"
                                        />
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium mb-3">Department-wise Overtime Limits</h4>
                                    <CommonTable
                                        columns={[
                                            { header: "Department", accessor: "department" },
                                            {
                                                header: "Applicable", cell: row => (
                                                    <CommonBadge
                                                        text={row.applicable ? 'Yes' : 'No'}
                                                        color={row.applicable ? 'green' : 'gray'}
                                                    />
                                                )
                                            },
                                            { header: "Max Hours/Day", cell: row => row.max_hours_per_day || '-' },
                                            { header: "Max Hours/Month", cell: row => row.max_hours_per_month || '-' },
                                            {
                                                header: "Actions", cell: row => (
                                                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit className="w-3 h-3" />
                                                    </button>
                                                )
                                            }
                                        ]}
                                        data={settings.overtime_settings.department_overtime}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* LOP Tab */}
                {activeTab === 'lop' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium">Loss of Pay (LOP) Rules</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CommonDropDown
                                label="LOP Calculation Basis"
                                value={settings.lop_settings.calculation_basis}
                                onChange={(val) => setSettings({
                                    ...settings,
                                    lop_settings: { ...settings.lop_settings, calculation_basis: val }
                                })}
                                options={[
                                    { value: 'calendar_days', label: 'Calendar Days' },
                                    { value: 'working_days', label: 'Working Days' }
                                ]}
                            />

                            <CommonCheckbox
                                label="Consider Leave Balance Before LOP"
                                checked={settings.lop_settings.consider_leave_balance}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    lop_settings: { ...settings.lop_settings, consider_leave_balance: checked }
                                })}
                            />

                            <CommonCheckbox
                                label="Auto-Apply LOP for Absent Days"
                                checked={settings.lop_settings.auto_apply_lop}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    lop_settings: { ...settings.lop_settings, auto_apply_lop: checked }
                                })}
                            />

                            <CommonCheckbox
                                label="Allow Negative Leave Balance"
                                checked={settings.lop_settings.allow_negative_leave_balance}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    lop_settings: { ...settings.lop_settings, allow_negative_leave_balance: checked }
                                })}
                            />
                        </div>

                        <div className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">Department-wise LOP Rules</h4>
                            <CommonTable
                                columns={[
                                    { header: "Department", accessor: "department" },
                                    { header: "Grace Period", cell: row => `${row.grace_period_minutes} min` },
                                    { header: "Half Day Threshold", cell: row => `${row.half_day_threshold_minutes} min` },
                                    {
                                        header: "Consider Late Marks", cell: row => (
                                            row.consider_late_marks ? 'Yes' : 'No'
                                        )
                                    },
                                    {
                                        header: "Actions", cell: row => (
                                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                <Edit className="w-3 h-3" />
                                            </button>
                                        )
                                    }
                                ]}
                                data={settings.lop_settings.department_lop}
                            />
                        </div>
                    </div>
                )}

                {/* Payroll Components Tab */}
                {activeTab === 'components' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium mb-4">Payroll Components Configuration</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    Earnings Components
                                </h4>
                                <div className="space-y-2">
                                    {settings.payroll_components.earnings.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                            <div>
                                                <span className="font-medium">{item.name}</span>
                                                {item.mandatory && (
                                                    <CommonBadge text="Mandatory" color="blue" size="sm" className="ml-2" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <CommonSwitch
                                                    checked={item.enabled}
                                                    onChange={(checked) => {
                                                        const newEarnings = [...settings.payroll_components.earnings];
                                                        newEarnings[index].enabled = checked;
                                                        setSettings({
                                                            ...settings,
                                                            payroll_components: {
                                                                ...settings.payroll_components,
                                                                earnings: newEarnings
                                                            }
                                                        });
                                                    }}
                                                    size="sm"
                                                />
                                                {item.taxable && (
                                                    <CommonBadge text="Taxable" color="orange" size="sm" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <MinusCircle className="w-4 h-4 text-red-600" />
                                    Deductions Components
                                </h4>
                                <div className="space-y-2">
                                    {settings.payroll_components.deductions.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                                            <div>
                                                <span className="font-medium">{item.name}</span>
                                                {item.mandatory && (
                                                    <CommonBadge text="Mandatory" color="blue" size="sm" className="ml-2" />
                                                )}
                                            </div>
                                            <CommonSwitch
                                                checked={item.enabled}
                                                onChange={(checked) => {
                                                    const newDeductions = [...settings.payroll_components.deductions];
                                                    newDeductions[index].enabled = checked;
                                                    setSettings({
                                                        ...settings,
                                                        payroll_components: {
                                                            ...settings.payroll_components,
                                                            deductions: newDeductions
                                                        }
                                                    });
                                                }}
                                                size="sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium mb-4">Payment Settings</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CommonDropDown
                                label="Payment Mode"
                                value={settings.payment_settings.payment_mode}
                                onChange={(val) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, payment_mode: val }
                                })}
                                options={[
                                    { value: 'bank_transfer', label: 'Bank Transfer' },
                                    { value: 'cheque', label: 'Cheque' },
                                    { value: 'cash', label: 'Cash' }
                                ]}
                            />

                            <CommonDropDown
                                label="Payment Date Type"
                                value={settings.payment_settings.payment_date_type}
                                onChange={(val) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, payment_date_type: val }
                                })}
                                options={[
                                    { value: 'fixed_date', label: 'Fixed Date of Month' },
                                    { value: 'last_day', label: 'Last Working Day' },
                                    { value: 'custom', label: 'Custom per Month' }
                                ]}
                            />

                            {settings.payment_settings.payment_date_type === 'fixed_date' && (
                                <CommonInputField
                                    label="Payment Date (day of month)"
                                    type="number"
                                    value={settings.payment_settings.payment_fixed_date}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        payment_settings: { ...settings.payment_settings, payment_fixed_date: parseInt(e.target.value) }
                                    })}
                                    min="1"
                                    max="28"
                                />
                            )}

                            <CommonDropDown
                                label="Bank File Format"
                                value={settings.payment_settings.bank_file_format}
                                onChange={(val) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, bank_file_format: val }
                                })}
                                options={[
                                    { value: 'sbi_collect', label: 'SBI Collect' },
                                    { value: 'hdfc_bulk', label: 'HDFC Bulk' },
                                    { value: 'icici_corp', label: 'ICICI Corporate' },
                                    { value: 'axis_direct', label: 'Axis Direct' }
                                ]}
                            />

                            <CommonCheckbox
                                label="Auto-generate Bank File"
                                checked={settings.payment_settings.auto_generate_bank_file}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, auto_generate_bank_file: checked }
                                })}
                            />

                            <CommonCheckbox
                                label="Auto-send Payslip to Employees"
                                checked={settings.payment_settings.auto_send_payslip}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, auto_send_payslip: checked }
                                })}
                            />

                            <CommonCheckbox
                                label="Payment Approval Required"
                                checked={settings.payment_settings.payment_approval_required}
                                onChange={(checked) => setSettings({
                                    ...settings,
                                    payment_settings: { ...settings.payment_settings, payment_approval_required: checked }
                                })}
                            />

                            {settings.payment_settings.payment_approval_required && (
                                <CommonInputField
                                    label="Approval Levels"
                                    type="number"
                                    value={settings.payment_settings.payment_approval_levels}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        payment_settings: { ...settings.payment_settings, payment_approval_levels: parseInt(e.target.value) }
                                    })}
                                    min="1"
                                    max="3"
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">SMS</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Push</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {Object.entries(settings.notifications).map(([key, value]) => (
                                        <tr key={key} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm capitalize">
                                                {key.replace(/_/g, ' ')}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={value.email}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            [key]: { ...value, email: e.target.checked }
                                                        }
                                                    })}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={value.sms}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            [key]: { ...value, sms: e.target.checked }
                                                        }
                                                    })}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={value.push}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            [key]: { ...value, push: e.target.checked }
                                                        }
                                                    })}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PayrollSettings;