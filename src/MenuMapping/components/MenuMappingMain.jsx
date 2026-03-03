import React, { useState, useEffect } from "react";
import MenuMappingTabSection from "./MenuMappingTabSection";
import MenuMappingTypeSection from "./MenuMappingTypeSection";
import { Database, FolderTree, Globe, Layers, MenuIcon, Settings, Users } from "lucide-react";
import MenuMappingMenuSection from "./MenuMappingMenuSection";

function MenuMappingMain({ isLoading, setIsLoading }) {
    const [mappingType, setMappingType] = useState('role');
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

    const handleMappingTypeChange = (type) => {
        setMappingType(type);
        setSelectedRole('');
        setSelectedDesignation('');
        setSelectedEmployee('');
        setSelectedDepartment('');
        setSelectedSubMenus([]);
    };
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
    const handleLoadMapping = () => {
        loadMenus();
    }

    const handleSubMenuToggle = (subMenuId) => {
        setSelectedSubMenus(prev => {
            if (prev.includes(subMenuId)) {
                return prev.filter(id => id !== subMenuId);
            } else {
                return [...prev, subMenuId];
            }
        });
    }

    const handleExpandAll = () => {
        if (expandedMenus.length === mainMenus.length) {
            setExpandedMenus([]);
        } else {
            setExpandedMenus(mainMenus.map(m => m.main_menu_id));
        }
    }

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
                filteredDes ignations={filteredDesignations}
                filteredEmployees={filteredEmployees}
                handleLoadMapping={handleLoadMapping}
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
            />
        </>
    )
}
export default MenuMappingMain  