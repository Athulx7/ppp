import React, { useState, useEffect } from "react";
import MenuMappingTabSection from "./MenuMappingTabSection";
import MenuMappingTypeSection from "./MenuMappingTypeSection";
import MenuMappingMenuSection from "./MenuMappingMenuSection";
import { ApiCall } from "../../library/constants";

function MenuMappingMain({ isLoading, setIsLoading }) {
    const [mappingType, setMappingType] = useState('role')
    const [selectedRole, setSelectedRole] = useState('')
    const [selectedDesignation, setSelectedDesignation] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState('')
    const [selectedDepartment, setSelectedDepartment] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeMainMenu, setActiveMainMenu] = useState('all')
    const [selectedSubMenus, setSelectedSubMenus] = useState([])
    const [expandedMenus, setExpandedMenus] = useState([])
    const [loading, setLoading] = useState(false)
    const [saveStatus, setSaveStatus] = useState('')

    const [roles, setRoles] = useState([])
    const [departments, setDepartments] = useState([])
    const [designations, setDesignations] = useState([])
    const [employees, setEmployees] = useState([])
    const [mainMenus, setMainMenus] = useState([])
    const [subMenus, setSubMenus] = useState([])

    useEffect(() => {
        loadMasterData()
    }, [])

    const loadMasterData = async () => {
        try {
            const [rolesRes, deptRes, menuRes] = await Promise.all([
                ApiCall('GET', '/menumapping/systemroles'),
                ApiCall('GET', '/menumapping/department'),
                ApiCall('GET', '/menumapping/allSubMenus'),
            ])

            if (rolesRes?.data?.success) setRoles(rolesRes.data.data)
            if (deptRes?.data?.success) setDepartments(deptRes.data.data.data)

            console.log('all sub menus',menuRes.data.data.data)
            if (menuRes?.data?.success) {
                const rows = menuRes.data.data.data

                const seenMM = new Set()
                const mMenus = [];
                rows.forEach(r => {
                    if (!seenMM.has(r.main_menu_id)) {
                        seenMM.add(r.main_menu_id);
                        mMenus.push({
                            main_menu_id: r.main_menu_id,
                            menu_name: r.menu_name,
                        })
                    }
                })
                setMainMenus(mMenus)

                setSubMenus(rows.map(r => ({
                    sub_menu_id: r.sub_menu_id,
                    sub_menu_name: r.sub_menu_name,
                    route_path: r.route_path,
                    main_menu_id: r.main_menu_id,
                    is_active: true,
                })))
            }
        } catch (err) {
            console.error('Failed to load master data', err)
        }
    }

    useEffect(() => {
        if (selectedDepartment) {
            loadDesignations(selectedDepartment)
        } else {
            setDesignations([])
        }
    }, [selectedDepartment])

    const loadDesignations = async (deptCode) => {
        setIsLoading(prev => ({ ...prev, spinner: true }))
        try {
            const res = await ApiCall('GET', `/empmst/designantionList?department_code=${deptCode}`)
            if (res?.data?.success) setDesignations(res.data.data.data)
        } catch (err) {
            console.error(err)
        }
        setIsLoading(prev => ({ ...prev, spinner: false }))
    }

    useEffect(() => {
        if (selectedDesignation && mappingType === 'employee') {
            loadEmployees(selectedDesignation)
        } else {
            setEmployees([])
        }
    }, [selectedDesignation])

    const loadEmployees = async (desigCode) => {
        setIsLoading(prev => ({ ...prev, spinner: true }))
        try {
            const res = await ApiCall('GET', `/menumapping/employees?designation_code=${desigCode}`)
            if (res?.data?.success) setEmployees(res.data.data.data)
        } catch (err) {
            console.error(err)
        }
        setIsLoading(prev => ({ ...prev, spinner: false }))
    }

    const handleMappingTypeChange = (type) => {
        setMappingType(type)
        setSelectedRole('')
        setSelectedDesignation('')
        setSelectedEmployee('')
        setSelectedDepartment('')
        setSelectedSubMenus([])
        setDesignations([])
        setEmployees([])
        setSaveStatus('')
    }

    const getSelectedCode = () => {
        if (mappingType === 'role') return selectedRole
        if (mappingType === 'designation') return selectedDesignation
        if (mappingType === 'employee') return selectedEmployee
        return ''
    }

    const loadMenuMapping = async (overrideCode) => {
        const code = overrideCode || getSelectedCode();
        if (!code) {
            setSelectedSubMenus([])
            return
        }
        setLoading(true)
        try {
            const res = await ApiCall('GET', `/menumapping/load?type=${mappingType}&code=${code}`)
            if (res?.data?.success) {
                setSelectedSubMenus(res.data.data.data)
            }
        } catch (err) {
            console.error('Failed to load mapping', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (mappingType === 'role' && selectedRole) {
            loadMenuMapping(selectedRole)
        }
    }, [selectedRole])

    useEffect(() => {
        if (mappingType === 'designation' && selectedDesignation) {
            loadMenuMapping(selectedDesignation)
        }
    }, [selectedDesignation])

    useEffect(() => {
        if (mappingType === 'employee' && selectedEmployee) {
            loadMenuMapping(selectedEmployee)
        }
    }, [selectedEmployee])

    const handleSave = async () => {
        const code = getSelectedCode()
        if (!code) return
        setSaveStatus('saving')
        try {
            const res = await ApiCall('POST', '/menumapping/save', {
                type: mappingType,
                code,
                subMenuIds: selectedSubMenus,
            })
            if (res?.data?.success) {
                setSaveStatus('success')
                setTimeout(() => setSaveStatus(''), 3000)
            }
        } catch (err) {
            console.error('Failed to save mapping', err)
            setSaveStatus('')
        }
    }

    const handleReset = () => loadMenuMapping()

    const handleCancel = () => {
        setSelectedSubMenus([])
        setSaveStatus('')
    }

    const handleSubMenuToggle = (subMenuId) => {
        setSelectedSubMenus(prev =>
            prev.includes(subMenuId)
                ? prev.filter(id => id !== subMenuId)
                : [...prev, subMenuId]
        )
    }

    const handleExpandAll = () => {
        setExpandedMenus(prev =>
            prev.length === mainMenus.length
                ? []
                : mainMenus.map(m => m.main_menu_id)
        )
    }

    const getFilteredSubMenus = () => {
        let filtered = subMenus.filter(sm => sm.is_active)
        if (activeMainMenu !== 'all') {
            filtered = filtered.filter(sm => sm.main_menu_id === parseInt(activeMainMenu))
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            filtered = filtered.filter(sm =>
                sm.sub_menu_name.toLowerCase().includes(q) ||
                sm.route_path.toLowerCase().includes(q)
            )
        }
        return filtered
    }

    return (
        <>
            <MenuMappingTabSection
                isLoading={isLoading}
                mappingType={mappingType}
                handleMappingTypeChange={handleMappingTypeChange}
            />
            <MenuMappingTypeSection
                isLoading={isLoading}
                mappingType={mappingType}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                selectedDesignation={selectedDesignation}
                setSelectedDesignation={setSelectedDesignation}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                roles={roles}
                departments={departments}
                designations={designations}
                employees={employees}
                handleLoadMapping={loadMenuMapping}
            />
            <MenuMappingMenuSection
                activeMainMenu={activeMainMenu}
                setActiveMainMenu={setActiveMainMenu}
                mainMenus={mainMenus}
                selectedSubMenus={selectedSubMenus}
                setSelectedSubMenus={setSelectedSubMenus}
                subMenus={subMenus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSubMenuToggle={handleSubMenuToggle}
                loading={loading}
                saveStatus={saveStatus}
                mappingType={mappingType}
                selectedRole={selectedRole}
                selectedDesignation={selectedDesignation}
                selectedEmployee={selectedEmployee}
                handleExpandAll={handleExpandAll}
                expandedMenus={expandedMenus}
                getFilteredSubMenus={getFilteredSubMenus}
                handleSave={handleSave}
                handleReset={handleReset}
                handleCancel={handleCancel}
            />
        </>
    )
}

export default MenuMappingMain