import { useEffect, useState } from "react";
import { ApiCall } from "../../library/constants";

export function usePayrollSetting({ setIsLoading }) {
    const [Module_Registry, setModuleRegistry] = useState([])
    const [activeTab, setActiveTab] = useState('module_manager')
    const [tabModule, setTabModule] = useState(null)
    const [activeFields, setActiveFields] = useState([])
    const [tabValues, setTabValues] = useState({})
    const [isSaving, setIsSaving] = useState(false)
    const [isTabLoading, setIsTabLoading] = useState(false)

    // 1. Fetch initial modules list
    async function getPayrollModules() {
        setIsLoading({ normal: true, spinner: false })
        try {
            const response = await ApiCall('get', '/payrollsettings/modules')
            if (response.data?.success) {
                const fetchedModules = response.data.data.modules || []
                setModuleRegistry(fetchedModules)

                if (fetchedModules.length > 0) {
                    const defaultTab = fetchedModules.find(m => m.key === 'module_manager' || m.isCore || m.enabled)
                    if (defaultTab) {
                        setActiveTab(defaultTab.key)
                    }
                }
            }
        } catch (err) {
            console.error('Error in getPayrollModules:', err)
        } finally {
            setIsLoading({ normal: false, spinner: false })
        }
    }

    // 2. Fetch field definitions & saved values for a specific selected module key
    async function fetchModuleFields(moduleKey) {
        if (!moduleKey) return
        setIsTabLoading(true)
        try {
            const response = await ApiCall('get', `/payrollsettings/fields/${moduleKey}`)
            if (response.data?.success) {
                const { module, fields, values } = response.data.data
                setTabModule(module)
                setActiveFields(fields || [])
                setTabValues(values || {})
            }
        } catch (err) {
            console.error(`Error fetching fields for module ${moduleKey}:`, err)
        } finally {
            setIsTabLoading(false)
        }
    }

    // 3. Save module data for the currently selected tab
    async function saveModuleData(targetData) {
        if (!activeTab) return false
        setIsSaving(true)
        try {
            const payload = {
                moduleKey: activeTab,
                data: targetData || tabValues
            }
            const res = await ApiCall('post', '/payrollsettings/save-module', payload)
            if (res.data?.success) {
                // If saved module was module_manager, reload modules list to update enabled state of sidebar tabs
                if (activeTab === 'module_manager') {
                    await getPayrollModules()
                }
                return true
            }
        } catch (err) {
            console.error('Error saving module settings:', err)
        } finally {
            setIsSaving(false)
        }
        return false
    }

    useEffect(() => {
        getPayrollModules()
    }, [])

    useEffect(() => {
        if (activeTab) {
            fetchModuleFields(activeTab)
        }
    }, [activeTab])

    return {
        Module_Registry,
        activeTab,
        setActiveTab,
        tabModule,
        activeFields,
        tabValues,
        setTabValues,
        fetchModuleFields,
        saveModuleData,
        isSaving,
        isTabLoading
    }
}
