import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Calendar, Briefcase, Building,
    CreditCard, Shield, FileText, Award, GraduationCap, Users,
    Save, X, ArrowLeft, DollarSign, Home, Globe, Hash,
    PhoneCall, BriefcaseMedical, Check, Percent, Layers
} from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';

function EmpMstAddEditEntry() {
    const { id } = useParams();

    const navigate = useNavigate();
    const location = useLocation();
    const { employee, mode } = location.state || { mode: 'add' };

    const [formData, setFormData] = useState({
        // Basic Information
        employee_code: '',
        first_name: '',
        last_name: '',
        email: '',
        work_email: '',

        // Contact Information
        mobile_number: '',
        alternate_mobile: '',
        emergency_contact: '',
        emergency_contact_name: '',

        // Employment Details
        department: '',
        designation: '',
        joining_date: '',
        employment_type: 'Permanent',
        reporting_manager: '',
        employee_status: 'Active',
        probation_period: '',
        probation_end_date: '',

        // Personal Information
        date_of_birth: '',
        gender: '',
        marital_status: '',
        nationality: 'Indian',
        blood_group: '',
        pan_number: '',

        // Address Details
        current_address: '',
        permanent_address: '',
        city: '',
        state: '',
        country: 'India',
        pincode: '',

        // Bank Details
        bank_account_number: '',
        bank_name: '',
        ifsc_code: '',
        account_holder_name: '',
        branch_name: '',

        // Salary Information
        basic_salary: '',
        hra: '',
        special_allowance: '',
        gross_salary: '',

        // Accounting
        account_head: '',

        // Roles
        roles: [],

        // System
        currency: 'INR',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const [selectedRoles, setSelectedRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [isViewMode, setIsViewMode] = useState(mode === 'view');

    useEffect(() => {
        if (employee && (mode === 'edit' || mode === 'view')) {
            setFormData({
                ...formData,
                ...employee.employeeData,
                employee_code: employee.employee_code,
                first_name: employee.first_name,
                last_name: employee.last_name,
                email: employee.email,
                mobile_number: employee.mobile_number,
                department: employee.department,
                designation: employee.designation,
                joining_date: employee.joining_date,
                employee_status: employee.employee_status
            });
            setIsViewMode(mode === 'view');
        }

        // Generate employee code for new employee
        if (mode === 'add') {
            const newEmpCode = `EP${String(Math.floor(Math.random() * 900 + 100)).padStart(3, '0')}`;
            setFormData(prev => ({ ...prev, employee_code: newEmpCode }));
        }
    }, [employee, mode]);

    // Country options
    const countries = [
        { label: 'India', value: 'India' },
        { label: 'USA', value: 'USA' },
        { label: 'UK', value: 'UK' },
        { label: 'UAE', value: 'UAE' },
        { label: 'Singapore', value: 'Singapore' },
        { label: 'Canada', value: 'Canada' },
        { label: 'Australia', value: 'Australia' }
    ];

    // Department options
    const departments = [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Human Resources', value: 'HR' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Operations', value: 'Operations' }
    ];

    // Designation options based on department
    const getDesignationsByDepartment = (dept) => {
        const designations = {
            'Engineering': [
                { label: 'Software Engineer', value: 'Software Engineer' },
                { label: 'Senior Software Engineer', value: 'Senior Software Engineer' },
                { label: 'Tech Lead', value: 'Tech Lead' },
                { label: 'Engineering Manager', value: 'Engineering Manager' }
            ],
            'HR': [
                { label: 'HR Executive', value: 'HR Executive' },
                { label: 'HR Manager', value: 'HR Manager' },
                { label: 'HR Director', value: 'HR Director' }
            ],
            'Sales': [
                { label: 'Sales Executive', value: 'Sales Executive' },
                { label: 'Sales Manager', value: 'Sales Manager' },
                { label: 'Regional Sales Head', value: 'Regional Sales Head' }
            ],
            'Marketing': [
                { label: 'Marketing Specialist', value: 'Marketing Specialist' },
                { label: 'Marketing Manager', value: 'Marketing Manager' },
                { label: 'Brand Manager', value: 'Brand Manager' }
            ],
            'Finance': [
                { label: 'Accountant', value: 'Accountant' },
                { label: 'Finance Manager', value: 'Finance Manager' },
                { label: 'CFO', value: 'CFO' }
            ],
            'Operations': [
                { label: 'Operations Executive', value: 'Operations Executive' },
                { label: 'Operations Manager', value: 'Operations Manager' },
                { label: 'COO', value: 'COO' }
            ]
        };
        return designations[dept] || [];
    };

    // Role options
    const roleOptions = [
        { label: 'HR', value: 'HR', description: 'Manage employee records and payroll' },
        { label: 'Payroll Manager', value: 'Payroll Manager', description: 'Process payroll and taxes' },
        { label: 'Admin', value: 'Admin', description: 'Full system access' },
        { label: 'Department Head', value: 'Department Head', description: 'Manage department employees' },
        { label: 'Team Lead', value: 'Team Lead', description: 'Lead specific team' }
    ];

    const handleRoleToggle = (role) => {
        setSelectedRoles(prev => {
            if (prev.includes(role)) {
                return prev.filter(r => r !== role);
            } else {
                return [...prev, role];
            }
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-calculate probation end date
            if (field === 'joining_date' && formData.probation_period) {
                const joinDate = new Date(value);
                const endDate = new Date(joinDate.setMonth(joinDate.getMonth() + parseInt(formData.probation_period || 0)));
                newData.probation_end_date = endDate.toISOString().split('T')[0];
            }

            // Auto-calculate probation period from end date
            if (field === 'probation_end_date' && formData.joining_date) {
                const joinDate = new Date(formData.joining_date);
                const endDate = new Date(value);
                const diffMonths = (endDate.getFullYear() - joinDate.getFullYear()) * 12 +
                    (endDate.getMonth() - joinDate.getMonth());
                newData.probation_period = diffMonths > 0 ? diffMonths.toString() : '';
            }

            // Auto-calculate gross salary
            if (['basic_salary', 'hra', 'special_allowance'].includes(field)) {
                const basic = parseFloat(newData.basic_salary || 0);
                const hra = parseFloat(newData.hra || 0);
                const allowance = parseFloat(newData.special_allowance || 0);
                newData.gross_salary = (basic + hra + allowance).toString();
            }

            return newData;
        });

        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        if (!formData.first_name) newErrors.first_name = 'First name is required';
        if (!formData.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.mobile_number) newErrors.mobile_number = 'Mobile number is required';
        if (!formData.department) newErrors.department = 'Department is required';
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.current_address) newErrors.current_address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode) newErrors.pincode = 'PIN code is required';

        // Bank validation
        if (formData.bank_account_number && formData.bank_account_number.length < 9) {
            newErrors.bank_account_number = 'Account number should be 9-18 digits';
        }
        if (formData.ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc_code)) {
            newErrors.ifsc_code = 'Invalid IFSC code format';
        }

        // PAN validation
        if (formData.pan_number && !/[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(formData.pan_number)) {
            newErrors.pan_number = 'Invalid PAN format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'view') {
            navigate('/employees/master');
            return;
        }

        if (validateForm()) {
            console.log('Form Data:', { ...formData, roles: selectedRoles });

            if (mode === 'add') {
                alert('Employee added successfully!');
            } else if (mode === 'edit') {
                alert('Employee updated successfully!');
            }

            navigate('/employees/master');
        }
    };

    const handleCancel = () => {
        navigate('/employees/master');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-3">
            {/* Breadcrumb */}
            <div className="mb-6">
                 <BreadCrumb
                    items={[{label: 'Employee Master', to: '/admin/employeemaster'},{label: 'Employee Master Edit'}]}
                    title="Employee Master Add"
                    description="Manage employee profiles and information"
                />
            </div>

                {/* Header */}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee Code */}
                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employee Code *
                                </label>
                                <CommonInputField
                                    value={formData.employee_code}
                                    onChange={(e) => handleInputChange('employee_code', e.target.value)}
                                    disabled={isViewMode || mode === 'edit'}
                                    placeholder="EP001"
                                    required
                                    error={errors.employee_code}
                                    hint="Format: EPXXX (e.g., EP001). This will also be the default password."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Currency
                                </label>
                                <CommonDropDown
                                    value={formData.currency}
                                    onChange={(val) => handleInputChange('currency', val)}
                                    disabled={isViewMode}
                                    options={[
                                        { label: '₹ INR - Indian Rupee', value: 'INR' },
                                        { label: '$ USD - US Dollar', value: 'USD' },
                                        { label: '£ GBP - British Pound', value: 'GBP' },
                                        { label: '€ EUR - Euro', value: 'EUR' },
                                        { label: 'S$ SGD - Singapore Dollar', value: 'SGD' }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CommonInputField
                                label="First Name *"
                                value={formData.first_name}
                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Enter first name"
                                required
                                error={errors.first_name}
                                icon={<User className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Last Name *"
                                value={formData.last_name}
                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Enter last name"
                                required
                                error={errors.last_name}
                                icon={<User className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Email *"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Enter email address"
                                required
                                error={errors.email}
                                icon={<Mail className="w-4 h-4 text-gray-400" />}
                            />

                            <div className="lg:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assign Roles
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {roleOptions.map((role) => (
                                        <label
                                            key={role.value}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${selectedRoles.includes(role.value)
                                                    ? 'border-indigo-600 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                } ${isViewMode ? 'cursor-default' : ''}`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={selectedRoles.includes(role.value)}
                                                onChange={() => !isViewMode && handleRoleToggle(role.value)}
                                                disabled={isViewMode}
                                            />
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-0.5 w-4 h-4 border rounded flex items-center justify-center ${selectedRoles.includes(role.value)
                                                        ? 'bg-indigo-600 border-indigo-600'
                                                        : 'border-gray-300'
                                                    }`}>
                                                    {selectedRoles.includes(role.value) && (
                                                        <Check className="w-3 h-3 text-white" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{role.label}</div>
                                                    <div className="text-xs text-gray-500">{role.description}</div>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-indigo-600" />
                            Employment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CommonDropDown
                                label="Department *"
                                value={formData.department}
                                onChange={(val) => {
                                    handleInputChange('department', val);
                                    handleInputChange('designation', '');
                                }}
                                disabled={isViewMode}
                                options={departments}
                                placeholder="Select department"
                                required
                                error={errors.department}
                                icon={<Building className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDropDown
                                label="Designation *"
                                value={formData.designation}
                                onChange={(val) => handleInputChange('designation', val)}
                                disabled={isViewMode || !formData.department}
                                options={getDesignationsByDepartment(formData.department)}
                                placeholder="Select designation"
                                required
                                error={errors.designation}
                                icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDatePicker
                                label="Joining Date"
                                value={formData.joining_date}
                                onChange={(val) => handleInputChange('joining_date', val)}
                                disabled={isViewMode}
                                placeholder="dd-mm-yyyy"
                                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDropDown
                                label="Employee Type"
                                value={formData.employment_type}
                                onChange={(val) => handleInputChange('employment_type', val)}
                                disabled={isViewMode}
                                options={[
                                    { label: 'Permanent', value: 'Permanent' },
                                    { label: 'Contract', value: 'Contract' },
                                    { label: 'Intern', value: 'Intern' },
                                    { label: 'Part-time', value: 'Part-time' }
                                ]}
                                icon={<BriefcaseMedical className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Reporting Manager"
                                value={formData.reporting_manager}
                                onChange={(e) => handleInputChange('reporting_manager', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Enter reporting manager name"
                                icon={<Users className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Probation Period (Months)"
                                type="number"
                                value={formData.probation_period}
                                onChange={(e) => handleInputChange('probation_period', e.target.value)}
                                disabled={isViewMode}
                                placeholder="e.g., 6"
                                min="0"
                                max="12"
                                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDatePicker
                                label="Probation End Date"
                                value={formData.probation_end_date}
                                onChange={(val) => handleInputChange('probation_end_date', val)}
                                disabled={isViewMode || !formData.joining_date}
                                minDate={formData.joining_date}
                                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Contact & Address */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-indigo-600" />
                            Contact & Address Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <CommonInputField
                                label="Mobile Number *"
                                type="tel"
                                value={formData.mobile_number}
                                onChange={(e) => handleInputChange('mobile_number', e.target.value)}
                                disabled={isViewMode}
                                placeholder="+91 9876543210"
                                required
                                error={errors.mobile_number}
                                icon={<Phone className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Alternate Mobile"
                                type="tel"
                                value={formData.alternate_mobile}
                                onChange={(e) => handleInputChange('alternate_mobile', e.target.value)}
                                disabled={isViewMode}
                                placeholder="+91 9876543211"
                                icon={<PhoneCall className="w-4 h-4 text-gray-400" />}
                            />
                        </div>

                        <div className="space-y-4">
                            <CommonInputField
                                label="Address Line 1 *"
                                value={formData.current_address}
                                onChange={(e) => handleInputChange('current_address', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Street address, P.O. Box, etc."
                                required
                                error={errors.current_address}
                                icon={<MapPin className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Address Line 2"
                                value={formData.permanent_address}
                                onChange={(e) => handleInputChange('permanent_address', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Apartment, suite, unit, building, floor, etc."
                                icon={<Home className="w-4 h-4 text-gray-400" />}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <CommonInputField
                                    label="City *"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="Enter city"
                                    required
                                    error={errors.city}
                                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                />

                                <CommonInputField
                                    label="State *"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange('state', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="Enter state"
                                    required
                                    error={errors.state}
                                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                                />

                                <CommonDropDown
                                    label="Country *"
                                    value={formData.country}
                                    onChange={(val) => handleInputChange('country', val)}
                                    disabled={isViewMode}
                                    options={countries}
                                    placeholder="Select country"
                                    required
                                    icon={<Globe className="w-4 h-4 text-gray-400" />}
                                />

                                <CommonInputField
                                    label="PIN/Postal Code *"
                                    value={formData.pincode}
                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    disabled={isViewMode}
                                    placeholder="Enter PIN code"
                                    required
                                    error={errors.pincode}
                                    icon={<Hash className="w-4 h-4 text-gray-400" />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-indigo-600" />
                            Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <CommonInputField
                                label="PAN Number"
                                value={formData.pan_number}
                                onChange={(e) => handleInputChange('pan_number', e.target.value)}
                                disabled={isViewMode}
                                placeholder="ABCDE1234F"
                                error={errors.pan_number}
                                icon={<Shield className="w-4 h-4 text-gray-400" />}
                                hint="10 characters alphanumeric"
                            />

                            <CommonDatePicker
                                label="Date of Birth"
                                value={formData.date_of_birth}
                                onChange={(val) => handleInputChange('date_of_birth', val)}
                                disabled={isViewMode}
                                placeholder="dd-mm-yyyy"
                                maxDate={new Date().toISOString().split('T')[0]}
                                icon={<Calendar className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDropDown
                                label="Gender"
                                value={formData.gender}
                                onChange={(val) => handleInputChange('gender', val)}
                                disabled={isViewMode}
                                options={[
                                    { label: 'Male', value: 'Male' },
                                    { label: 'Female', value: 'Female' },
                                    { label: 'Other', value: 'Other' },
                                    { label: 'Prefer not to say', value: 'Prefer not to say' }
                                ]}
                                placeholder="Select gender"
                                icon={<User className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonDropDown
                                label="Blood Group"
                                value={formData.blood_group}
                                onChange={(val) => handleInputChange('blood_group', val)}
                                disabled={isViewMode}
                                options={[
                                    { label: 'A+', value: 'A+' },
                                    { label: 'A-', value: 'A-' },
                                    { label: 'B+', value: 'B+' },
                                    { label: 'B-', value: 'B-' },
                                    { label: 'O+', value: 'O+' },
                                    { label: 'O-', value: 'O-' },
                                    { label: 'AB+', value: 'AB+' },
                                    { label: 'AB-', value: 'AB-' }
                                ]}
                                placeholder="Select blood group"
                            />
                        </div>
                    </div>

                    {/* Bank Account Details */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                            Bank Account Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CommonInputField
                                label="Account Number"
                                value={formData.bank_account_number}
                                onChange={(e) => handleInputChange('bank_account_number', e.target.value)}
                                disabled={isViewMode}
                                placeholder="1234567890"
                                error={errors.bank_account_number}
                                hint="9-18 digits"
                                icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Bank Name"
                                value={formData.bank_name}
                                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                                disabled={isViewMode}
                                placeholder="e.g., State Bank of India"
                                icon={<Building className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="IFSC Code"
                                value={formData.ifsc_code}
                                onChange={(e) => handleInputChange('ifsc_code', e.target.value)}
                                disabled={isViewMode}
                                placeholder="SBIN0001234"
                                error={errors.ifsc_code}
                                hint="IFSC: 11 characters (e.g., SBIN0001234)"
                                icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Branch Name"
                                value={formData.branch_name}
                                onChange={(e) => handleInputChange('branch_name', e.target.value)}
                                disabled={isViewMode}
                                placeholder="Main Branch"
                                icon={<Building className="w-4 h-4 text-gray-400" />}
                            />

                            <CommonInputField
                                label="Account Holder Name"
                                value={formData.account_holder_name}
                                onChange={(e) => handleInputChange('account_holder_name', e.target.value)}
                                disabled={isViewMode}
                                placeholder="As per bank records"
                                icon={<User className="w-4 h-4 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Accounting Integration */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-indigo-600" />
                            Accounting Integration
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CommonInputField
                                label="Account Head"
                                value={formData.account_head}
                                onChange={(e) => handleInputChange('account_head', e.target.value)}
                                disabled={isViewMode}
                                placeholder="e.g., Salary Expense"
                                hint="GL account for salary booking"
                                icon={<Layers className="w-4 h-4 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5 text-indigo-600" />
                            Status
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CommonDropDown
                                label="Employee Status"
                                value={formData.employee_status}
                                onChange={(val) => handleInputChange('employee_status', val)}
                                disabled={isViewMode}
                                options={[
                                    { label: 'Active', value: 'Active' },
                                    { label: 'Inactive', value: 'Inactive' },
                                    { label: 'Probation', value: 'Probation' },
                                    { label: 'Terminated', value: 'Terminated' },
                                    { label: 'On Leave', value: 'On Leave' }
                                ]}
                                icon={<Check className="w-4 h-4 text-gray-400" />}
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    {!isViewMode && (
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {mode === 'add' ? 'Add Employee' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
    );
}

export default EmpMstAddEditEntry;