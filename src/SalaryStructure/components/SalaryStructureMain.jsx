import { Edit, History, Layers, Link, Plus, Trash2, Users, Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import CommonTable from '../../basicComponents/commonTable';
import SalaryAssignmentListPage from './SalaryAssignmentListPage';
import SalaryHostoryListPage from './SalaryHostoryListPage';
import { useNavigate } from 'react-router-dom';
import SalaryStructureAssignment from '../container/SalaryStructureAssignmentTest';
import { ApiCall, getRoleBasePath } from '../../library/constants';

function SalaryStructureMain({ isLoading, setIsLoading, handleEditStructure }) {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('structures')
    const [viewMode, setViewMode] = useState('list')
    const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false)
    const [assignPopupId, setAssignPopupId] = useState(null)
    const [structures, setStructures] = useState([]);

    const structureColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">

                    {row.isEditable ? (
                        <button
                            onClick={() => navigate(`${getRoleBasePath()}/salary_structure/edit/${row.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate(`${getRoleBasePath()}/salary_structure/view/${row.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View"
                        >
                            <Eye size={16} />
                        </button>
                    )}

                    <button
                        onClick={() => row.isDeletable && console.log('delete', row.id)}
                        disabled={!row.isDeletable}
                        className={`${row.isDeletable
                                ? 'text-red-600 hover:text-red-900'
                                : 'text-gray-400 cursor-not-allowed'
                            }`}
                        title={row.isDeletable ? "Delete" : "Cannot delete (in use)"}
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
            accessor: "createdDate"
        },
        {
            header: "Created By",
            accessor: "createdBy"
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

    useEffect(() => {
        fetchStructures()
    }, [])

    async function fetchStructures() {
        try {
            setIsLoading({ normal: true, spinner: false })

            const res = await ApiCall('get', '/salarystructure/list')

            if (res?.data?.success) {
                const formatted = res.data.data.map(item => ({
                    id: item.id,
                    code: item.structure_code,
                    name: item.structure_name,
                    description: item.description,
                    components: new Array(item.component_count).fill({}), // just for count
                    totalCost: 0, // optional (we can calculate later)
                    effectiveDate: item.created_at,
                    status: item.status ? 'active' : 'inactive',
                    createdDate: item.created_at,
                    createdBy: item.created_by,
                    isEditable: item.is_editable === 1,
                    isDeletable: item.is_deletable === 1
                }))

                setStructures(formatted)
            }

        } catch (err) {
            console.error('fetchStructures:', err)
        } finally {
            setIsLoading({ normal: false, spinner: false })
        }
    }

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
                    <button onClick={() =>navigate(`${getRoleBasePath()}/salary_structure/create`)}
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