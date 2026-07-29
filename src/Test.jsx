import React, { useEffect, useMemo, useState } from 'react';
import {
    Settings, Clock, Wallet, Timer, MinusCircle, PieChart, Shield,
    CreditCard, Bell, ChevronRight, Save, Loader, CheckCircle, Info,
    Plus, Trash2, Edit, X, ToggleLeft, Sliders, AlertTriangle
} from 'lucide-react';
import Breadcrumb from './basicComponents/BreadCrumb';
import CommonDropDown from './basicComponents/CommonDropDown';
import CommonInputField from './basicComponents/CommonInputField';
import CommonTable from './basicComponents/commonTable';
import CommonBadge from './basicComponents/CommonBadge';
import CommonSwitch from './basicComponents/CommonSwitch';
import CommonCheckbox from './basicComponents/CommonCheckBox';

// ---------------------------------------------------------------------
// 1) MODULE REGISTRY
// This mirrors the `payroll_modules` table. In production this ships
// from the API (GET /payroll-config), not hardcoded — but the shape
// (key, label, icon, core) is exactly what that row looks like.
// `core: true` modules can't be switched off by a tenant admin.
// ---------------------------------------------------------------------
const MODULE_REGISTRY = [
    { key: 'general', label: 'General', icon: <Settings className="w-4 h-4" />, core: true },
    { key: 'work_schedule', label: 'Work Schedules', icon: <Clock className="w-4 h-4" />, core: false },
    { key: 'salary_advance', label: 'Salary Advance', icon: <Wallet className="w-4 h-4" />, core: false },
    { key: 'overtime', label: 'Overtime', icon: <Timer className="w-4 h-4" />, core: false },
    { key: 'lop', label: 'LOP Rules', icon: <MinusCircle className="w-4 h-4" />, core: false },
    { key: 'components', label: 'Payroll Components', icon: <PieChart className="w-4 h-4" />, core: true },
    { key: 'statutory', label: 'Statutory', icon: <Shield className="w-4 h-4" />, core: true },
    { key: 'payment', label: 'Payment', icon: <CreditCard className="w-4 h-4" />, core: true },
    { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, core: false },
    { key: 'modules', label: 'Manage Modules', icon: <Sliders className="w-4 h-4" />, core: true, adminOnly: true },
];

// ---------------------------------------------------------------------
// 2) FIELD REGISTRY (sample — mirrors `payroll_fields`)
// Every field a module *could* show. A tenant's `fieldConfig` decides
// which of these are actually visible/editable/required for them.
// Add a new field here (or, in prod, as a DB row) and the generic
// renderer below picks it up with zero other code changes.
// ---------------------------------------------------------------------
const FIELD_REGISTRY = {
    general: [
        { key: 'payroll_frequency', label: 'Payroll Frequency', type: 'dropdown', options: [
            { value: 'weekly', label: 'Weekly' }, { value: 'biweekly', label: 'Bi-Weekly' }, { value: 'monthly', label: 'Monthly' } ] },
        { key: 'salary_calculation_basis', label: 'Calculation Basis', type: 'dropdown', options: [
            { value: 'calendar_days', label: 'Calendar Days' }, { value: 'working_days', label: 'Working Days' }, { value: '30_days', label: '30 Days Fixed' } ] },
        { key: 'payroll_processing_day', label: 'Processing Day (of month)', type: 'number' },
        { key: 'auto_run_payroll', label: 'Enable Auto-Run Payroll', type: 'switch' },
    ],
    overtime: [
        { key: 'calculation_type', label: 'Calculation Type', type: 'dropdown', options: [
            { value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }, { value: 'monthly', label: 'Monthly' } ] },
        { key: 'overtime_threshold', label: 'Daily Overtime Threshold (hrs)', type: 'number' },
        { key: 'normal_overtime_rate', label: 'Normal OT Rate (x)', type: 'number' },
        { key: 'holiday_overtime_rate', label: 'Holiday OT Rate (x)', type: 'number' },
        { key: 'night_shift_overtime_rate', label: 'Night Shift OT Rate (x)', type: 'number' },
    ],
    lop: [
        { key: 'calculation_basis', label: 'LOP Calculation Basis', type: 'dropdown', options: [
            { value: 'calendar_days', label: 'Calendar Days' }, { value: 'working_days', label: 'Working Days' } ] },
        { key: 'consider_leave_balance', label: 'Consider Leave Balance Before LOP', type: 'checkbox' },
        { key: 'auto_apply_lop', label: 'Auto-Apply LOP for Absent Days', type: 'checkbox' },
        { key: 'allow_negative_leave_balance', label: 'Allow Negative Leave Balance', type: 'checkbox' },
    ],
};

// ---------------------------------------------------------------------
// 3) MOCK "API RESPONSE" for one tenant.
// Swap this useEffect for a real fetch('/api/companies/:id/payroll-config').
// Notice: this tenant has no LOP rules and no night-shift/overtime
// config filled in — that's the "some clients don't have that data"
// case. The UI below reacts to exactly this shape.
// ---------------------------------------------------------------------
async function fetchTenantPayrollConfig(companyId) {
    await new Promise((r) => setTimeout(r, 400));
    return {
        companyId,
        enabledModules: ['general', 'work_schedule', 'salary_advance', 'overtime', 'components', 'statutory', 'payment'],
        // lop + notifications intentionally NOT in the list for this tenant
        fieldValues: {
            general: {
                payroll_frequency: 'monthly',
                salary_calculation_basis: 'calendar_days',
                payroll_processing_day: 5,
                auto_run_payroll: true,
            },
            overtime: {
                calculation_type: 'daily',
                overtime_threshold: 9,
                normal_overtime_rate: 1.5,
                holiday_overtime_rate: 2,
                night_shift_overtime_rate: null, // this tenant has no night shifts — field hidden
            },
        },
        // per-field visibility override (mirrors tenant_field_config)
        hiddenFields: { overtime: ['night_shift_overtime_rate'] },
        departments: [
            { id: 'd1', name: 'Customer Support', code: 'CS' },
            { id: 'd2', name: 'Engineering', code: 'ENG' },
        ],
        departmentSchedules: [
            { id: 'ds1', department: 'Customer Support', work_week: ['monday','tuesday','wednesday','thursday','friday','saturday'], working_hours_per_day: 9, overtime_applicable: true, overtime_rate: 2.0 },
            { id: 'ds2', department: 'Engineering', work_week: ['monday','tuesday','wednesday','thursday','friday'], working_hours_per_day: 9, overtime_applicable: true, overtime_rate: 1.5 },
        ],
    };
}

const WEEK_DAYS = [
    { value: 'monday', label: 'Monday' }, { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' }, { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' }, { value: 'saturday', label: 'Saturday' }, { value: 'sunday', label: 'Sunday' },
];

