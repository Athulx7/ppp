import { Edit, History, Layers, Link, Plus, Trash2, Users } from 'lucide-react';
import React, { useState } from 'react'
import CommonTable from '../../basicComponents/commonTable';
import SalaryAssignmentListPage from './SalaryAssignmentListPage';
import SalaryHostoryListPage from './SalaryHostoryListPage';
import { useNavigate } from 'react-router-dom';
import SalaryStructureAssignment from '../container/SalaryStructureAssignmentTest';

function SalaryStructureMain({ isLoading, setIsLoading, handleEditStructure }) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('structures')
    const [viewMode, setViewMode] = useState('list')
    const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false)
    const [assignPopupId, setAssignPopupId] = useState(null)
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

    const structureColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => console.log('Hhheello')}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => console.log('Hhheello')}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        },
        {
            header: "Code",
            accessor: "code",
            cell: row => (
                <span className=" text-gray-800 rounded text-sm">
                    {row.code}
                </span>
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
            header: "Created Date",
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
        },
    ];

    const handleOpenAssignPopup = (id = null) => {
        setAssignPopupId(id);
        setIsAssignPopupOpen(true);
    };

    const handleCloseAssignPopup = () => {
        setIsAssignPopupOpen(false);
        setAssignPopupId(null);
    };

    return (
        <>
            <div className='flex justify-between border-b border-gray-200 bg-white rounded-t-md'>
                <div className="flex ">
                    <button
                        onClick={() => { setActiveTab('structures'); setViewMode('list'); }}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors rounded-t-md ${activeTab === 'structures' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Layers size={16} />
                        Structures
                    </button>
                    <button
                        onClick={() => { setActiveTab('assignments'); setViewMode('employee'); }}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors rounded-t-md ${activeTab === 'assignments' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Users size={16} />
                        Assignments
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors rounded-t-md ${activeTab === 'history' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                    >
                        <History size={16} />
                        History
                    </button>
                </div>

                <div className="flex items-center gap-3 p-1">
                    <button onClick={() => navigate('/admin/salary_structure/create')}
                        className="px-4 py-2 bg-indigo-50 text-indigo-500 rounded-md text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create Structure
                    </button>
                    <button onClick={() => handleOpenAssignPopup()}
                        className="px-4 py-2 bg-green-50 text-green-500 rounded-md text-sm font-medium hover:bg-green-100 transition-colors flex items-center gap-2"
                    >
                        <Link size={16} />
                        Assign Structure
                    </button>
                </div>
            </div>

            {activeTab === 'structures' && (
                <CommonTable
                    columns={structureColumns}
                    data={structures.map(s => ({ ...s, onEdit: handleEditStructure }))}
                />
            )}

            {activeTab === 'assignments' && (
                <div className='mt-3'>
                    <SalaryAssignmentListPage isLoading={isLoading} setIsLoading={setIsLoading} onEditAssignment={handleOpenAssignPopup} />
                </div>
            )}

            {activeTab === 'history' && (
                <div className='mt-3'>
                    <SalaryHostoryListPage isLoading={isLoading} setIsLoading={setIsLoading} />
                </div>
            )}

            <SalaryStructureAssignment 
                isOpen={isAssignPopupOpen} 
                onClose={handleCloseAssignPopup} 
                assignmentId={assignPopupId} 
            />

        </>
    )
}

export default SalaryStructureMain