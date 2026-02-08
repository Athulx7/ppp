import React, { useState } from 'react';
import {
    Plus, Filter, Search, Edit, Trash2, Eye, Download,
    ChevronDown, Calculator, DollarSign, Minus, Building,
    Check, X, Hash, Percent, TrendingUp, Clock,
    Layers, Type, FileText, Copy, Save, RefreshCw,
    ChevronRight, HelpCircle, Zap, BarChart, Users,
    User, Award, Briefcase, History, Link, Unlink,
    Calendar, FolderTree, Package, Settings, Database,
    Grid, MoreHorizontal, ChevronLeft, CheckCircle
} from 'lucide-react';
import CommonTable from '../../basicComponents/commonTable';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonInputField from '../../basicComponents/CommonInputField';
import { useNavigate } from 'react-router-dom';
import { getRoleBasePath } from '../../library/constants';

function SalaryStructureEntry() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('structures');
    const [viewMode, setViewMode] = useState('list');

    // Sample data - Same as before but without modal logic
    const [structures, setStructures] = useState([
        {
            id: 1,
            name: 'Junior Software Engineer',
            code: 'JSE-STR',
            description: 'Standard structure for junior software engineers',
            components: [
                { componentId: 1, name: 'Basic Salary', code: 'BASIC', type: 'earning', amount: 50000, calculation: 'fixed' },
                { componentId: 2, name: 'House Rent Allowance', code: 'HRA', type: 'earning', amount: 40, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 3, name: 'Special Allowance', code: 'SA', type: 'earning', amount: 10000, calculation: 'fixed' },
                { componentId: 4, name: 'Employee PF', code: 'EPF', type: 'deduction', amount: 12, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 5, name: 'Professional Tax', code: 'PT', type: 'deduction', amount: 200, calculation: 'fixed' }
            ],
            status: 'active',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            totalCost: 65200
        },
        {
            id: 2,
            name: 'Senior Software Engineer',
            code: 'SSE-STR',
            description: 'Standard structure for senior software engineers',
            components: [
                { componentId: 1, name: 'Basic Salary', code: 'BASIC', type: 'earning', amount: 80000, calculation: 'fixed' },
                { componentId: 2, name: 'House Rent Allowance', code: 'HRA', type: 'earning', amount: 40, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 3, name: 'Special Allowance', code: 'SA', type: 'earning', amount: 20000, calculation: 'fixed' },
                { componentId: 4, name: 'Employee PF', code: 'EPF', type: 'deduction', amount: 12, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 5, name: 'Professional Tax', code: 'PT', type: 'deduction', amount: 200, calculation: 'fixed' },
                { componentId: 6, name: 'Performance Bonus', code: 'BONUS', type: 'earning', amount: 15, calculation: 'percentage', basedOn: 'GROSS' }
            ],
            status: 'active',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            totalCost: 110400
        },
        {
            id: 3,
            name: 'HR Executive',
            code: 'HRE-STR',
            description: 'Standard structure for HR executives',
            components: [
                { componentId: 1, name: 'Basic Salary', code: 'BASIC', type: 'earning', amount: 45000, calculation: 'fixed' },
                { componentId: 2, name: 'House Rent Allowance', code: 'HRA', type: 'earning', amount: 40, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 3, name: 'Conveyance Allowance', code: 'CA', type: 'earning', amount: 1600, calculation: 'fixed' },
                { componentId: 4, name: 'Medical Allowance', code: 'MA', type: 'earning', amount: 1250, calculation: 'fixed' },
                { componentId: 5, name: 'Employee PF', code: 'EPF', type: 'deduction', amount: 12, calculation: 'percentage', basedOn: 'BASIC' },
                { componentId: 6, name: 'Professional Tax', code: 'PT', type: 'deduction', amount: 200, calculation: 'fixed' }
            ],
            status: 'active',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            totalCost: 52720
        }
    ]);

    // Navigation functions
    const handleCreateStructure = () => {
        navigate(`${getRoleBasePath()}/salary_structure/create`);
    };

    const handleEditStructure = (structure) => {
        navigate(`${getRoleBasePath()}/salary_structure/edit/${structure.id}`);
    };

    const handleAssignStructure = (structure) => {
        // You can keep this as a modal or create separate page for assignment
        // For now, navigate to assignment page
        navigate(`${getRoleBasePath()}/salary_structure/assign/${structure.id}`);
    };

    // Sample data - Designations
    const designations = [
        { id: 1, name: 'Junior Software Engineer', code: 'JSE', department: 'Engineering' },
        { id: 2, name: 'Senior Software Engineer', code: 'SSE', department: 'Engineering' },
        { id: 3, name: 'Team Lead', code: 'TL', department: 'Engineering' },
        { id: 4, name: 'HR Executive', code: 'HRE', department: 'Human Resources' },
        { id: 5, name: 'Sales Executive', code: 'SE', department: 'Sales' },
        { id: 6, name: 'Marketing Manager', code: 'MM', department: 'Marketing' },
    ];

    // Sample data - Employees
    const employees = [
        { id: 101, name: 'John Smith', employeeCode: 'EMP001', designation: 'Junior Software Engineer', department: 'Engineering', joiningDate: '2023-06-15' },
        { id: 102, name: 'Sarah Johnson', employeeCode: 'EMP002', designation: 'Senior Software Engineer', department: 'Engineering', joiningDate: '2022-03-10' },
        { id: 103, name: 'Mike Chen', employeeCode: 'EMP003', designation: 'HR Executive', department: 'Human Resources', joiningDate: '2023-08-22' },
        { id: 104, name: 'Priya Sharma', employeeCode: 'EMP004', designation: 'Junior Software Engineer', department: 'Engineering', joiningDate: '2024-01-05' },
        { id: 105, name: 'David Lee', employeeCode: 'EMP005', designation: 'Sales Executive', department: 'Sales', joiningDate: '2023-11-30' },
    ];

    // Sample data - Structure Assignments
    const [assignments, setAssignments] = useState([
        {
            id: 1,
            type: 'designation',
            targetId: 1,
            targetName: 'Junior Software Engineer',
            structureId: 1,
            structureName: 'Junior Software Engineer',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            status: 'active'
        },
        {
            id: 2,
            type: 'designation',
            targetId: 2,
            targetName: 'Senior Software Engineer',
            structureId: 2,
            structureName: 'Senior Software Engineer',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            status: 'active'
        },
        {
            id: 3,
            type: 'designation',
            targetId: 4,
            targetName: 'HR Executive',
            structureId: 3,
            structureName: 'HR Executive',
            effectiveDate: '2024-01-01',
            createdDate: '2024-01-15',
            createdBy: 'Admin',
            status: 'active'
        },
        {
            id: 4,
            type: 'employee',
            targetId: 101,
            targetName: 'John Smith',
            employeeCode: 'EMP001',
            structureId: 1,
            structureName: 'Junior Software Engineer',
            effectiveDate: '2023-06-15',
            createdDate: '2023-06-15',
            createdBy: 'Admin',
            status: 'active'
        },
        {
            id: 5,
            type: 'employee',
            targetId: 102,
            targetName: 'Sarah Johnson',
            employeeCode: 'EMP002',
            structureId: 2,
            structureName: 'Senior Software Engineer',
            effectiveDate: '2022-03-10',
            createdDate: '2022-03-10',
            createdBy: 'Admin',
            status: 'active'
        },
    ]);

    // Sample data - Structure History
    const [structureHistory, setStructureHistory] = useState([
        {
            id: 1,
            employeeId: 101,
            employeeName: 'John Smith',
            oldStructureId: null,
            oldStructureName: null,
            newStructureId: 1,
            newStructureName: 'Junior Software Engineer',
            changedDate: '2023-06-15',
            changedBy: 'Admin',
            reason: 'Initial assignment on joining'
        },
        {
            id: 2,
            employeeId: 102,
            employeeName: 'Sarah Johnson',
            oldStructureId: 1,
            oldStructureName: 'Junior Software Engineer',
            newStructureId: 2,
            newStructureName: 'Senior Software Engineer',
            changedDate: '2024-01-15',
            changedBy: 'HR Manager',
            reason: 'Promotion to Senior Software Engineer'
        },
    ]);


    // Structure table columns
    const structureColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditStructure(row)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteStructure(row.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => handleViewStructure(row)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        onClick={() => handleAssignStructure(row)}
                        className="text-green-600 hover:text-green-900"
                        title="Assign Structure"
                    >
                        <Link size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Structure Name",
            accessor: "name",
            cell: row => (
                <div className="font-medium text-gray-900">{row.name}</div>
            )
        },
        {
            header: "Code",
            accessor: "code",
            cell: row => (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                    {row.code}
                </span>
            )
        },
        {
            header: "Components",
            accessor: "components",
            cell: row => (
                <div className="text-sm text-gray-600">
                    {row.components.length} components
                </div>
            )
        },
        {
            header: "Total Cost",
            accessor: "totalCost",
            cell: row => (
                <div className="font-medium text-gray-900">
                    ₹{row.totalCost?.toLocaleString() || '0'}
                </div>
            )
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "Effective Date",
            accessor: "effectiveDate"
        }
    ];

    // Assignments table columns (for employee view)
    const assignmentColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleUnassign(row)}
                        className="text-red-600 hover:text-red-900"
                        title="Unassign"
                    >
                        <Unlink size={16} />
                    </button>
                    <button
                        onClick={() => handleViewHistory(row)}
                        className="text-purple-600 hover:text-purple-900"
                        title="View History"
                    >
                        <History size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Employee",
            accessor: "targetName",
            cell: row => (
                <div>
                    <div className="font-medium text-gray-900">{row.targetName}</div>
                    <div className="text-sm text-gray-500">{row.employeeCode}</div>
                </div>
            )
        },
        {
            header: "Designation",
            accessor: "designation",
            cell: row => (
                <div className="text-sm text-gray-900">
                    {employees.find(e => e.id === row.targetId)?.designation || '-'}
                </div>
            )
        },
        {
            header: "Structure",
            accessor: "structureName",
            cell: row => (
                <div className="font-medium text-indigo-600">{row.structureName}</div>
            )
        },
        {
            header: "Type",
            accessor: "type",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.type === 'designation' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {row.type === 'designation' ? 'Designation Based' : 'Individual'}
                </span>
            )
        },
        {
            header: "Effective Date",
            accessor: "effectiveDate"
        },
        {
            header: "Status",
            accessor: "status",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.status}
                </span>
            )
        }
    ];

    // History table columns
    const historyColumns = [
        {
            header: "Employee",
            accessor: "employeeName",
            cell: row => (
                <div className="font-medium text-gray-900">{row.employeeName}</div>
            )
        },
        {
            header: "Previous Structure",
            accessor: "oldStructureName",
            cell: row => (
                <div className={row.oldStructureName ? "text-sm text-gray-600" : "text-sm text-gray-400 italic"}>
                    {row.oldStructureName || 'No previous structure'}
                </div>
            )
        },
        {
            header: "New Structure",
            accessor: "newStructureName",
            cell: row => (
                <div className="font-medium text-green-600">{row.newStructureName}</div>
            )
        },
        {
            header: "Change Date",
            accessor: "changedDate"
        },
        {
            header: "Changed By",
            accessor: "changedBy"
        },
        {
            header: "Reason",
            accessor: "reason",
            cell: row => (
                <div className="text-sm text-gray-600 max-w-xs truncate">{row.reason}</div>
            )
        }
    ];

    // Handle structure deletion
    const handleDeleteStructure = (id) => {
        if (window.confirm('Are you sure you want to delete this structure? This will affect all assigned employees.')) {
            setStructures(prev => prev.filter(s => s.id !== id));
        }
    };

    // Handle view structure details
    const handleViewStructure = (structure) => {
        // In a real app, this would open a detail view modal
        alert(`Viewing structure: ${structure.name}\nComponents: ${structure.components.length}\nTotal Cost: ₹${structure.totalCost}`);
    };

    // Handle unassign
    const handleUnassign = (assignment) => {
        if (window.confirm(`Are you sure you want to unassign this structure from ${assignment.targetName}?`)) {
            setAssignments(prev => prev.map(a =>
                a.id === assignment.id ? { ...a, status: 'inactive' } : a
            ));
        }
    };

    // Handle view history
    const handleViewHistory = (assignment) => {
        const employeeHistory = structureHistory.filter(h => h.employeeId === assignment.targetId);
        alert(`History for ${assignment.targetName}:\n\n${employeeHistory.map(h =>
            `${h.changedDate}: ${h.oldStructureName || 'None'} → ${h.newStructureName} (${h.reason})`
        ).join('\n')}`);
    };

    // Get filtered assignments based on view mode
    const getFilteredAssignments = () => {
        let filtered = assignments.filter(a => a.status === 'active');

        if (viewMode === 'designation') {
            filtered = filtered.filter(a => a.type === 'designation');
        } else if (viewMode === 'employee') {
            filtered = filtered.filter(a => a.type === 'employee');
        }

        return filtered.map(item => ({
            ...item,
            onEdit: handleEditStructure,
            designation: employees.find(e => e.id === item.targetId)?.designation
        }));
    };


    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Salary Structure Management</h1>
                        <p className="text-gray-600">Create and manage salary structures, assign to designations or employees, and track history</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleCreateStructure}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Create Structure
                        </button>
                        <button onClick={handleAssignStructure}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Link size={16} />
                            Assign Structure
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => { setActiveTab('structures'); setViewMode('list'); }}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'structures' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Layers size={16} />
                        Structures
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            {structures.length}
                        </span>
                    </button>
                    <button
                        onClick={() => { setActiveTab('assignments'); setViewMode('employee'); }}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'assignments' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Users size={16} />
                        Assignments
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            {assignments.filter(a => a.status === 'active').length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <History size={16} />
                        History
                        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                            {structureHistory.length}
                        </span>
                    </button>
                </div>

                {/* Assignment View Mode Selector */}
                {activeTab === 'assignments' && (
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={() => setViewMode('employee')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${viewMode === 'employee' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <User size={14} className="inline mr-1" />
                            Employee View
                        </button>
                        <button
                            onClick={() => setViewMode('designation')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${viewMode === 'designation' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <Award size={14} className="inline mr-1" />
                            Designation View
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <Grid size={14} className="inline mr-1" />
                            All Assignments
                        </button>
                    </div>
                )}
            </div>

            {/* Content based on active tab */}
            {activeTab === 'structures' && (
                <CommonTable
                    columns={structureColumns}
                    data={structures.map(s => ({ ...s, onEdit: handleEditStructure }))}
                />
            )}

            {activeTab === 'assignments' && (
                <div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">
                            {viewMode === 'employee' ? 'Employee Assignments' :
                                viewMode === 'designation' ? 'Designation Assignments' :
                                    'All Active Assignments'}
                        </h3>
                        <p className="text-gray-600">
                            {getFilteredAssignments().length} active assignment(s)
                        </p>
                    </div>
                    <CommonTable
                        columns={assignmentColumns}
                        data={getFilteredAssignments()}
                    />
                </div>
            )}

            {activeTab === 'history' && (
                <div>
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Structure Change History</h3>
                        <p className="text-gray-600">
                            Track all salary structure changes for employees
                        </p>
                    </div>
                    <CommonTable
                        columns={historyColumns}
                        data={structureHistory}
                    />
                </div>
            )}

            {/* Create/Edit Structure Modal */}
            
        </div>
    );
}

export default SalaryStructureEntry;