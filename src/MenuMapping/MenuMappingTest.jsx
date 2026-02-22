import React, { useState, useEffect } from 'react';
import {
    Save, X, Search, Users, Briefcase, User, Shield,
    ChevronRight, Check, Filter, RefreshCw, FolderTree,
    Menu as MenuIcon, Layers, Settings, Globe, Database,
    Download
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';

function MenuMappingTest() {
    const [mappingType, setMappingType] = useState('role'); // role, designation, employee
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMainMenu, setActiveMainMenu] = useState('all');
    const [menuData, setMenuData] = useState([]);
    const [selectedSubMenus, setSelectedSubMenus] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

    // Dummy Data for Dropdowns
    const roles = [
        { role_code: 'ADMIN', role_name: 'Administrator', role_id: 1 },
        { role_code: 'HR', role_name: 'HR Manager', role_id: 2 },
        { role_code: 'MGR', role_name: 'Department Manager', role_id: 3 },
        { role_code: 'EMP', role_name: 'Employee', role_id: 4 },
        { role_code: 'PAYROLL', role_name: 'Payroll Manager', role_id: 5 },
        { role_code: 'SUPERVISOR', role_name: 'Supervisor', role_id: 6 }
    ];

    const departments = [
        { dept_code: 'DEPT001', dept_name: 'Engineering' },
        { dept_code: 'DEPT002', dept_name: 'Human Resources' },
        { dept_code: 'DEPT003', dept_name: 'Sales' },
        { dept_code: 'DEPT004', dept_name: 'Marketing' },
        { dept_code: 'DEPT005', dept_name: 'Finance' },
        { dept_code: 'DEPT006', dept_name: 'Operations' }
    ];

    const designations = [
        { designation_code: 'DES001', designation_name: 'Software Engineer', dept: 'Engineering' },
        { designation_code: 'DES002', designation_name: 'Senior Software Engineer', dept: 'Engineering' },
        { designation_code: 'DES003', designation_name: 'Tech Lead', dept: 'Engineering' },
        { designation_code: 'DES004', designation_name: 'HR Executive', dept: 'HR' },
        { designation_code: 'DES005', designation_name: 'HR Manager', dept: 'HR' },
        { designation_code: 'DES006', designation_name: 'Sales Executive', dept: 'Sales' },
        { designation_code: 'DES007', designation_name: 'Sales Manager', dept: 'Sales' },
        { designation_code: 'DES008', designation_name: 'Accountant', dept: 'Finance' }
    ];

    const employees = [
        { emp_code: 'EMP001', emp_name: 'John Doe', designation: 'Software Engineer', department: 'Engineering' },
        { emp_code: 'EMP002', emp_name: 'Jane Smith', designation: 'HR Manager', department: 'HR' },
        { emp_code: 'EMP003', emp_name: 'Michael Chen', designation: 'Tech Lead', department: 'Engineering' },
        { emp_code: 'EMP004', emp_name: 'Sarah Johnson', designation: 'Sales Manager', department: 'Sales' },
        { emp_code: 'EMP005', emp_name: 'David Kumar', designation: 'Accountant', department: 'Finance' },
        { emp_code: 'EMP006', emp_name: 'Priya Patel', designation: 'HR Executive', department: 'HR' }
    ];

    // Filter designations based on selected department
    const filteredDesignations = selectedDepartment
        ? designations.filter(d => d.dept === departments.find(dept => dept.dept_code === selectedDepartment)?.dept_name)
        : designations;

    // Filter employees based on selected department and designation
    const filteredEmployees = employees.filter(e => {
        let match = true;
        if (selectedDepartment) {
            const deptName = departments.find(d => d.dept_code === selectedDepartment)?.dept_name;
            match = match && e.department === deptName;
        }
        if (selectedDesignation) {
            const desigName = designations.find(d => d.designation_code === selectedDesignation)?.designation_name;
            match = match && e.designation === desigName;
        }
        return match;
    });

    // Main Menus with Icons
    const mainMenus = [
        { main_menu_id: 1, menu_name: 'Dashboard', icon: <Globe className="w-4 h-4" />, color: 'bg-blue-500' },
        { main_menu_id: 2, menu_name: 'Employee Management', icon: <Users className="w-4 h-4" />, color: 'bg-green-500' },
        { main_menu_id: 3, menu_name: 'Leave Management', icon: <Layers className="w-4 h-4" />, color: 'bg-purple-500' },
        { main_menu_id: 4, menu_name: 'Attendance', icon: <Settings className="w-4 h-4" />, color: 'bg-orange-500' },
        { main_menu_id: 5, menu_name: 'Payroll', icon: <Database className="w-4 h-4" />, color: 'bg-red-500' },
        { main_menu_id: 6, menu_name: 'Masters', icon: <FolderTree className="w-4 h-4" />, color: 'bg-indigo-500' },
        { main_menu_id: 7, menu_name: 'Reports', icon: <MenuIcon className="w-4 h-4" />, color: 'bg-yellow-500' },
        { main_menu_id: 8, menu_name: 'Settings', icon: <Settings className="w-4 h-4" />, color: 'bg-gray-500' }
    ];

    // Sub Menus with Main Menu mapping
    const subMenus = [
        // Dashboard (main_menu_id: 1)
        { sub_menu_id: 101, sub_menu_name: 'My Dashboard', route_path: '/dashboard', main_menu_id: 1, is_active: true },
        { sub_menu_id: 102, sub_menu_name: 'Team Dashboard', route_path: '/team-dashboard', main_menu_id: 1, is_active: true },
        { sub_menu_id: 103, sub_menu_name: 'Analytics', route_path: '/analytics', main_menu_id: 1, is_active: true },

        // Employee Management (main_menu_id: 2)
        { sub_menu_id: 201, sub_menu_name: 'Employee Master', route_path: '/employees/master', main_menu_id: 2, is_active: true },
        { sub_menu_id: 202, sub_menu_name: 'Employee Directory', route_path: '/employees/directory', main_menu_id: 2, is_active: true },
        { sub_menu_id: 203, sub_menu_name: 'Employee Onboarding', route_path: '/employees/onboarding', main_menu_id: 2, is_active: true },
        { sub_menu_id: 204, sub_menu_name: 'Employee Offboarding', route_path: '/employees/offboarding', main_menu_id: 2, is_active: true },
        { sub_menu_id: 205, sub_menu_name: 'Documents', route_path: '/employees/documents', main_menu_id: 2, is_active: true },

        // Leave Management (main_menu_id: 3)
        { sub_menu_id: 301, sub_menu_name: 'Apply Leave', route_path: '/leave/apply', main_menu_id: 3, is_active: true },
        { sub_menu_id: 302, sub_menu_name: 'Leave Balance', route_path: '/leave/balance', main_menu_id: 3, is_active: true },
        { sub_menu_id: 303, sub_menu_name: 'Leave Approvals', route_path: '/leave/approvals', main_menu_id: 3, is_active: true },
        { sub_menu_id: 304, sub_menu_name: 'Leave Calendar', route_path: '/leave/calendar', main_menu_id: 3, is_active: true },
        { sub_menu_id: 305, sub_menu_name: 'Leave Policy', route_path: '/leave/policy', main_menu_id: 3, is_active: true },

        // Attendance (main_menu_id: 4)
        { sub_menu_id: 401, sub_menu_name: 'Mark Attendance', route_path: '/attendance/mark', main_menu_id: 4, is_active: true },
        { sub_menu_id: 402, sub_menu_name: 'Attendance Report', route_path: '/attendance/report', main_menu_id: 4, is_active: true },
        { sub_menu_id: 403, sub_menu_name: 'Shift Management', route_path: '/attendance/shifts', main_menu_id: 4, is_active: true },
        { sub_menu_id: 404, sub_menu_name: 'Regularization', route_path: '/attendance/regularization', main_menu_id: 4, is_active: true },

        // Payroll (main_menu_id: 5)
        { sub_menu_id: 501, sub_menu_name: 'Salary Structure', route_path: '/payroll/structure', main_menu_id: 5, is_active: true },
        { sub_menu_id: 502, sub_menu_name: 'Payslip', route_path: '/payroll/payslip', main_menu_id: 5, is_active: true },
        { sub_menu_id: 503, sub_menu_name: 'Tax Declaration', route_path: '/payroll/tax', main_menu_id: 5, is_active: true },
        { sub_menu_id: 504, sub_menu_name: 'Reimbursements', route_path: '/payroll/reimbursements', main_menu_id: 5, is_active: true },
        { sub_menu_id: 505, sub_menu_name: 'Payroll Processing', route_path: '/payroll/process', main_menu_id: 5, is_active: true },

        // Masters (main_menu_id: 6)
        { sub_menu_id: 601, sub_menu_name: 'Department Master', route_path: '/masters/department', main_menu_id: 6, is_active: true },
        { sub_menu_id: 602, sub_menu_name: 'Designation Master', route_path: '/masters/designation', main_menu_id: 6, is_active: true },
        { sub_menu_id: 603, sub_menu_name: 'Holiday Master', route_path: '/masters/holiday', main_menu_id: 6, is_active: true },
        { sub_menu_id: 604, sub_menu_name: 'Leave Type Master', route_path: '/masters/leave-type', main_menu_id: 6, is_active: true },
        { sub_menu_id: 605, sub_menu_name: 'Shift Master', route_path: '/masters/shift', main_menu_id: 6, is_active: true },
        { sub_menu_id: 606, sub_menu_name: 'Bank Master', route_path: '/masters/bank', main_menu_id: 6, is_active: true },

        // Reports (main_menu_id: 7)
        { sub_menu_id: 701, sub_menu_name: 'Employee Reports', route_path: '/reports/employee', main_menu_id: 7, is_active: true },
        { sub_menu_id: 702, sub_menu_name: 'Attendance Reports', route_path: '/reports/attendance', main_menu_id: 7, is_active: true },
        { sub_menu_id: 703, sub_menu_name: 'Leave Reports', route_path: '/reports/leave', main_menu_id: 7, is_active: true },
        { sub_menu_id: 704, sub_menu_name: 'Payroll Reports', route_path: '/reports/payroll', main_menu_id: 7, is_active: true },
        { sub_menu_id: 705, sub_menu_name: 'Custom Reports', route_path: '/reports/custom', main_menu_id: 7, is_active: true },

        // Settings (main_menu_id: 8)
        { sub_menu_id: 801, sub_menu_name: 'Company Settings', route_path: '/settings/company', main_menu_id: 8, is_active: true },
        { sub_menu_id: 802, sub_menu_name: 'User Management', route_path: '/settings/users', main_menu_id: 8, is_active: true },
        { sub_menu_id: 803, sub_menu_name: 'Role Management', route_path: '/settings/roles', main_menu_id: 8, is_active: true },
        { sub_menu_id: 804, sub_menu_name: 'Menu Mapping', route_path: '/settings/menu-mapping', main_menu_id: 8, is_active: true },
        { sub_menu_id: 805, sub_menu_name: 'Email Settings', route_path: '/settings/email', main_menu_id: 8, is_active: true }
    ];

    // Pre-assigned menus for different roles (dummy data)
    const roleMenus = {
        'ADMIN': [101, 102, 103, 201, 202, 203, 204, 205, 301, 302, 303, 304, 305, 401, 402, 403, 404, 501, 502, 503, 504, 505, 601, 602, 603, 604, 605, 606, 701, 702, 703, 704, 705, 801, 802, 803, 804, 805],
        'HR': [201, 202, 203, 204, 205, 301, 302, 303, 304, 401, 402, 501, 502, 601, 602, 701, 702, 703],
        'MGR': [201, 202, 301, 302, 303, 304, 401, 402, 403, 501, 502, 701, 702],
        'EMP': [101, 201, 301, 302, 401, 501, 502],
        'PAYROLL': [501, 502, 503, 504, 505, 601, 702, 703, 704],
        'SUPERVISOR': [201, 202, 301, 302, 303, 401, 402, 501, 502]
    };

    // Pre-assigned menus for different designations
    const designationMenus = {
        'DES001': [101, 201, 301, 302, 401, 501, 502],
        'DES002': [101, 201, 202, 301, 302, 401, 402, 501, 502],
        'DES003': [101, 102, 201, 202, 203, 301, 302, 303, 401, 402, 403, 501, 502, 503],
        'DES004': [201, 202, 203, 301, 302, 401, 501, 502, 601, 602],
        'DES005': [201, 202, 203, 204, 205, 301, 302, 303, 304, 401, 402, 501, 502, 601, 602, 701, 702, 703],
        'DES006': [101, 201, 301, 302, 401, 501, 502, 701],
        'DES007': [101, 102, 201, 202, 301, 302, 303, 401, 402, 403, 501, 502, 701, 702],
        'DES008': [101, 201, 301, 302, 401, 501, 502, 601, 602, 701]
    };

    // Pre-assigned menus for different employees
    const employeeMenus = {
        'EMP001': [101, 201, 301, 302, 401, 501, 502],
        'EMP002': [101, 201, 202, 203, 301, 302, 401, 402, 501, 502, 601, 602],
        'EMP003': [101, 102, 201, 202, 203, 301, 302, 303, 401, 402, 403, 501, 502, 503],
        'EMP004': [101, 102, 201, 202, 301, 302, 303, 401, 402, 403, 501, 502, 701, 702],
        'EMP005': [101, 201, 301, 302, 401, 501, 502, 601, 602],
        'EMP006': [201, 202, 203, 301, 302, 401, 501, 502]
    };

    useEffect(() => {
        loadMenus();
    }, [mappingType, selectedRole, selectedDesignation, selectedEmployee]);

    const loadMenus = () => {
        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            let assignedMenus = [];

            if (mappingType === 'role' && selectedRole) {
                assignedMenus = roleMenus[selectedRole] || [];
            } else if (mappingType === 'designation' && selectedDesignation) {
                assignedMenus = designationMenus[selectedDesignation] || [];
            } else if (mappingType === 'employee' && selectedEmployee) {
                assignedMenus = employeeMenus[selectedEmployee] || [];
            }

            setSelectedSubMenus(assignedMenus);
            setLoading(false);
        }, 500);
    };

    const handleMappingTypeChange = (type) => {
        setMappingType(type);
        setSelectedRole('');
        setSelectedDesignation('');
        setSelectedEmployee('');
        setSelectedDepartment('');
        setSelectedSubMenus([]);
    };

    const handleLoadMapping = () => {
        loadMenus();
    };

    const handleMainMenuToggle = (mainMenuId) => {
        const subMenusInMain = subMenus
            .filter(sm => sm.main_menu_id === mainMenuId)
            .map(sm => sm.sub_menu_id);

        const allSelected = subMenusInMain.every(id => selectedSubMenus.includes(id));

        if (allSelected) {
            // Deselect all in this main menu
            setSelectedSubMenus(prev => prev.filter(id => !subMenusInMain.includes(id)));
        } else {
            // Select all in this main menu
            setSelectedSubMenus(prev => [...new Set([...prev, ...subMenusInMain])]);
        }
    };

    const handleSubMenuToggle = (subMenuId) => {
        setSelectedSubMenus(prev => {
            if (prev.includes(subMenuId)) {
                return prev.filter(id => id !== subMenuId);
            } else {
                return [...prev, subMenuId];
            }
        });
    };

    const handleExpandAll = () => {
        if (expandedMenus.length === mainMenus.length) {
            setExpandedMenus([]);
        } else {
            setExpandedMenus(mainMenus.map(m => m.main_menu_id));
        }
    };

    const handleSave = () => {
        setSaveStatus('saving');

        // Simulate API call
        setTimeout(() => {
            console.log('Saving menus for:', {
                type: mappingType,
                code: mappingType === 'role' ? selectedRole :
                    mappingType === 'designation' ? selectedDesignation : selectedEmployee,
                menus: selectedSubMenus
            });

            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset? All changes will be lost.')) {
            loadMenus();
        }
    };

    // Filter submenus based on search and active main menu
    const getFilteredSubMenus = () => {
        let filtered = subMenus.filter(sm => sm.is_active);

        // Filter by active main menu tab
        if (activeMainMenu !== 'all') {
            filtered = filtered.filter(sm => sm.main_menu_id === parseInt(activeMainMenu));
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(sm =>
                sm.sub_menu_name.toLowerCase().includes(query) ||
                sm.route_path.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    // Group submenus by main menu
    const getGroupedMenus = () => {
        const filtered = getFilteredSubMenus();
        const grouped = {};

        filtered.forEach(sm => {
            if (!grouped[sm.main_menu_id]) {
                grouped[sm.main_menu_id] = {
                    mainMenu: mainMenus.find(m => m.main_menu_id === sm.main_menu_id),
                    subMenus: []
                };
            }
            grouped[sm.main_menu_id].subMenus.push(sm);
        });

        return Object.values(grouped);
    };

    const groupedMenus = getGroupedMenus();
    const isMainMenuAllSelected = (mainMenuId) => {
        const subMenusInMain = subMenus
            .filter(sm => sm.main_menu_id === mainMenuId)
            .map(sm => sm.sub_menu_id);
        return subMenusInMain.length > 0 &&
            subMenusInMain.every(id => selectedSubMenus.includes(id));
    };

    const isMainMenuPartialSelected = (mainMenuId) => {
        const subMenusInMain = subMenus
            .filter(sm => sm.main_menu_id === mainMenuId)
            .map(sm => sm.sub_menu_id);
        const selectedCount = subMenusInMain.filter(id => selectedSubMenus.includes(id)).length;
        return selectedCount > 0 && selectedCount < subMenusInMain.length;
    };

    return (
        <div className="p-6">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Menu Mapping' }
                ]}
                title="Menu Mapping"
                description="Configure menu access based on role, designation, or employee"
            />

            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto border-b">
                    <button
                        onClick={() => handleMappingTypeChange('role')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'role'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        Role-wise Mapping
                    </button>

                    <button
                        onClick={() => handleMappingTypeChange('designation')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'designation'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <Briefcase className="w-4 h-4" />
                        Designation-wise Mapping
                    </button>

                    <button
                        onClick={() => handleMappingTypeChange('employee')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${mappingType === 'employee'
                                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                    >
                        <User className="w-4 h-4" />
                        Employee-wise Mapping
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {mappingType === 'role' && (
                        <div className="col-span-1">
                            <CommonDropDown
                                label="Select Role"
                                value={selectedRole}
                                onChange={setSelectedRole}
                                options={roles.map(r => ({
                                    label: r.role_name,
                                    value: r.role_code,
                                    description: `Role ID: ${r.role_id}`
                                }))}
                                placeholder="Choose a role"
                                required
                            />
                        </div>
                    )}

                    {mappingType === 'designation' && (
                        <>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Department"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments.map(d => ({
                                        label: d.dept_name,
                                        value: d.dept_code
                                    }))}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={filteredDesignations.map(d => ({
                                        label: d.designation_name,
                                        value: d.designation_code,
                                        description: d.dept
                                    }))}
                                    placeholder="Choose a designation"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {mappingType === 'employee' && (
                        <>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Department"
                                    value={selectedDepartment}
                                    onChange={setSelectedDepartment}
                                    options={departments.map(d => ({
                                        label: d.dept_name,
                                        value: d.dept_code
                                    }))}
                                    placeholder="Choose department"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Designation"
                                    value={selectedDesignation}
                                    onChange={setSelectedDesignation}
                                    options={filteredDesignations.map(d => ({
                                        label: d.designation_name,
                                        value: d.designation_code,
                                        description: d.dept
                                    }))}
                                    placeholder="Choose designation"
                                />
                            </div>
                            <div className="col-span-1">
                                <CommonDropDown
                                    label="Select Employee"
                                    value={selectedEmployee}
                                    onChange={setSelectedEmployee}
                                    options={filteredEmployees.map(e => ({
                                        label: e.emp_name,
                                        value: e.emp_code,
                                        description: `${e.designation} - ${e.department}`
                                    }))}
                                    placeholder="Choose an employee"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="flex items-end">
                        <button
                            onClick={handleLoadMapping}
                            disabled={
                                (mappingType === 'role' && !selectedRole) ||
                                (mappingType === 'designation' && !selectedDesignation) ||
                                (mappingType === 'employee' && !selectedEmployee)
                            }
                            className={`w-full px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${(mappingType === 'role' && !selectedRole) ||
                                    (mappingType === 'designation' && !selectedDesignation) ||
                                    (mappingType === 'employee' && !selectedEmployee)
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow'
                                }`}
                        >
                            <Download className="w-4 h-4" />
                            Load Mapping
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm mb-6">
                <div className="flex overflow-x-auto p-2 gap-1">
                    <button
                        onClick={() => setActiveMainMenu('all')}
                        className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeMainMenu === 'all'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Layers className="w-4 h-4" />
                        All Menus
                    </button>
                    {mainMenus.map(menu => (
                        <button
                            key={menu.main_menu_id}
                            onClick={() => setActiveMainMenu(menu.main_menu_id.toString())}
                            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 rounded-lg transition-all ${activeMainMenu === menu.main_menu_id.toString()
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span className={`w-2 h-2 rounded-full ${menu.color}`} />
                            {menu.menu_name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">Menu Access Configuration</h2>
                            <p className="text-sm text-gray-500">
                                {selectedSubMenus.length} menus selected • {subMenus.length} total menus
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by menu name or path..."
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleExpandAll}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1 whitespace-nowrap"
                            >
                                <Layers className="w-4 h-4" />
                                {expandedMenus.length === mainMenus.length ? 'Collapse All' : 'Expand All'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1 whitespace-nowrap"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-600">Loading menu configuration...</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">
                                Menu List
                            </h3>
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectedSubMenus.length === getFilteredSubMenus().length && getFilteredSubMenus().length > 0}
                                    onChange={() => {
                                        const filteredMenus = getFilteredSubMenus().map(sm => sm.sub_menu_id);
                                        if (selectedSubMenus.length === filteredMenus.length) {
                                            setSelectedSubMenus([]);
                                        } else {
                                            setSelectedSubMenus(filteredMenus);
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-600">Select All</span>
                            </label>
                        </div>

                        <div className="h-112.5 overflow-y-auto scrollbar pr-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {getFilteredSubMenus().map(subMenu => (
                                    <label
                                        key={subMenu.sub_menu_id}
                                        className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer transition-all group"
                                    >
                                        <input
                                            type="checkbox"
                                            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={selectedSubMenus.includes(subMenu.sub_menu_id)}
                                            onChange={() => handleSubMenuToggle(subMenu.sub_menu_id)}
                                        />
                                        <div className="flex-1">
                                            <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-700">
                                                {subMenu.sub_menu_name}
                                            </div>
                                            <div className="text-xs text-gray-400 group-hover:text-indigo-400 mt-0.5">
                                                {subMenu.route_path}
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {getFilteredSubMenus().length === 0 && (
                                <div className="p-12 text-center">
                                    <MenuIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Menus Found</h3>
                                    <p className="text-gray-600">
                                        {searchQuery ? 'Try adjusting your search criteria' : 'Select a filter to view menus'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={handleReset}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    disabled={loading || saveStatus === 'saving' ||
                        (mappingType === 'role' && !selectedRole) ||
                        (mappingType === 'designation' && !selectedDesignation) ||
                        (mappingType === 'employee' && !selectedEmployee)
                    }
                    className={`px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all ${saveStatus === 'success'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        } ${(!selectedRole && !selectedDesignation && !selectedEmployee) ? 'opacity-50 cursor-not-allowed' : 'shadow-sm hover:shadow'}`}
                >
                    {saveStatus === 'saving' ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Saving...
                        </>
                    ) : saveStatus === 'success' ? (
                        <>
                            <Check className="w-4 h-4" />
                            Saved Successfully
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Save Configuration
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export default MenuMappingTest;