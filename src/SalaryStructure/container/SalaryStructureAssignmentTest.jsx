import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Save, X, User, Award, Calendar,
    Building, Users, ChevronDown, Search, Info,
    AlertCircle, CheckCircle, Link as LinkIcon, RefreshCw
} from 'lucide-react';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import { getRoleBasePath } from '../../library/constants';

function SalaryStructureAssignment() {
    const navigate = useNavigate();
    const { id } = useParams(); // For edit mode - assignment ID
    const isEditMode = !!id;

    // State for form data
    const [formData, setFormData] = useState({
        assignmentType: 'designation', // 'designation' or 'employee'
        targetId: '',
        targetName: '',
        structureId: '',
        structureName: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isPermanent: true,
        reason: '',
        status: 'active'
    });

    // State for dropdown options
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // State for UI
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // Sample data - In real app, fetch from API
    useEffect(() => {
        // Sample designations
        setDesignations([
            { id: 1, name: 'Junior Software Engineer', code: 'JSE', department: 'Engineering' },
            { id: 2, name: 'Senior Software Engineer', code: 'SSE', department: 'Engineering' },
            { id: 3, name: 'Team Lead', code: 'TL', department: 'Engineering' },
            { id: 4, name: 'HR Executive', code: 'HRE', department: 'Human Resources' },
            { id: 5, name: 'Sales Executive', code: 'SE', department: 'Sales' },
        ]);

        // Sample employees
        setEmployees([
            { id: 101, name: 'John Smith', employeeCode: 'EMP001', designation: 'Junior Software Engineer', department: 'Engineering' },
            { id: 102, name: 'Sarah Johnson', employeeCode: 'EMP002', designation: 'Senior Software Engineer', department: 'Engineering' },
            { id: 103, name: 'Mike Chen', employeeCode: 'EMP003', designation: 'HR Executive', department: 'Human Resources' },
            { id: 104, name: 'Priya Sharma', employeeCode: 'EMP004', designation: 'Junior Software Engineer', department: 'Engineering' },
        ]);

        // Sample salary structures
        setStructures([
            { id: 1, name: 'Junior Software Engineer', code: 'JSE-STR', totalCost: 65200 },
            { id: 2, name: 'Senior Software Engineer', code: 'SSE-STR', totalCost: 110400 },
            { id: 3, name: 'HR Executive', code: 'HRE-STR', totalCost: 52720 },
            { id: 4, name: 'Sales Executive', code: 'SE-STR', totalCost: 48500 },
        ]);

        // If edit mode, fetch assignment data
        if (isEditMode) {
            fetchAssignmentData(id);
        }
    }, [isEditMode, id]);

    // Fetch assignment data for edit mode
    const fetchAssignmentData = (assignmentId) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Sample assignment data
            const sampleAssignment = {
                id: 1,
                type: 'employee',
                targetId: 101,
                targetName: 'John Smith',
                employeeCode: 'EMP001',
                structureId: 1,
                structureName: 'Junior Software Engineer',
                effectiveDate: '2023-06-15',
                endDate: '',
                isPermanent: true,
                reason: 'Initial assignment on joining',
                status: 'active'
            };

            setFormData({
                assignmentType: sampleAssignment.type,
                targetId: sampleAssignment.targetId,
                targetName: sampleAssignment.targetName,
                structureId: sampleAssignment.structureId,
                structureName: sampleAssignment.structureName,
                effectiveDate: sampleAssignment.effectiveDate,
                endDate: sampleAssignment.endDate || '',
                isPermanent: !sampleAssignment.endDate,
                reason: sampleAssignment.reason || '',
                status: sampleAssignment.status
            });

            setSelectedTarget({
                id: sampleAssignment.targetId,
                name: sampleAssignment.targetName,
                ...(sampleAssignment.type === 'employee'
                    ? { employeeCode: sampleAssignment.employeeCode }
                    : {})
            });

            setSelectedStructure({
                id: sampleAssignment.structureId,
                name: sampleAssignment.structureName
            });

            setLoading(false);
        }, 500);
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }

        // Reset dependent fields when assignment type changes
        if (field === 'assignmentType') {
            setFormData(prev => ({
                ...prev,
                targetId: '',
                targetName: '',
                [field]: value
            }));
            setSelectedTarget(null);
        }
    };

    // Handle target selection
    const handleTargetSelect = (target) => {
        setSelectedTarget(target);
        setFormData(prev => ({
            ...prev,
            targetId: target.id,
            targetName: target.name
        }));

        if (errors.targetId) {
            setErrors(prev => ({ ...prev, targetId: null }));
        }
    };

    // Handle structure selection
    const handleStructureSelect = (structure) => {
        setSelectedStructure(structure);
        setFormData(prev => ({
            ...prev,
            structureId: structure.id,
            structureName: structure.name
        }));

        if (errors.structureId) {
            setErrors(prev => ({ ...prev, structureId: null }));
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.targetId) {
            newErrors.targetId = 'Please select a target';
        }
        if (!formData.structureId) {
            newErrors.structureId = 'Please select a salary structure';
        }
        if (!formData.effectiveDate) {
            newErrors.effectiveDate = 'Effective date is required';
        }
        if (!formData.isPermanent && !formData.endDate) {
            newErrors.endDate = 'End date is required for temporary assignments';
        }
        if (formData.endDate && formData.endDate < formData.effectiveDate) {
            newErrors.endDate = 'End date cannot be before effective date';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare data for API
            const assignmentData = {
                type: formData.assignmentType,
                targetId: formData.targetId,
                targetName: formData.targetName,
                structureId: formData.structureId,
                structureName: formData.structureName,
                effectiveDate: formData.effectiveDate,
                endDate: formData.isPermanent ? null : formData.endDate,
                reason: formData.reason,
                status: formData.status
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Assignment saved:', assignmentData);

            // Show success message
            setShowSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate(`${getRoleBasePath()}/salary_structure`);
            }, 2000);

        } catch (error) {
            console.error('Error saving assignment:', error);
            setErrors({ submit: 'Failed to save assignment. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate(`${getRoleBasePath()}/salary_structure`);
    };

    // Get target options based on assignment type
    const getTargetOptions = () => {
        if (formData.assignmentType === 'designation') {
            return designations.map(d => ({
                value: d.id,
                label: `${d.name} (${d.department})`,
                data: d
            }));
        } else {
            return employees.map(e => ({
                value: e.id,
                label: `${e.name} (${e.employeeCode}) - ${e.designation}`,
                data: e
            }));
        }
    };

    // Get structure options
    const getStructureOptions = () => {
        return structures.map(s => ({
            value: s.id,
            label: `${s.name} (${s.code}) - ₹${s.totalCost?.toLocaleString()}`,
            data: s
        }));
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            {/* Header */}
            <div className="mb-6">
                <button
                    onClick={handleCancel}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} className="mr-1" />
                    Back to Salary Structures
                </button>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Assignment' : 'Assign Salary Structure'}
                        </h1>
                        <p className="text-gray-600">
                            {isEditMode
                                ? 'Modify salary structure assignment details'
                                : 'Assign a salary structure to a designation or employee'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <CheckCircle size={20} className="text-green-500" />
                    <div>
                        <h3 className="font-medium text-green-800">Assignment Saved Successfully!</h3>
                        <p className="text-sm text-green-600">
                            Redirecting to salary structure list...
                        </p>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Assignment Type Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Type</h2>

                    <div className="flex gap-4">
                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.assignmentType === 'designation'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="assignmentType"
                                value="designation"
                                checked={formData.assignmentType === 'designation'}
                                onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${formData.assignmentType === 'designation'
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Designation Based</h3>
                                    <p className="text-sm text-gray-500">
                                        Assign structure to all employees with a specific designation
                                    </p>
                                </div>
                            </div>
                        </label>

                        <label className={`flex-1 p-4 border rounded-lg cursor-pointer transition-all ${formData.assignmentType === 'employee'
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <input
                                type="radio"
                                name="assignmentType"
                                value="employee"
                                checked={formData.assignmentType === 'employee'}
                                onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                                className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${formData.assignmentType === 'employee'
                                        ? 'bg-indigo-100 text-indigo-600'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Individual Employee</h3>
                                    <p className="text-sm text-gray-500">
                                        Assign structure to a specific employee
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Target Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Select {formData.assignmentType === 'designation' ? 'Designation' : 'Employee'}
                    </h2>

                    <CommonDropDown
                        label={formData.assignmentType === 'designation' ? 'Designation' : 'Employee'}
                        options={getTargetOptions()}
                        value={formData.targetId}
                        onChange={(value, option) => handleTargetSelect(option.data)}
                        placeholder={`Select ${formData.assignmentType === 'designation' ? 'designation' : 'employee'}`}
                        error={errors.targetId}
                        required
                    />

                    {selectedTarget && formData.assignmentType === 'employee' && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Employee Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Employee Code</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTarget.employeeCode}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Designation</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTarget.designation}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Department</p>
                                    <p className="text-sm font-medium text-gray-900">{selectedTarget.department}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Structure Selection */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Salary Structure</h2>

                    <CommonDropDown
                        label="Salary Structure"
                        options={getStructureOptions()}
                        value={formData.structureId}
                        onChange={(value, option) => handleStructureSelect(option.data)}
                        placeholder="Select salary structure"
                        error={errors.structureId}
                        required
                    />

                    {selectedStructure && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Structure Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Structure Code</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {structures.find(s => s.id === selectedStructure.id)?.code}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Total Monthly Cost</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        ₹{structures.find(s => s.id === selectedStructure.id)?.totalCost?.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Assignment Details */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Assignment Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CommonInputField
                            label="Effective Date"
                            type="date"
                            value={formData.effectiveDate}
                            onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                            error={errors.effectiveDate}
                            required
                        />

                        <div className="space-y-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={formData.isPermanent}
                                    onChange={(e) => handleInputChange('isPermanent', e.target.checked)}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Permanent Assignment (No end date)</span>
                            </label>

                            {!formData.isPermanent && (
                                <CommonInputField
                                    label="End Date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    error={errors.endDate}
                                    required
                                />
                            )}
                        </div>
                    </div>

                    <div className="mt-4">
                        <CommonInputField
                            label="Reason for Assignment"
                            type="textarea"
                            value={formData.reason}
                            onChange={(e) => handleInputChange('reason', e.target.value)}
                            placeholder="e.g., New joining, Promotion, Transfer, etc."
                            rows={3}
                        />
                    </div>

                    {isEditMode && (
                        <div className="mt-4">
                            <CommonDropDown
                                label="Status"
                                options={[
                                    { value: 'active', label: 'Active' },
                                    { value: 'inactive', label: 'Inactive' }
                                ]}
                                value={formData.status}
                                onChange={(value) => handleInputChange('status', value)}
                            />
                        </div>
                    )}
                </div>

                {/* Preview Section */}
                {selectedTarget && selectedStructure && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                            <Info size={20} />
                            Assignment Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-indigo-700">
                                    <span className="font-medium">Target:</span> {formData.targetName}
                                    {formData.assignmentType === 'employee' &&
                                        ` (${selectedTarget.employeeCode})`}
                                </p>
                                <p className="text-sm text-indigo-700">
                                    <span className="font-medium">Structure:</span> {formData.structureName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-indigo-700">
                                    <span className="font-medium">Effective From:</span> {formData.effectiveDate}
                                </p>
                                {!formData.isPermanent && formData.endDate && (
                                    <p className="text-sm text-indigo-700">
                                        <span className="font-medium">Valid Until:</span> {formData.endDate}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {errors.submit && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                        <AlertCircle size={20} className="text-red-500" />
                        <p className="text-sm text-red-600">{errors.submit}</p>
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        <X size={16} />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={16} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                {isEditMode ? 'Update Assignment' : 'Save Assignment'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SalaryStructureAssignment;