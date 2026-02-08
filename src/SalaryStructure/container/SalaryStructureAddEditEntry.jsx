import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Save, Plus, X, Package, Calculator,
    DollarSign, Percent, Hash, Layers, Eye, Clock
} from 'lucide-react';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import { getRoleBasePath } from '../../library/constants';

function SalaryStructureAddEditEntry() {
    const { id } = useParams(); // Get structure ID from URL for edit mode
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    // Form state
    const [structure, setStructure] = useState({
        name: '',
        code: '',
        description: '',
        components: [],
        status: 'active',
        effectiveDate: new Date().toISOString().split('T')[0],
        totalCost: 0
    });

    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Sample salary components (in real app, fetch from API)
    const salaryComponents = [
        { id: 1, name: 'Basic Salary', code: 'BASIC', type: 'earning', minAmount: 15000, maxAmount: 500000 },
        { id: 2, name: 'House Rent Allowance', code: 'HRA', type: 'earning', minAmount: 0, maxAmount: 100 },
        { id: 3, name: 'Special Allowance', code: 'SA', type: 'earning', minAmount: 0, maxAmount: 500000 },
        { id: 4, name: 'Conveyance Allowance', code: 'CA', type: 'earning', minAmount: 0, maxAmount: 19200 },
        { id: 5, name: 'Medical Allowance', code: 'MA', type: 'earning', minAmount: 0, maxAmount: 15000 },
        { id: 6, name: 'Performance Bonus', code: 'BONUS', type: 'earning', minAmount: 0, maxAmount: 100 },
        { id: 7, name: 'Employee PF', code: 'EPF', type: 'deduction', minAmount: 0, maxAmount: 12 },
        { id: 8, name: 'Professional Tax', code: 'PT', type: 'deduction', minAmount: 0, maxAmount: 2500 },
        { id: 9, name: 'TDS', code: 'TDS', type: 'deduction', minAmount: 0, maxAmount: 100 },
        { id: 10, name: 'Loan Recovery', code: 'LOAN', type: 'deduction', minAmount: 0, maxAmount: 100000 },
    ];

    // Fetch structure data in edit mode
    useEffect(() => {
        if (isEditMode) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                // Sample structure data (in real app, fetch from API)
                const sampleStructure = {
                    id: parseInt(id),
                    name: 'Senior Software Engineer Structure',
                    code: 'SSE-STR',
                    description: 'Standard structure for senior software engineers with performance bonus',
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
                    totalCost: 110400
                };
                setStructure(sampleStructure);
                setIsLoading(false);
            }, 1000);
        }
    }, [id, isEditMode]);

    // Handle form field changes
    const handleChange = (field, value) => {
        setStructure(prev => ({ ...prev, [field]: value }));
    };

    // Add component to structure
    const addComponent = () => {
        setStructure(prev => ({
            ...prev,
            components: [...prev.components, {
                componentId: '',
                name: '',
                code: '',
                type: 'earning',
                amount: 0,
                calculation: 'fixed',
                basedOn: ''
            }]
        }));
    };

    // Update component in structure
    const updateComponent = (index, field, value) => {
        setStructure(prev => {
            const newComponents = [...prev.components];
            newComponents[index] = { ...newComponents[index], [field]: value };

            // If componentId is selected, auto-fill name and code
            if (field === 'componentId' && value) {
                const component = salaryComponents.find(c => c.id === parseInt(value));
                if (component) {
                    newComponents[index].name = component.name;
                    newComponents[index].code = component.code;
                    newComponents[index].type = component.type;
                }
            }

            return { ...prev, components: newComponents };
        });
    };

    // Remove component from structure
    const removeComponent = (index) => {
        setStructure(prev => ({
            ...prev,
            components: prev.components.filter((_, i) => i !== index)
        }));
    };

    // Calculate total cost
    const calculateTotalCost = () => {
        let total = 0;
        structure.components.forEach(comp => {
            if (comp.type === 'earning') {
                if (comp.calculation === 'fixed') {
                    total += comp.amount || 0;
                } else if (comp.calculation === 'percentage' && comp.basedOn === 'BASIC') {
                    // Find basic component to calculate percentage
                    const basicComp = structure.components.find(c => c.code === 'BASIC');
                    if (basicComp && basicComp.amount) {
                        total += (comp.amount / 100) * basicComp.amount;
                    }
                }
            }
        });
        return total;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Calculate total cost before saving
        const totalCost = calculateTotalCost();
        const structureToSave = { ...structure, totalCost };

        // Simulate API call
        setTimeout(() => {
            console.log(isEditMode ? 'Updating structure:' : 'Creating structure:', structureToSave);
            setIsSaving(false);

            // Show success message and redirect
            alert(isEditMode ? 'Structure updated successfully!' : 'Structure created successfully!');
            navigate(`${getRoleBasePath()}/salary_structure`);
        }, 1500);
    };

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate(`${getRoleBasePath()}/salary_structure`);
        }
    };

    // Component calculation type options
    const calculationOptions = [
        { value: 'fixed', label: 'Fixed Amount' },
        { value: 'percentage', label: 'Percentage' },
        { value: 'formula', label: 'Formula Based' }
    ];

    // Base component options for percentage calculation
    const baseOptions = [
        { value: 'BASIC', label: 'Basic Salary (BASIC)' },
        { value: 'GROSS', label: 'Gross Salary' },
        { value: 'CTC', label: 'Cost to Company' }
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading structure data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(`${getRoleBasePath()}/salary_structure`)}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditMode ? 'Edit Salary Structure' : 'Create New Salary Structure'}
                                </h1>
                                <p className="text-gray-600">
                                    {isEditMode
                                        ? 'Modify existing salary structure components and configuration'
                                        : 'Configure new salary structure with components and calculations'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${structure.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {structure.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Structure Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-indigo-600" />
                                    Basic Information
                                </h2>

                                <div className="space-y-4">
                                    <CommonInputField
                                        label="Structure Name *"
                                        value={structure.name}
                                        onChange={v => handleChange('name', v)}
                                        placeholder="e.g., Junior Software Engineer Structure"
                                        required
                                    />

                                    <CommonInputField
                                        label="Structure Code *"
                                        value={structure.code}
                                        onChange={v => handleChange('code', v.toUpperCase())}
                                        placeholder="e.g., JSE-STR"
                                        required
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            value={structure.description}
                                            onChange={e => handleChange('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                            rows="3"
                                            placeholder="Describe the purpose and usage of this structure..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <CommonInputField
                                            label="Effective Date *"
                                            value={structure.effectiveDate}
                                            onChange={v => handleChange('effectiveDate', v)}
                                            type="date"
                                            required
                                        />

                                        <CommonDropDown
                                            label="Status *"
                                            value={structure.status}
                                            options={[
                                                { value: 'active', label: 'Active' },
                                                { value: 'inactive', label: 'Inactive' }
                                            ]}
                                            onChange={v => handleChange('status', v)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Salary Components Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-indigo-600" />
                                        Salary Components
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={addComponent}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Add Component
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {structure.components.length === 0 ? (
                                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">No components added</p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Click "Add Component" to start building your salary structure
                                            </p>
                                        </div>
                                    ) : (
                                        structure.components.map((component, index) => (
                                            <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            Component #{index + 1}
                                                        </span>
                                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${component.type === 'earning' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {component.type === 'earning' ? 'Earning' : 'Deduction'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeComponent(index)}
                                                        className="p-1 hover:bg-red-50 text-red-600 hover:text-red-800 rounded"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                                    <CommonDropDown
                                                        label="Component *"
                                                        value={component.componentId?.toString() || ''}
                                                        options={salaryComponents.map(c => ({
                                                            value: c.id.toString(),
                                                            label: `${c.name} (${c.code})`
                                                        }))}
                                                        onChange={v => updateComponent(index, 'componentId', v)}
                                                    />

                                                    <CommonDropDown
                                                        label="Calculation Type *"
                                                        value={component.calculation}
                                                        options={calculationOptions}
                                                        onChange={v => updateComponent(index, 'calculation', v)}
                                                    />

                                                    <CommonInputField
                                                        label={component.calculation === 'percentage' ? 'Percentage *' : 'Amount *'}
                                                        value={component.amount?.toString() || ''}
                                                        onChange={v => updateComponent(index, 'amount', parseFloat(v) || 0)}
                                                        placeholder={component.calculation === 'percentage' ? 'e.g., 40' : 'e.g., 50000'}
                                                        type="number"
                                                        required
                                                    />

                                                    {component.calculation === 'percentage' && (
                                                        <CommonDropDown
                                                            label="Based On *"
                                                            value={component.basedOn || ''}
                                                            options={baseOptions}
                                                            onChange={v => updateComponent(index, 'basedOn', v)}
                                                        />
                                                    )}
                                                </div>

                                                {/* Component Preview */}
                                                <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <span className="font-medium text-gray-900">{component.name || 'Unnamed Component'}</span>
                                                            <span className="ml-2 text-sm text-gray-500 font-mono">({component.code || 'CODE'})</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-medium text-gray-900">
                                                                {component.calculation === 'percentage'
                                                                    ? `${component.amount || 0}%`
                                                                    : `₹${(component.amount || 0).toLocaleString()}`
                                                                }
                                                            </span>
                                                            {component.calculation === 'percentage' && component.basedOn && (
                                                                <div className="text-xs text-gray-500">of {component.basedOn}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Summary & Actions */}
                        <div className="space-y-6">
                            {/* Cost Summary Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5 text-indigo-600" />
                                    Cost Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Number of Components</span>
                                        <span className="font-medium text-gray-900">{structure.components.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Earnings</span>
                                        <span className="font-medium text-green-600">
                                            {structure.components.filter(c => c.type === 'earning').length}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Deductions</span>
                                        <span className="font-medium text-red-600">
                                            {structure.components.filter(c => c.type === 'deduction').length}
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-gray-900">Estimated Monthly Cost</span>
                                            <span className="text-2xl font-bold text-indigo-600">
                                                ₹{calculateTotalCost().toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Based on basic salary calculation
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Component Statistics Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-indigo-600" />
                                    Component Statistics
                                </h2>

                                <div className="space-y-2">
                                    {structure.components.length > 0 ? (
                                        <div className="space-y-2">
                                            {structure.components.map((comp, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${comp.type === 'earning' ? 'bg-green-500' : 'bg-red-500'
                                                            }`}></div>
                                                        <span className="text-sm text-gray-700 truncate">{comp.name || 'Unnamed'}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {comp.calculation === 'percentage'
                                                                ? `${comp.amount}%`
                                                                : `₹${(comp.amount || 0).toLocaleString()}`
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No components added yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Actions Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>

                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                {isEditMode ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                {isEditMode ? 'Update Structure' : 'Create Structure'}
                                            </>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-500">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock size={14} />
                                                <span>Last saved: {new Date().toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-xs">
                                                {structure.components.length === 0
                                                    ? 'Add at least one component to save'
                                                    : 'All changes will be saved when you submit'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SalaryStructureAddEditEntry;