import { Layers, Package } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import StructureBasicInformation from './StructureBasicInformation';
import StructureComponents from './StructureComponents';
import SalaryStructureCoastSummurySaveButtons from './SalaryStructureCoastSummurySaveButtons';

function SalaryStructureAddEditMain({ isLoading, setIsLoading, isEditMode, id, navigate }) {
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
    const [isSaving, setIsSaving] = useState(false);
    console.log(setIsSaving)

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

    // Handle cancel
    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            navigate(`/admin/salary_structure`);
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

    if (isLoading.spinner) {
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
        <>
            <form onSubmit={''}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Left Column - Structure Details */}
                        <StructureBasicInformation isLoading={isLoading} structure={structure} handleChange={handleChange} />

                        {/* Salary Components */}
                        <StructureComponents isLoading={isLoading} addComponent={addComponent} structure={structure} removeComponent={removeComponent} salaryComponents={salaryComponents} updateComponent={updateComponent} calculationOptions={calculationOptions} baseOptions={baseOptions} />
                    </div>

                    <SalaryStructureCoastSummurySaveButtons
                        structure={structure}
                        calculateTotalCost={calculateTotalCost}
                        isSaving={isSaving}
                        isEditMode={isEditMode}
                        handleCancel={handleCancel}
                    />
                </div>
            </form>
        </>
    )
}

export default SalaryStructureAddEditMain