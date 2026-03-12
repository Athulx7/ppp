import { Layers, Package } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import StructureBasicInformation from './StructureBasicInformation';
import StructureComponents from './StructureComponents';
import SalaryStructureCoastSummurySaveButtons from './SalaryStructureCoastSummurySaveButtons';
import { ApiCall } from '../../library/constants';

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

    const [calculationOptions, setCalculationOptions] = useState([])
    const [baseOptions, setBaseOptions] = useState([])
    const [salaryComponents, setSalaryComponents] = useState([])
    useEffect(() => {
        getDropdownDataForComponentType()
        getDropdownDataForCalculationType()
    }, [])

    async function getDropdownDataForComponentType() {
        try {
            const result = await ApiCall("get", "/salarystructure/dropdownCcomponent")

            const components = result.data.data

            const formatted = components.map(c => ({
                id: c.id,
                label: c.component_name,
                value: c.component_code,
                type: c.type_code
            }))

            setSalaryComponents(formatted)

        } catch (err) {
            console.log(err)
        }
    }

    async function getDropdownDataForCalculationType() {
        try {

            const result = await ApiCall(
                "get",
                "/salarystructure/dropdownCalculationtype"
            )

            const data = result.data.data
            console.log(data, 'datatata')

            const formatted = data.map(c => ({
                value: c.value,
                label: c.label,
                requires_formula: c.requires_formula,
                requires_percentage: c.requires_percentage
            }))

            setCalculationOptions(formatted)

        } catch (err) {
            console.log(err)
        }
    }

    // Component calculation type options
    // const calculationOptions = [
    //     { value: 'fixed', label: 'Fixed Amount' },
    //     { value: 'percentage', label: 'Percentage' },
    //     { value: 'formula', label: 'Formula Based' }
    // ];

    // Base component options for percentage calculation
    // const baseOptions = [
    //     { value: 'BASIC', label: 'Basic Salary (BASIC)' },
    //     { value: 'GROSS', label: 'Gross Salary' },
    //     { value: 'CTC', label: 'Cost to Company' }
    // ];

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
                        <StructureBasicInformation isLoading={isLoading} structure={structure} handleChange={handleChange} />

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