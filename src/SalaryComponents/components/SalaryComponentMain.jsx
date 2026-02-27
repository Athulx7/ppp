import React, { useEffect, useState } from 'react'
import SalaryComponentTabSection from './SalaryComponentTabSection';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import { BarChart, Building, Calculator, Clock, DollarSign, Edit, Eye, Layers, Minus, Percent, Plus, Trash2, TrendingUp, Zap } from 'lucide-react';
import SalaryComponentModal from './SalaryComponentModal';
import { ApiCall } from '../../library/constants';
import CommonTable from '../../basicComponents/commonTable';

function SalaryComponentMain({ isLoading, setIsLoading }) {
    const [activeTab, setActiveTab] = useState('earnings');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [calculationType, setCalculationType] = useState({
        calculationTypeDDL: [],
        selectCalculationType: "",
    })
    const [componentType, setComponentType] = useState({
        componentTypeDDL: [],
        selectComponentType: "",
    })

    useEffect(() => {
        getCalculationTypeDDL()
        getComponentTypeDDL()
    }, [])

    async function getCalculationTypeDDL() {
        setIsLoading(true)
        try {
            const responce = await ApiCall('get', '/salaryComponent/calculationTypeDDL')
            console.log('responce', responce)
            setCalculationType(prev => ({
                ...prev,
                calculationTypeDDL: responce.data.data
            }))
        }
        catch (err) {
            console.log('error getCalculationTypeDDL', err)
        }
        setIsLoading(false)
    }

    async function getComponentTypeDDL() {
        setIsLoading(true)
        try {
            const responce = await ApiCall('get', '/salaryComponent/componentTypeDDL')
            console.log('responce of the compoennt type DDL', responce)
            setComponentType(prev => ({
                ...prev,
                componentTypeDDL: responce.data.data
            }))
        }
        catch (err) {
            console.log('error getComponentTypeDDL', err)
        }
        setIsLoading(false)
    }

    const handleDeleteComponent = (id) => {
        console.log('Delete component with id:', id);
    }
    const componentTypeOptions = [
        { value: 'earning', label: 'Earning' },
        { value: 'deduction', label: 'Deduction' },
        { value: 'employer', label: 'Employer Contribution' },
    ];

    const calculationTypeOptions = [
        { value: 'fixed', label: 'Fixed Amount' },
        { value: 'formula', label: 'Formula Based' },
        { value: 'percentage', label: 'Percentage of Basic' },
        { value: 'attendance', label: 'Attendance Based' },
        { value: 'performance', label: 'Performance Based' },
        { value: 'sales', label: 'Sales Commission' },
        { value: 'overtime', label: 'Overtime Based' },
    ];
    const baseComponentOptions = [
        { value: 'BASIC', label: 'Basic Salary (BASIC)' },
        { value: 'CTC', label: 'Cost to Company (CTC)' },
        { value: 'GROSS', label: 'Gross Salary' },
    ];
    const [components, setComponents] = useState({
        earnings: [
            {
                id: 1,
                name: 'Basic Salary',
                code: 'BASIC',
                type: 'earning',
                calculationType: 'percentage',
                formula: '50% of CTC',
                status: 'active',
                affectsGross: true,
                affectsNet: true,
                taxable: true,
                priority: 1,
                createdDate: '2024-01-15'
            },
            {
                id: 2,
                name: 'House Rent Allowance',
                code: 'HRA',
                type: 'earning',
                calculationType: 'percentage',
                formula: '40% of Basic',
                status: 'active',
                affectsGross: true,
                affectsNet: true,
                taxable: true,
                priority: 2,
                createdDate: '2024-01-15'
            },
            {
                id: 3,
                name: 'Special Allowance',
                code: 'SA',
                type: 'earning',
                calculationType: 'formula',
                formula: 'CTC - (Basic + HRA)',
                status: 'active',
                affectsGross: true,
                affectsNet: true,
                taxable: true,
                priority: 3,
                createdDate: '2024-01-15'
            },
        ],
        deductions: [
            {
                id: 4,
                name: 'Professional Tax',
                code: 'PT',
                type: 'deduction',
                calculationType: 'fixed',
                formula: '₹200 per month',
                status: 'active',
                affectsGross: false,
                affectsNet: true,
                taxable: false,
                priority: 1,
                createdDate: '2024-01-15'
            },
            {
                id: 5,
                name: 'Employee PF',
                code: 'EPF',
                type: 'deduction',
                calculationType: 'percentage',
                formula: '12% of Basic',
                status: 'active',
                affectsGross: false,
                affectsNet: true,
                taxable: false,
                priority: 2,
                createdDate: '2024-01-15'
            },
        ],
        employerContributions: [
            {
                id: 6,
                name: 'Employer PF',
                code: 'EPF_ER',
                type: 'employer',
                calculationType: 'percentage',
                formula: '13.61% of Basic',
                status: 'active',
                affectsGross: false,
                affectsNet: false,
                taxable: false,
                priority: 1,
                createdDate: '2024-01-15'
            },
        ]
    });

    const [newComponent, setNewComponent] = useState({
        name: '',
        code: '',
        type: 'earning',
        calculationType: 'fixed',
        formula: '',
        affectsGross: true,
        affectsNet: true,
        taxable: false,
        priority: 1,
        status: 'active'
    });
    const handleCreateComponent = () => {
        const newId = Math.max(...[...components.earnings, ...components.deductions, ...components.employerContributions].map(c => c.id)) + 1;
        const component = { ...newComponent, id: newId, createdDate: new Date().toISOString().split('T')[0] };

        const key = newComponent.type === 'earning' ? 'earnings' :
            newComponent.type === 'deduction' ? 'deductions' :
                'employerContributions';

        setComponents(prev => ({
            ...prev,
            [key]: [...prev[key], component]
        }));

        // Reset form
        setNewComponent({
            name: '',
            code: '',
            type: 'earning',
            calculationType: 'fixed',
            formula: '',
            affectsGross: true,
            affectsNet: true,
            taxable: false,
            priority: 1,
            status: 'active'
        });

        setShowCreateModal(false);
        setSelectedComponent(null);
    };

    const handleChange = (field, value) => {
        setNewComponent(prev => ({ ...prev, [field]: value }));
    };

    // Insert operator into formula
    const insertOperator = (operator) => {
        setNewComponent(prev => ({
            ...prev,
            formula: prev.formula + ` ${operator} `
        }));
    };
    const tableColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditComponent(row)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => handleDeleteComponent(row.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={() => console.log('View', row)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                    >
                        <Eye size={16} />
                    </button>
                </div>
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
            header: "Component Name",
            accessor: "name",
            cell: row => (
                <div className="flex items-center">
                    <div className="ml-3">
                        <div className="font-medium text-gray-900">{row.name}</div>
                        <div className="text-sm text-gray-500">
                            {row.affectsGross && 'Gross '}
                            {row.affectsNet && 'Net '}
                            {row.taxable && 'Taxable'}
                        </div>
                    </div>
                </div>
            )
        },

        {
            header: "Calculation Type",
            accessor: "calculationType",
            cell: row => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">
                        {calculationTypeOptions.find(t => t.value === row.calculationType)?.label}
                    </span>
                </div>
            )
        },
        {
            header: "Formula",
            accessor: "formula",
            cell: row => (
                <div className="text-sm text-gray-900">{row.formula}</div>
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
            header: "Created Date",
            accessor: "createdDate"
        }
    ];

    const getTableData = () => {
        const data = activeTab === 'earnings' ? components.earnings :
            activeTab === 'deductions' ? components.deductions :
                components.employerContributions;

        return data.map(item => ({
            ...item,
            onEdit: handleEditComponent
        }));
    };
    const insertComponentCode = (code) => {
        setNewComponent(prev => ({
            ...prev,
            formula: prev.formula + ` ${code} `
        }));
    };
    const handleEditComponent = (component) => { console.log('Edit component', component) }
    const allComponentCodes = [
        ...components.earnings.map(c => ({ value: c.code, label: c.name })),
        ...components.deductions.map(c => ({ value: c.code, label: c.name })),
        ...components.employerContributions.map(c => ({ value: c.code, label: c.name }))
    ];

    return (
        <>
            <SalaryComponentTabSection
                activeTab={activeTab}
                components={components}
                setActiveTab={setActiveTab}
                setShowCreateModal={setShowCreateModal}
            />

            <CommonTable
                columns={tableColumns}
                data={getTableData()}
                loading={isLoading}
            />

            {
                showCreateModal && (
                    <SalaryComponentModal
                        selectedComponent={selectedComponent}
                        setSelectedComponent={setSelectedComponent}
                        setShowCreateModal={setShowCreateModal}
                        newComponent={newComponent}
                        setNewComponent={setNewComponent}
                        handleChange={handleChange}
                        insertOperator={insertOperator}
                        componentTypeOptions={componentTypeOptions}
                        calculationTypeOptions={calculationTypeOptions}
                        handleCreateComponent={handleCreateComponent}
                        allComponentCodes={allComponentCodes}
                        baseComponentOptions={baseComponentOptions}
                        insertComponentCode={insertComponentCode}
                    />
                )
            }
            {/* {isLoading && <LoadingSpinner />} */}
        </>
    )
}

export default SalaryComponentMain