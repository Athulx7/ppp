import React, { useState } from 'react'
import {
    User, Mail, Key, Briefcase, Calendar, MapPin,
    Phone, CreditCard, Building, Edit, Save, X,
    ChevronRight, Lock, Globe, IndianRupee
} from 'lucide-react'

function UserProfileEntry() {
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        // Basic Information
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@pppa.com",
        employeeCode: "EP008",
        employeeId: "EMP001",

        // Role Information
        roles: ["Employee", "HR"],

        // Job Information
        department: "Human Resources",
        designation: "HR Manager",
        joiningDate: "15-01-2023",
        employeeType: "Permanent",
        probationPeriod: 6,
        probationEndDate: "15-07-2023",
        reportingManager: "Sarah Johnson",
        currency: "₹ INR - Indian Rupee",

        // Address Details
        addressLine1: "123 Corporate Tower",
        addressLine2: "Floor 8, Office 802",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400001",

        // Personal Information
        panNumber: "ABCDE1234F",
        mobileNumber: "+91 9876543210",
        dateOfBirth: "15-05-1990",
        gender: "Male",

        // Bank Details
        accountNumber: "1234567890123456",
        bankName: "State Bank of India",
        ifscCode: "SBIN0001234",
        branchName: "Main Branch, Nariman Point",

        // Accounting
        accountHead: "Salary Expense - HR Department",

        // Status
        status: "Active",
        lastLogin: "2024-01-15 14:30:25"
    })

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        // In real app, save to API here
        setIsEditing(false)
        console.log('Saved profile:', profileData)
    }

    const handleCancel = () => {
        setIsEditing(false)
        // Reset to original data here if needed
    }

    const handleChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const InfoSection = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            </div>
            {children}
        </div>
    )

    const InfoField = ({ label, value, fieldName, editable = true, type = "text" }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            {isEditing && editable ? (
                type === "select" ? (
                    <select
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => handleChange(fieldName, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                )
            ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-800">{value || "Not provided"}</span>
                </div>
            )}
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50">
            <div className=" mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your personal and professional information</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                                    >
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEdit}
                                    className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Breadcrumb */}
                    <div className="flex items-center text-sm text-gray-500 mt-6">
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-blue-600">My Profile</span>
                    </div>
                </div>

                {/* Profile Summary Card */}
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
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

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <InfoSection title="Basic Information" icon={User}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField
                                    label="First Name"
                                    value={profileData.firstName}
                                    fieldName="firstName"
                                    editable={false}
                                />
                                <InfoField
                                    label="Last Name"
                                    value={profileData.lastName}
                                    fieldName="lastName"
                                    editable={false}
                                />
                                <div className="md:col-span-2">
                                    <InfoField
                                        label="Email Address"
                                        value={profileData.email}
                                        fieldName="email"
                                    />
                                </div>
                                <InfoField
                                    label="Employee Code"
                                    value={profileData.employeeCode}
                                    fieldName="employeeCode"
                                    editable={false}
                                />
                                <InfoField
                                    label="Reference Employee Code"
                                    value={profileData.employeeId}
                                    fieldName="employeeId"
                                />
                            </div>
                        </InfoSection>

                        {/* Job Information */}
                        <InfoSection title="Employment Details" icon={Briefcase}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField
                                    label="Department"
                                    value={profileData.department}
                                    fieldName="department"
                                />
                                <InfoField
                                    label="Designation"
                                    value={profileData.designation}
                                    fieldName="designation"
                                />
                                <InfoField
                                    label="Joining Date"
                                    value={profileData.joiningDate}
                                    fieldName="joiningDate"
                                    type="date"
                                />
                                <InfoField
                                    label="Employee Type"
                                    value={profileData.employeeType}
                                    fieldName="employeeType"
                                />
                                <InfoField
                                    label="Probation Period (Months)"
                                    value={profileData.probationPeriod}
                                    fieldName="probationPeriod"
                                    type="number"
                                />
                                <InfoField
                                    label="Probation End Date"
                                    value={profileData.probationEndDate}
                                    fieldName="probationEndDate"
                                    type="date"
                                />
                                <div className="md:col-span-2">
                                    <InfoField
                                        label="Reporting Manager"
                                        value={profileData.reportingManager}
                                        fieldName="reportingManager"
                                    />
                                </div>
                                <InfoField
                                    label="Currency"
                                    value={profileData.currency}
                                    fieldName="currency"
                                />
                            </div>
                        </InfoSection>

                        {/* Personal Information */}
                        <InfoSection title="Personal Information" icon={User}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoField
                                    label="PAN Number"
                                    value={profileData.panNumber}
                                    fieldName="panNumber"
                                />
                                <InfoField
                                    label="Mobile Number"
                                    value={profileData.mobileNumber}
                                    fieldName="mobileNumber"
                                />
                                <InfoField
                                    label="Date of Birth"
                                    value={profileData.dateOfBirth}
                                    fieldName="dateOfBirth"
                                    type="date"
                                />
                                <InfoField
                                    label="Gender"
                                    value={profileData.gender}
                                    fieldName="gender"
                                    type="select"
                                />
                            </div>
                        </InfoSection>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Address Details */}
                        <InfoSection title="Address Details" icon={MapPin}>
                            <div className="space-y-4">
                                <InfoField
                                    label="Address Line 1"
                                    value={profileData.addressLine1}
                                    fieldName="addressLine1"
                                />
                                <InfoField
                                    label="Address Line 2"
                                    value={profileData.addressLine2}
                                    fieldName="addressLine2"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField
                                        label="City"
                                        value={profileData.city}
                                        fieldName="city"
                                    />
                                    <InfoField
                                        label="State"
                                        value={profileData.state}
                                        fieldName="state"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoField
                                        label="Country"
                                        value={profileData.country}
                                        fieldName="country"
                                    />
                                    <InfoField
                                        label="PIN/Postal Code"
                                        value={profileData.pincode}
                                        fieldName="pincode"
                                        type="number"
                                    />
                                </div>
                            </div>
                        </InfoSection>

                        {/* Bank Account Details */}
                        <InfoSection title="Bank Account Details" icon={CreditCard}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <InfoField
                                        label="Account Number"
                                        value={profileData.accountNumber}
                                        fieldName="accountNumber"
                                    />
                                </div>
                                <InfoField
                                    label="Bank Name"
                                    value={profileData.bankName}
                                    fieldName="bankName"
                                />
                                <InfoField
                                    label="IFSC Code"
                                    value={profileData.ifscCode}
                                    fieldName="ifscCode"
                                />
                                <div className="md:col-span-2">
                                    <InfoField
                                        label="Branch Name"
                                        value={profileData.branchName}
                                        fieldName="branchName"
                                    />
                                </div>
                            </div>
                        </InfoSection>

                        {/* Accounting & Status */}
                        <InfoSection title="Accounting & Status" icon={Globe}>
                            <div className="space-y-4">
                                <InfoField
                                    label="Account Head"
                                    value={profileData.accountHead}
                                    fieldName="accountHead"
                                />
                                <InfoField
                                    label="Employee Status"
                                    value={profileData.status}
                                    fieldName="status"
                                />
                            </div>
                        </InfoSection>

                        {/* Security Information */}
                        <InfoSection title="Security Information" icon={Lock}>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Key className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <div className="font-medium text-gray-800">Password</div>
                                            <div className="text-sm text-gray-500">Last changed 30 days ago</div>
                                        </div>
                                    </div>
                                    <button className="px-4 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition">
                                        Change
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
                        </InfoSection>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                        Export Profile
                    </button>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Send Profile Summary
                    </button>
                    <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Schedule Review
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-800">Need Help?</h4>
                            <p className="text-blue-700 text-sm mt-1">
                                Contact your HR administrator for any changes to non-editable fields.
                                Some information like Employee Code and Email require admin approval to change.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfileEntry