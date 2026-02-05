import React, { useState } from 'react';
import {
    Plus, Filter, Search, Edit, Trash2, Eye, Download,
    ChevronDown, Calculator, DollarSign, Minus, Building,
    Check, X, Hash, Percent, TrendingUp, Clock,
    Layers, Type, FileText, Copy, Save, RefreshCw,
    ChevronRight, HelpCircle, Zap, BarChart
} from 'lucide-react';
import CommonTable from '../../basicComponents/commonTable';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonToggleButton from '../../basicComponents/CommonToggleButton';
import BreadCrumb from '../../basicComponents/BreadCrumb';

function SalaryComponentEntry() {
    const [activeTab, setActiveTab] = useState('earnings');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [approved, setApproved] = useState(true);

    // Component type options for CommonDropDown
    const componentTypeOptions = [
        { value: 'earning', label: 'Earning' },
        { value: 'deduction', label: 'Deduction' },
        { value: 'employer', label: 'Employer Contribution' },
    ];

    // Calculation type options for CommonDropDown
    const calculationTypeOptions = [
        { value: 'fixed', label: 'Fixed Amount' },
        { value: 'formula', label: 'Formula Based' },
        { value: 'percentage', label: 'Percentage of Basic' },
        { value: 'attendance', label: 'Attendance Based' },
        { value: 'performance', label: 'Performance Based' },
        { value: 'sales', label: 'Sales Commission' },
        { value: 'overtime', label: 'Overtime Based' },
    ];

    // Base component options for formula (when using percentage type)
    const baseComponentOptions = [
        { value: 'BASIC', label: 'Basic Salary (BASIC)' },
        { value: 'CTC', label: 'Cost to Company (CTC)' },
        { value: 'GROSS', label: 'Gross Salary' },
    ];

    // Table columns configuration
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
            header: "Component Name",
            accessor: "name",
            cell: row => (
                <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getTypeColor(row.type)}`}>
                        {getTypeIcon(row.type)}
                    </div>
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
            header: "Code",
            accessor: "code",
            cell: row => (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                    {row.code}
                </span>
            )
        },
        {
            header: "Calculation Type",
            accessor: "calculationType",
            cell: row => (
                <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-gray-100">
                        {getCalculationTypeIcon(row.calculationType)}
                    </div>
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

    // Helper functions for table cells
    const getTypeColor = (type) => {
        switch (type) {
            case 'earning': return 'bg-green-100 text-green-700';
            case 'deduction': return 'bg-red-100 text-red-700';
            case 'employer': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'earning': return <Plus size={16} />;
            case 'deduction': return <Minus size={16} />;
            case 'employer': return <Building size={16} />;
            default: return <Layers size={16} />;
        }
    };

    const getCalculationTypeIcon = (type) => {
        switch (type) {
            case 'fixed': return <DollarSign size={14} className="text-gray-600" />;
            case 'formula': return <Calculator size={14} className="text-gray-600" />;
            case 'percentage': return <Percent size={14} className="text-gray-600" />;
            case 'attendance': return <Clock size={14} className="text-gray-600" />;
            case 'performance': return <TrendingUp size={14} className="text-gray-600" />;
            case 'sales': return <BarChart size={14} className="text-gray-600" />;
            case 'overtime': return <Zap size={14} className="text-gray-600" />;
            default: return <Calculator size={14} className="text-gray-600" />;
        }
    };

    // Sample salary components data
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

    // Get all component codes for formula builder
    const allComponentCodes = [
        ...components.earnings.map(c => ({ value: c.code, label: c.name })),
        ...components.deductions.map(c => ({ value: c.code, label: c.name })),
        ...components.employerContributions.map(c => ({ value: c.code, label: c.name }))
    ];

    // New component form state
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

    // Handle form field changes
    const handleChange = (field, value) => {
        setNewComponent(prev => ({ ...prev, [field]: value }));
    };

    // Handle component creation
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

    // Handle component edit
    const handleEditComponent = (component) => {
        setSelectedComponent(component);
        setNewComponent({ ...component });
        setShowCreateModal(true);
    };

    // Handle component deletion
    const handleDeleteComponent = (id) => {
        if (window.confirm('Are you sure you want to delete this component?')) {
            const key = activeTab === 'earnings' ? 'earnings' :
                activeTab === 'deductions' ? 'deductions' :
                    'employerContributions';

            setComponents(prev => ({
                ...prev,
                [key]: prev[key].filter(comp => comp.id !== id)
            }));
        }
    };

    // Get current table data based on active tab
    const getTableData = () => {
        const data = activeTab === 'earnings' ? components.earnings :
            activeTab === 'deductions' ? components.deductions :
                components.employerContributions;

        // Add edit function to each row
        return data.map(item => ({
            ...item,
            onEdit: handleEditComponent
        }));
    };

    // Insert component code into formula
    const insertComponentCode = (code) => {
        setNewComponent(prev => ({
            ...prev,
            formula: prev.formula + ` ${code} `
        }));
    };

    // Insert operator into formula
    const insertOperator = (operator) => {
        setNewComponent(prev => ({
            ...prev,
            formula: prev.formula + ` ${operator} `
        }));
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-2">
            {/* Header */}
            <div className="mb-6">
                <BreadCrumb
                    headerName="Salary Components"
                    buttonContent={<button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Create New Component
                    </button>}
                    subcontent="Create and manage salary components, earnings, deductions, and employer contributions"
                />

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('earnings')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'earnings' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Plus size={16} />
                        Earnings
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                            {components.earnings.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('deductions')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'deductions' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Minus size={16} />
                        Deductions
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                            {components.deductions.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('employer')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'employer' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Building size={16} />
                        Employer Contributions
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            {components.employerContributions.length}
                        </span>
                    </button>
                </div>
            </div>

            <CommonTable
                columns={tableColumns}
                data={getTableData()}
            />

            {showCreateModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {selectedComponent ? 'Edit Component' : 'Create New Component'}
                                    </h3>
                                    <p className="text-gray-600">Configure salary component details and calculation</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setSelectedComponent(null);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Basic Details */}
                                <div className="space-y-4">
                                    {/* Component Type Dropdown */}
                                    <CommonDropDown
                                        label="Component Type *"
                                        value={newComponent.type}
                                        options={componentTypeOptions}
                                        onChange={v => handleChange('type', v)}
                                    />

                                    {/* Component Name Input */}
                                    <CommonInputField
                                        label="Component Name *"
                                        value={newComponent.name}
                                        onChange={v => handleChange('name', v)}
                                        placeholder="e.g., Basic Salary, House Rent Allowance"
                                    />

                                    {/* Component Code Input */}
                                    <CommonInputField
                                        label="Component Code *"
                                        value={newComponent.code}
                                        onChange={v => handleChange('code', v.toUpperCase())}
                                        placeholder="e.g., BASIC, HRA, EPF"
                                    />

                                    {/* Priority Input */}
                                    <CommonInputField
                                        label="Priority Order"
                                        value={newComponent.priority.toString()}
                                        onChange={v => handleChange('priority', parseInt(v) || 1)}
                                        placeholder="1"
                                        type="number"
                                    />
                                </div>

                                {/* Right Column - Calculation Details */}
                                <div className="space-y-4">
                                    {/* Calculation Type Dropdown */}
                                    <CommonDropDown
                                        label="Calculation Type *"
                                        value={newComponent.calculationType}
                                        options={calculationTypeOptions}
                                        onChange={v => handleChange('calculationType', v)}
                                    />

                                    {/* Formula/Description Field */}
                                    {newComponent.calculationType === 'formula' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Formula *
                                            </label>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-lg">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Formula:</span>
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={() => insertOperator('+')}
                                                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                            >
                                                                +
                                                            </button>
                                                            <button
                                                                onClick={() => insertOperator('-')}
                                                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                            >
                                                                -
                                                            </button>
                                                            <button
                                                                onClick={() => insertOperator('*')}
                                                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                            >
                                                                ×
                                                            </button>
                                                            <button
                                                                onClick={() => insertOperator('/')}
                                                                className="px-2 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                                                            >
                                                                ÷
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <CommonInputField
                                                        label=""
                                                        value={newComponent.formula}
                                                        onChange={v => handleChange('formula', v)}
                                                        placeholder="Enter formula using component codes (e.g., BASIC * 0.5 + HRA)"
                                                        className="font-mono"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Available Components:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {allComponentCodes.map(comp => (
                                                            <button
                                                                key={comp.value}
                                                                onClick={() => insertComponentCode(comp.value)}
                                                                className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                                                            >
                                                                {comp.value}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : newComponent.calculationType === 'percentage' ? (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Percentage Configuration *
                                            </label>
                                            <div className="flex items-center gap-3">
                                                <CommonInputField
                                                    label=""
                                                    value={newComponent.formula}
                                                    onChange={v => handleChange('formula', v)}
                                                    placeholder="e.g., 40"
                                                    className="w-24"
                                                />
                                                <span className="text-gray-700">% of</span>
                                                <CommonDropDown
                                                    label=""
                                                    value=""
                                                    options={baseComponentOptions}
                                                    onChange={v => handleChange('formula', newComponent.formula + ' of ' + v)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <CommonInputField
                                            label="Description *"
                                            value={newComponent.formula}
                                            onChange={v => handleChange('formula', v)}
                                            placeholder={
                                                newComponent.calculationType === 'fixed' ? 'e.g., ₹200 per month' :
                                                    newComponent.calculationType === 'attendance' ? 'e.g., Daily Rate × Present Days' :
                                                        newComponent.calculationType === 'sales' ? 'e.g., Sales Amount × Commission %' :
                                                            'e.g., Based on KPI Score'
                                            }
                                        />
                                    )}

                                    {/* Toggle Buttons */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Affects Gross Salary</p>
                                                <p className="text-xs text-gray-500">Include in gross salary calculation</p>
                                            </div>
                                            <CommonToggleButton
                                                value={newComponent.affectsGross}
                                                onChange={v => handleChange('affectsGross', v)}
                                                yesLabel="Yes"
                                                noLabel="No"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Affects Net Salary</p>
                                                <p className="text-xs text-gray-500">Include in net salary calculation</p>
                                            </div>
                                            <CommonToggleButton
                                                value={newComponent.affectsNet}
                                                onChange={v => handleChange('affectsNet', v)}
                                                yesLabel="Yes"
                                                noLabel="No"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Taxable</p>
                                                <p className="text-xs text-gray-500">Subject to income tax</p>
                                            </div>
                                            <CommonToggleButton
                                                value={newComponent.taxable}
                                                onChange={v => handleChange('taxable', v)}
                                                yesLabel="Yes"
                                                noLabel="No"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setSelectedComponent(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreateComponent}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    {selectedComponent ? (
                                        <>
                                            <Save size={16} />
                                            Update Component
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Create Component
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SalaryComponentEntry;