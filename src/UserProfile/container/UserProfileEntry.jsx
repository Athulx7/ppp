import React, { useState } from 'react'
import {
    User, Mail, Key, Briefcase, Calendar, MapPin,
    Phone, CreditCard, Building, Edit, Save, X,
    Lock, Globe, IndianRupee, UserCircle, Home,
    Smartphone, FileText, Shield, Settings, Banknote, Download,
    Edit2
} from 'lucide-react'
import BreadCrumb from '../../basicComponents/BreadCrumb'
import CommonInputField from '../../basicComponents/CommonInputField'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'

function UserProfileEntry() {
    const [isEditing, setIsEditing] = useState(false)
    const [activeTab, setActiveTab] = useState('basic')
    const [profileData, setProfileData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@company.com",
        employeeCode: "EP008",
        employeeId: "EMP001",

        roles: ["Employee", "HR"],

        department: "Human Resources",
        designation: "HR Manager",
        joiningDate: "2023-01-15",
        employeeType: "Permanent",
        probationPeriod: 6,
        probationEndDate: "2023-07-15",
        reportingManager: "Sarah Johnson",
        currency: "INR - Indian Rupee",

        addressLine1: "123 Corporate Tower",
        addressLine2: "Floor 8, Office 802",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",

        panNumber: "ABCDE1234F",
        mobileNumber: "+91 9876543210",
        alternateMobile: "+91 9876543211",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        maritalStatus: "Married",

        accountNumber: "1234567890123456",
        accountHolderName: "John Doe",
        bankName: "State Bank of India",
        ifscCode: "SBIN0001234",
        branchName: "Main Branch, Nariman Point",
        accountType: "Savings",

        emergencyContactName: "Jane Doe",
        emergencyContactNumber: "+91 9876543212",
        emergencyContactRelation: "Spouse",

        highestQualification: "MBA",
        university: "University of Mumbai",
        yearOfPassing: "2015",

        status: "Active",
        lastLogin: "2024-01-15 14:30:25"
    })

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <UserCircle className="w-4 h-4" /> },
        { id: 'employment', label: 'Employment', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
        { id: 'address', label: 'Address', icon: <Home className="w-4 h-4" /> },
        { id: 'bank', label: 'Bank Details', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'emergency', label: 'Emergency', icon: <Smartphone className="w-4 h-4" /> },
        { id: 'education', label: 'Education', icon: <FileText className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> }
    ]

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        setIsEditing(false)
        console.log('Saved profile:', profileData)
        alert('Profile updated successfully!')
    }

    const handleCancel = () => {
        setIsEditing(false)
    }

    const handleChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Employee Code"
                    value={profileData.employeeCode}
                    disabled={true}
                    onChange={(e) => handleChange('employeeCode', e.target.value)}
                    placeholder="Employee code"
                />

                <CommonInputField
                    label="Employee ID"
                    value={profileData.employeeId}
                    disabled={true}
                    onChange={(e) => handleChange('employeeId', e.target.value)}
                    placeholder="Employee ID"
                />

                <CommonInputField
                    label="First Name"
                    value={profileData.firstName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    required={true}
                />

                <CommonInputField
                    label="Last Name"
                    value={profileData.lastName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    required={true}
                />

                <CommonInputField
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter email address"
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    required={true}
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Roles
                    </label>
                    <div className="p-3 bg-gray-100 rounded-lg border border-indigo-600">
                        <div className="flex flex-wrap gap-2">
                            {profileData.roles.map((role, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${role === 'Admin'
                                        ? 'bg-red-100 text-red-800'
                                        : role === 'HR'
                                            ? 'bg-blue-100 text-blue-800'
                                            : role === 'Payroll Manager'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            Roles are managed by system administrators
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderEmploymentInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonDropDown
                    label="Department"
                    value={profileData.department}
                    options={[
                        { label: 'Human Resources', value: 'Human Resources' },
                        { label: 'Engineering', value: 'Engineering' },
                        { label: 'Sales', value: 'Sales' },
                        { label: 'Marketing', value: 'Marketing' },
                        { label: 'Finance', value: 'Finance' },
                        { label: 'Operations', value: 'Operations' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('department', value)}
                    placeholder="Select department"
                    required={true}
                />

                <CommonInputField
                    label="Designation"
                    value={profileData.designation}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    placeholder="Enter designation"
                    required={true}
                />

                <CommonDatePicker
                    label="Joining Date"
                    value={profileData.joiningDate}
                    onChange={(value) => handleChange('joiningDate', value)}
                    disabled={!isEditing}
                    required={true}
                />

                <CommonDropDown
                    label="Employee Type"
                    value={profileData.employeeType}
                    options={[
                        { label: 'Permanent', value: 'Permanent' },
                        { label: 'Contract', value: 'Contract' },
                        { label: 'Intern', value: 'Intern' },
                        { label: 'Trainee', value: 'Trainee' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('employeeType', value)}
                    placeholder="Select employee type"
                    required={true}
                />

                <CommonInputField
                    label="Probation Period (Months)"
                    type="number"
                    value={profileData.probationPeriod}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('probationPeriod', e.target.value)}
                    placeholder="Enter probation period"
                />

                <CommonDatePicker
                    label="Probation End Date"
                    value={profileData.probationEndDate}
                    onChange={(value) => handleChange('probationEndDate', value)}
                    disabled={!isEditing}
                />

                <CommonInputField
                    label="Reporting Manager"
                    value={profileData.reportingManager}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('reportingManager', e.target.value)}
                    placeholder="Enter reporting manager"
                />

                <CommonDropDown
                    label="Currency"
                    value={profileData.currency}
                    options={[
                        { label: 'INR - Indian Rupee', value: 'INR - Indian Rupee' },
                        { label: 'USD - US Dollar', value: 'USD - US Dollar' },
                        { label: 'EUR - Euro', value: 'EUR - Euro' },
                        { label: 'GBP - British Pound', value: 'GBP - British Pound' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('currency', value)}
                    placeholder="Select currency"
                    icon={<Banknote className="w-4 h-4 text-gray-400" />}
                />
            </div>
        </div>
    )

    const renderPersonalInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="PAN Number"
                    value={profileData.panNumber}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('panNumber', e.target.value)}
                    placeholder="Enter PAN number"
                />

                <CommonInputField
                    label="Mobile Number"
                    type="tel"
                    value={profileData.mobileNumber}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('mobileNumber', e.target.value)}
                    placeholder="Enter mobile number"
                    required={true}
                />

                <CommonInputField
                    label="Alternate Mobile Number"
                    type="tel"
                    value={profileData.alternateMobile}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('alternateMobile', e.target.value)}
                    placeholder="Enter alternate mobile number"
                />

                <CommonDatePicker
                    label="Date of Birth"
                    value={profileData.dateOfBirth}
                    onChange={(value) => handleChange('dateOfBirth', value)}
                    disabled={!isEditing}
                />

                <CommonDropDown
                    label="Gender"
                    value={profileData.gender}
                    options={[
                        { label: 'Male', value: 'Male' },
                        { label: 'Female', value: 'Female' },
                        { label: 'Other', value: 'Other' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('gender', value)}
                    placeholder="Select gender"
                />

                <CommonDropDown
                    label="Marital Status"
                    value={profileData.maritalStatus}
                    options={[
                        { label: 'Single', value: 'Single' },
                        { label: 'Married', value: 'Married' },
                        { label: 'Divorced', value: 'Divorced' },
                        { label: 'Widowed', value: 'Widowed' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('maritalStatus', value)}
                    placeholder="Select marital status"
                />
            </div>
        </div>
    )

    const renderAddressInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <CommonInputField
                    label="Address Line 1"
                    value={profileData.addressLine1}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('addressLine1', e.target.value)}
                    placeholder="Enter address line 1"
                    required={true}
                    icon={<MapPin className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Address Line 2"
                    value={profileData.addressLine2}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('addressLine2', e.target.value)}
                    placeholder="Enter address line 2"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CommonInputField
                        label="City"
                        value={profileData.city}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Enter city"
                        required={true}
                    />

                    <CommonInputField
                        label="State"
                        value={profileData.state}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('state', e.target.value)}
                        placeholder="Enter state"
                        required={true}
                    />

                    <CommonInputField
                        label="PIN Code"
                        value={profileData.pincode}
                        disabled={!isEditing}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        placeholder="Enter PIN code"
                        required={true}
                    />
                </div>

                <CommonInputField
                    label="Country"
                    value={profileData.country}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Enter country"
                    required={true}
                />
            </div>
        </div>
    )

    const renderBankInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Account Holder Name"
                    value={profileData.accountHolderName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('accountHolderName', e.target.value)}
                    placeholder="Enter account holder name"
                    required={true}
                />

                <CommonInputField
                    label="Account Number"
                    value={profileData.accountNumber}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="Enter account number"
                    required={true}
                    icon={<CreditCard className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Bank Name"
                    value={profileData.bankName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('bankName', e.target.value)}
                    placeholder="Enter bank name"
                    required={true}
                />

                <CommonInputField
                    label="IFSC Code"
                    value={profileData.ifscCode}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('ifscCode', e.target.value)}
                    placeholder="Enter IFSC code"
                    required={true}
                />

                <CommonInputField
                    label="Branch Name"
                    value={profileData.branchName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('branchName', e.target.value)}
                    placeholder="Enter branch name"
                />

                <CommonDropDown
                    label="Account Type"
                    value={profileData.accountType}
                    options={[
                        { label: 'Savings', value: 'Savings' },
                        { label: 'Current', value: 'Current' },
                        { label: 'Salary', value: 'Salary' },
                        { label: 'Fixed Deposit', value: 'Fixed Deposit' }
                    ]}
                    disabled={!isEditing}
                    onChange={(value) => handleChange('accountType', value)}
                    placeholder="Select account type"
                />
            </div>
        </div>
    )

    const renderEmergencyInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Emergency Contact Name"
                    value={profileData.emergencyContactName}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    placeholder="Enter emergency contact name"
                    required={true}
                />

                <CommonInputField
                    label="Emergency Contact Number"
                    type="tel"
                    value={profileData.emergencyContactNumber}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactNumber', e.target.value)}
                    placeholder="Enter emergency contact number"
                    required={true}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Relationship"
                    value={profileData.emergencyContactRelation}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                    placeholder="Enter relationship"
                />
            </div>
        </div>
    )

    const renderEducationInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Highest Qualification"
                    value={profileData.highestQualification}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('highestQualification', e.target.value)}
                    placeholder="Enter highest qualification"
                />

                <CommonInputField
                    label="University/Institution"
                    value={profileData.university}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('university', e.target.value)}
                    placeholder="Enter university/institution"
                />

                <CommonInputField
                    label="Year of Passing"
                    value={profileData.yearOfPassing}
                    disabled={!isEditing}
                    onChange={(e) => handleChange('yearOfPassing', e.target.value)}
                    placeholder="Enter year of passing"
                />
            </div>
        </div>
    )

    const renderSecurityInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Password Settings</h4>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                                <Lock className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="font-medium text-gray-800">Password</div>
                                    <div className="text-sm text-gray-500">Last changed: 30 days ago</div>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                                Change Password
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div className="flex items-center gap-3">
                                <IndianRupee className="w-5 h-5 text-gray-500" />
                                <div>
                                    <div className="font-medium text-gray-800">Default Password</div>
                                    <div className="text-sm text-gray-500">Employee Code: {profileData.employeeCode}</div>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                Auto-generated
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-4">Account Status</h4>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div>
                                <div className="font-medium text-gray-800">Account Status</div>
                                <div className="text-sm text-gray-500">Current status of your account</div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                {profileData.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                            <div>
                                <div className="font-medium text-gray-800">Last Login</div>
                                <div className="text-sm text-gray-500">Date and time of your last login</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium text-gray-800">
                                    {profileData.lastLogin.split(' ')[0]}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {profileData.lastLogin.split(' ')[1]}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderContent = () => {
        switch (activeTab) {
            case 'basic': return renderBasicInfo();
            case 'employment': return renderEmploymentInfo();
            case 'personal': return renderPersonalInfo();
            case 'address': return renderAddressInfo();
            case 'bank': return renderBankInfo();
            case 'emergency': return renderEmergencyInfo();
            case 'education': return renderEducationInfo();
            case 'security': return renderSecurityInfo();
            default: return renderBasicInfo();
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="mx-auto">
                <div className="mb-8">
                    <BreadCrumb
                        items={[{ label: "User Profile", }]}
                        title="User Profile"
                        description="Manage your personal and professional information"
                        actions={
                            <div className="flex items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                    </>

                                ) : (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Settings
                                        </button>
                                    </>
                                )}
                            </div>
                        }
                    />
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{profileData.designation}</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{profileData.department}</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-700">{profileData.email}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {profileData.roles.map((role, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${role === 'Admin'
                                            ? 'bg-red-100 text-red-800'
                                            : role === 'HR'
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : role === 'Payroll Manager'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        {role}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg min-w-[200px]">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Employee ID</span>
                                    <span className="font-semibold">{profileData.employeeCode}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Status</span>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        {profileData.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Last Login</span>
                                    <span className="font-medium">{profileData.lastLogin}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'text-indigo-600 border-b-2 border-indigo-600'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </div>
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {isEditing ? (
                            <p>Click "Edit Settings" to modify company information</p>
                        ) : (
                            <p>Make your changes and click "Save Changes" to update company settings</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => alert('Hai')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Profile
                        </button>

                        {isEditing && (
                            <button
                                onClick={() => {
                                    const shouldReset = window.confirm('Are you sure you want to reset to default settings? This will discard all customizations.');
                                    if (shouldReset) {
                                        alert('Settings reset to default!');
                                    }
                                }}
                                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Reset to Default
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileEntry