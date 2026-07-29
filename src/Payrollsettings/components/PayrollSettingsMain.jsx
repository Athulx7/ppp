import React, { useMemo, useState } from "react"
import {
    Settings, Bell, ChevronRight, Clock, CreditCard, MinusCircle,
    PieChart, Shield, Sliders, Timer, Wallet, Save, CheckCircle, Loader2,
    PanelLeftClose, PanelLeftOpen, Menu
} from "lucide-react"
import LoadingSpinner from "../../basicComponents/LoadingSpinner"
import CommonSwitch from "../../basicComponents/CommonSwitch"
import CommonInputField from "../../basicComponents/CommonInputField"
import CommonDropDown from "../../basicComponents/CommonDropDown"
import CustomWorkSchedule from "./CustomWorkSchedule"
import CustomStatutoryConfig from "./CustomStatutoryConfig"
import { usePayrollSetting } from "../hooks/usePayrollSettings"

const ICON_MAP = {
    Sliders: <Sliders className="w-4 h-4" />,
    Settings: <Settings className="w-4 h-4" />,
    Clock: <Clock className="w-4 h-4" />,
    Wallet: <Wallet className="w-4 h-4" />,
    Timer: <Timer className="w-4 h-4" />,
    MinusCircle: <MinusCircle className="w-4 h-4" />,
    PieChart: <PieChart className="w-4 h-4" />,
    Shield: <Shield className="w-4 h-4" />,
    CreditCard: <CreditCard className="w-4 h-4" />,
    Bell: <Bell className="w-4 h-4" />
}

function getModuleIcon(icon) {
    if (!icon) return <Sliders className="w-4 h-4" />
    if (typeof icon !== 'string') return icon
    return ICON_MAP[icon] || <Sliders className="w-4 h-4" />
}

function SectionHeading({ icon, title, subtitle }) {
    return (
        <div className="flex items-start gap-3 mb-5">
            <div className="w-9 h-9 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    )
}

function PayrollSettingsMain({ isLoading, setIsLoading }) {
    const {
        Module_Registry,
        activeTab,
        setActiveTab,
        tabModule,
        activeFields,
        tabValues,
        setTabValues,
        saveModuleData,
        isSaving,
        isTabLoading
    } = usePayrollSetting({ setIsLoading })

    const [saveSuccess, setSaveSuccess] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(true)

    const visibleTabs = useMemo(() => {
        return Module_Registry.filter((m) => {
            return m.isCore || m.enabled || m.key === 'module_manager'
        })
    }, [Module_Registry])

    const activeModuleMeta = useMemo(() => {
        return Module_Registry.find(m => m.key === activeTab) || visibleTabs[0]
    }, [Module_Registry, activeTab, visibleTabs])

    const handleValueChange = (fieldKey, value) => {
        setTabValues(prev => ({
            ...prev,
            [fieldKey]: value
        }))
    }

    const handleSave = async () => {
        const success = await saveModuleData(tabValues)
        if (success) {
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        }
    }

    const currentTitle = tabModule?.label || activeModuleMeta?.label || 'Module Settings'
    const currentSubtitle = tabModule?.description || activeModuleMeta?.description || 'Configure options and rules for this module'
    const currentIcon = getModuleIcon(tabModule?.icon || activeModuleMeta?.icon)

    const renderDynamicFields = () => {
        if (isTabLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <p className="text-xs font-medium">Loading fields...</p>
                </div>
            )
        }

        if (!activeFields || activeFields.length === 0) {
            return (
                <div className="p-8 text-center text-gray-500">
                    <p className="text-sm font-medium">No configurable fields defined.</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeFields.map((field) => {
                        const currentValue = tabValues[field.fieldKey] !== undefined
                            ? tabValues[field.fieldKey]
                            : field.defaultValue

                        if (field.fieldType === 'toggle' || field.fieldType === 'switch') {
                            return (
                                <CommonSwitch
                                    key={field.fieldKey}
                                    checked={Boolean(currentValue)}
                                    onChange={(checked) => handleValueChange(field.fieldKey, checked ? 1 : 0)}
                                    label={field.label}
                                />
                            )
                        }

                        if (field.fieldType === 'dropdown') {
                            const dropdownOptions = Array.isArray(field.options) ? field.options : []
                            return (
                                <CommonDropDown
                                    key={field.fieldKey}
                                    label={field.label}
                                    value={currentValue || ''}
                                    options={dropdownOptions}
                                    onChange={(value) => handleValueChange(field.fieldKey, value)}
                                    required={field.isRequired}
                                />
                            )
                        }

                        return (
                            <CommonInputField
                                key={field.fieldKey}
                                label={field.label}
                                type={field.fieldType === 'number' ? 'number' : 'text'}
                                value={currentValue !== null && currentValue !== undefined ? currentValue : ''}
                                onChange={(e) => handleValueChange(field.fieldKey, e)}
                                required={field.isRequired}
                            />
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                    {isMenuOpen && (
                        <div className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/60 transition-all duration-300">
                            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <Menu className="w-3.5 h-3.5 text-indigo-600" />
                                    Payroll Modules
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200/60 rounded-md transition-colors cursor-pointer"
                                    title="Hide Modules Menu"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible scrollbar gap-1 p-1">
                                {visibleTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`cursor-pointer flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors shrink-0 rounded-md ${activeTab === tab.key
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                                            }`}
                                    >
                                        <span className={activeTab === tab.key ? 'text-white' : 'text-gray-400'}>
                                            {getModuleIcon(tab.icon)}
                                        </span>
                                        <span className="flex-1 text-left">{tab.label}</span>
                                        {activeTab === tab.key && <ChevronRight className="w-3.5 h-3.5 hidden lg:block" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {!isMenuOpen && (
                            <div className="px-4 pt-3 pb-1 border-b border-gray-100 flex items-center justify-between bg-gray-50/40">
                                <button
                                    type="button"
                                    onClick={() => setIsMenuOpen(true)}
                                    className="flex rounded-sm items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-all cursor-pointer shadow-sm"
                                    title="Open Modules Menu"
                                >
                                    <PanelLeftOpen className="w-3.5 h-3.5" />
                                    Show Modules Menu
                                </button>
                                <span className="text-xs font-semibold text-gray-500">
                                    {currentTitle}
                                </span>
                            </div>
                        )}

                        {activeTab === 'work_schedule' ? (
                            <div className="p-4">
                                <CustomWorkSchedule currentTitle={currentTitle} isTabLoading={isTabLoading} />
                            </div>
                        ) : activeTab === 'statutory' ? (
                            <div className="p-4">
                                <CustomStatutoryConfig currentTitle={currentTitle} isTabLoading={isTabLoading} />
                            </div>
                        ) : (
                            <>
                                <div className="p-4">
                                    {!isTabLoading && <SectionHeading
                                        icon={currentIcon}
                                        title={currentTitle}
                                        subtitle={currentSubtitle}
                                    />
                                    }

                                    {renderDynamicFields()}
                                </div>

                                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                    <div>
                                        {saveSuccess && (
                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                Settings saved successfully!
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving || isTabLoading}
                                        className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium shadow-sm shadow-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {isSaving ? 'Saving...' : 'Save Settings'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isLoading.spinner && <LoadingSpinner />}
        </>
    )
}

export default PayrollSettingsMain