function SectionHeading({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

function PayrollSettings({ companyId = 'demo-company-1' }) {
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState(null);      // what the tenant HAS enabled (from API)
    const [values, setValues] = useState({});         // current field values, per module
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // isAdmin controls whether the "Manage Modules" control panel tab shows.
    // In production this comes from the logged-in user's role.
    const [isAdmin] = useState(true);
    // locally editable copy of which modules are enabled, so admins can
    // toggle them in the "Manage Modules" tab and see the sidebar react live
    const [enabledModules, setEnabledModules] = useState([]);

    useEffect(() => {
        let mounted = true;
        fetchTenantPayrollConfig(companyId).then((cfg) => {
            if (!mounted) return;
            setConfig(cfg);
            setEnabledModules(cfg.enabledModules);
            setValues(cfg.fieldValues || {});
            setLoading(false);
        });
        return () => { mounted = false; };
    }, [companyId]);

    // Visible tabs = core modules (always) + whatever this tenant enabled,
    // plus the admin-only control panel tab.
    const visibleTabs = useMemo(() => {
        return MODULE_REGISTRY.filter((m) => {
            if (m.adminOnly) return isAdmin;
            return m.core || enabledModules.includes(m.key);
        });
    }, [enabledModules, isAdmin]);

    // If the active tab gets disabled from under us, fall back to General.
    useEffect(() => {
        if (!loading && !visibleTabs.find((t) => t.key === activeTab)) {
            setActiveTab('general');
        }
    }, [visibleTabs, loading, activeTab]);

    const isFieldHidden = (moduleKey, fieldKey) =>
        (config?.hiddenFields?.[moduleKey] || []).includes(fieldKey);

    const setFieldValue = (moduleKey, fieldKey, val) => {
        setValues((prev) => ({ ...prev, [moduleKey]: { ...prev[moduleKey], [fieldKey]: val } }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise((r) => setTimeout(r, 900));
        // POST /api/companies/:id/payroll-config  { enabledModules, values }
        setIsSaving(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const toggleModule = (key) => {
        setEnabledModules((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    // -------------------------------------------------------------
    // Generic field renderer — this is the piece that makes fields
    // dynamic. Given a module key, it reads FIELD_REGISTRY, skips
    // anything hidden for this tenant, and renders the right input.
    // -------------------------------------------------------------
    const renderFields = (moduleKey) => {
        const fields = FIELD_REGISTRY[moduleKey] || [];
        const moduleValues = values[moduleKey] || {};

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                {fields.map((f) => {
                    if (isFieldHidden(moduleKey, f.key)) return null;
                    const val = moduleValues[f.key];

                    if (f.type === 'dropdown') {
                        return (
                            <CommonDropDown
                                key={f.key}
                                label={f.label}
                                value={val ?? ''}
                                options={f.options}
                                onChange={(v) => setFieldValue(moduleKey, f.key, v)}
                            />
                        );
                    }
                    if (f.type === 'switch') {
                        return (
                            <div key={f.key} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3">
                                <span className="text-sm text-gray-700">{f.label}</span>
                                <CommonSwitch checked={!!val} onChange={(c) => setFieldValue(moduleKey, f.key, c)} />
                            </div>
                        );
                    }
                    if (f.type === 'checkbox') {
                        return (
                            <CommonCheckbox
                                key={f.key}
                                label={f.label}
                                checked={!!val}
                                onChange={(c) => setFieldValue(moduleKey, f.key, c)}
                            />
                        );
                    }
                    // default: number / text
                    return (
                        <CommonInputField
                            key={f.key}
                            label={f.label}
                            type={f.type === 'number' ? 'number' : 'text'}
                            value={val ?? ''}
                            onChange={(e) => setFieldValue(moduleKey, f.key, e.target.value)}
                        />
                    );
                })}
            </div>
        );
    };

    const renderGeneral = () => (
        <div className="space-y-6">
            <SectionHeading icon={<Settings className="w-4 h-4" />} title="Payroll Processing" subtitle="Frequency, calculation basis, and processing day" />
            {renderFields('general')}
        </div>
    );

    const renderWorkSchedules = () => (
        <div className="space-y-6">
            <SectionHeading icon={<Clock className="w-4 h-4" />} title="Department Work Schedules" subtitle="Not every department needs the same shift rules" />
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
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
                        {(config?.departmentSchedules || []).map((s) => (
                            <tr key={s.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.department}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex gap-1">
                                        {WEEK_DAYS.map((d) => (
                                            <span key={d.value} className={`text-xs px-1.5 py-0.5 rounded ${s.work_week.includes(d.value) ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                                                {d.label[0]}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">{s.working_hours_per_day}h</td>
                                <td className="px-4 py-3 text-sm">{s.overtime_applicable ? `${s.overtime_rate}x` : '—'}</td>
                                <td className="px-4 py-3 text-sm">
                                    <button className="text-indigo-600 hover:text-indigo-800 mr-2"><Edit className="w-4 h-4" /></button>
                                    <button className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                        {(config?.departmentSchedules || []).length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-400">No department schedules configured yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium">
                <Plus className="w-4 h-4" /> Add Department Schedule
            </button>
        </div>
    );

    const renderSalaryAdvance = () => (
        <div className="space-y-6">
            <SectionHeading icon={<Wallet className="w-4 h-4" />} title="Salary Advance Rules" subtitle="Eligibility, limits, and recovery" />
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg p-3">
                <Info className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                This module reads its own settings table (salary_advance_settings) — same idea as General, just its own field set.
            </div>
        </div>
    );

    const renderOvertime = () => (
        <div className="space-y-6">
            <SectionHeading icon={<Timer className="w-4 h-4" />} title="Overtime Rules" subtitle="Rates and thresholds — night-shift rate is hidden for this tenant" />
            {renderFields('overtime')}
        </div>
    );

    const renderLop = () => (
        <div className="space-y-6">
            <SectionHeading icon={<MinusCircle className="w-4 h-4" />} title="Loss of Pay Rules" />
            {renderFields('lop')}
        </div>
    );

    const renderPlaceholder = (label) => (
        <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-xl p-8 text-center">
            {label} settings render the same way — a field list from the registry, filtered by this tenant's config.
        </div>
    );

    const renderModuleManager = () => (
        <div className="space-y-6">
            <SectionHeading icon={<Sliders className="w-4 h-4" />} title="Manage Modules" subtitle="Turn payroll features on or off for this company" />
            <div className="space-y-2">
                {MODULE_REGISTRY.filter((m) => !m.adminOnly).map((m) => (
                    <div key={m.key} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">{m.icon}</div>
                            <div>
                                <div className="font-medium text-gray-800 text-sm">{m.label}</div>
                                {m.core && <div className="text-xs text-gray-400">Core module — always on</div>}
                            </div>
                        </div>
                        <CommonSwitch
                            checked={m.core || enabledModules.includes(m.key)}
                            disabled={m.core}
                            onChange={() => toggleModule(m.key)}
                        />
                    </div>
                ))}
            </div>
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
                <Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                This writes to <code className="font-mono">tenant_module_config</code>. Disabling a module here removes its tab for every user in this company — it doesn't delete any data already entered.
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return renderGeneral();
            case 'work_schedule': return renderWorkSchedules();
            case 'salary_advance': return renderSalaryAdvance();
            case 'overtime': return renderOvertime();
            case 'lop': return renderLop();
            case 'components': return renderPlaceholder('Payroll Components');
            case 'statutory': return renderPlaceholder('Statutory');
            case 'payment': return renderPlaceholder('Payment');
            case 'notifications': return renderPlaceholder('Notifications');
            case 'modules': return renderModuleManager();
            default: return renderGeneral();
        }
    };

    const activeMeta = visibleTabs.find((t) => t.key === activeTab);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader className="w-4 h-4 animate-spin" /> Loading payroll configuration…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="mx-auto max-w-[1400px]">
                <div className="mb-6">
                    <Breadcrumb
                        items={[{ label: 'Payroll', to: '/payroll' }, { label: 'Settings' }]}
                        title="Payroll Settings"
                        description="Configure payroll rules for this company"
                        actions={
                            <div className="flex items-center gap-3">
                                {saveSuccess && (
                                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg text-sm">
                                        <CheckCircle className="w-4 h-4" /> Saved
                                    </div>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className={`px-4 py-2 text-white rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm shadow-indigo-200 transition-colors ${isSaving ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                >
                                    {isSaving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        }
                    />
                </div>

                {/* Summary header card, mirrors the profile header card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="h-16 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-500" />
                    <div className="px-6 pb-5 pt-3 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Demo Company Pvt Ltd</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {enabledModules.length} of {MODULE_REGISTRY.filter(m => !m.adminOnly).length} payroll modules enabled
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {MODULE_REGISTRY.filter((m) => !m.adminOnly && (m.core || enabledModules.includes(m.key))).map((m) => (
                                <span key={m.key} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                                    {m.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar + content, same structure as the profile page */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/60">
                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible scrollbar p-2 lg:p-3 gap-1">
                                {visibleTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors shrink-0 ${
                                            activeTab === tab.key ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                        }`}
                                    >
                                        <span className={activeTab === tab.key ? 'text-white' : 'text-gray-400'}>{tab.icon}</span>
                                        <span className="flex-1 text-left">{tab.label}</span>
                                        {activeTab === tab.key && <ChevronRight className="w-3.5 h-3.5 hidden lg:block" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="px-6 py-5 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">{activeMeta?.label}</h3>
                            </div>
                            <div className="p-6">{renderContent()}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PayrollSettings;