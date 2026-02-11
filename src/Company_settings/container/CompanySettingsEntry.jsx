import React, { useState, useEffect } from 'react';
import {
    Building, MapPin, Phone, Mail, Globe, CreditCard,
    Edit2, Save, X, Upload, Eye, Download,
    Banknote, FileText, Users, Shield, Calendar
} from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import CommonDropDown from '../../basicComponents/CommonDropDown';

function CompanySettingsEntry() {
    // Initial company data
    const initialCompanyData = {
        basicInfo: {
            companyName: "TechCorp Solutions",
            legalName: "TechCorp Solutions Pvt. Ltd.",
            registrationNumber: "GST1234567890",
            foundedDate: "2015-01-15",
            industryType: "Information Technology",
            companySize: "200-500",
            description: "Leading provider of innovative software solutions"
        },
        contactDetails: {
            primaryEmail: "info@techcorp.com",
            secondaryEmail: "hr@techcorp.com",
            phoneNumber: "+1 (555) 123-4567",
            mobileNumber: "+1 (555) 987-6543",
            faxNumber: "+1 (555) 456-7890"
        },
        address: {
            headOffice: "123 Tech Park, Silicon Valley",
            city: "San Francisco",
            state: "California",
            country: "United States",
            postalCode: "94105",
            additionalBranches: [
                "456 Innovation Drive, New York",
                "789 Tech Street, Austin"
            ]
        },
        financialDetails: {
            defaultCurrency: "USD - US Dollar",
            taxId: "TAX-987654321",
            bankName: "Global Bank Inc.",
            bankAccountNumber: "123456789012",
            bankBranch: "San Francisco Main",
            bankIfscCode: "GBANK12345",
            swiftCode: "GBANKUS33",
            financialYearStart: "January",
            financialYearEnd: "December"
        },
        digitalPresence: {
            website: "www.techcorp.com",
            domain: "techcorp.com",
            linkedin: "linkedin.com/company/techcorp",
            twitter: "twitter.com/techcorp",
            employeePortalUrl: "portal.techcorp.com"
        },
        compliance: {
            registrationCertificate: "registered-certificate.pdf",
            taxCertificate: "tax-certificate.pdf",
            licenseNumber: "LIC-789012",
            licenseExpiry: "2025-12-31",
            insurancePolicy: "INS-456789",
            insuranceExpiry: "2024-12-31"
        }
    };

    const [companyData, setCompanyData] = useState(initialCompanyData);
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [isViewMode, setIsViewMode] = useState(true);
    const [logoPreview, setLogoPreview] = useState(null);
    const [newBranch, setNewBranch] = useState('');

    // Dropdown options
    const industryOptions = [
        { label: 'Information Technology', value: 'Information Technology' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Education', value: 'Education' },
        { label: 'Other', value: 'Other' }
    ];

    const companySizeOptions = [
        { label: '1-10 Employees', value: '1-10' },
        { label: '11-50 Employees', value: '11-50' },
        { label: '51-200 Employees', value: '51-200' },
        { label: '200-500 Employees', value: '200-500' },
        { label: '500-1000 Employees', value: '500-1000' },
        { label: '1000+ Employees', value: '1000+' }
    ];

    const currencyOptions = [
        { label: 'USD - US Dollar', value: 'USD - US Dollar' },
        { label: 'EUR - Euro', value: 'EUR - Euro' },
        { label: 'GBP - British Pound', value: 'GBP - British Pound' },
        { label: 'INR - Indian Rupee', value: 'INR - Indian Rupee' },
        { label: 'JPY - Japanese Yen', value: 'JPY - Japanese Yen' },
        { label: 'CAD - Canadian Dollar', value: 'CAD - Canadian Dollar' },
        { label: 'AUD - Australian Dollar', value: 'AUD - Australian Dollar' }
    ];

    const monthOptions = [
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' }
    ];

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('companySettings');
        if (savedData) {
            setCompanyData(JSON.parse(savedData));
        }
    }, []);

    // Save data to localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('companySettings', JSON.stringify(companyData));
    };

    const handleInputChange = (section, field, value) => {
        setCompanyData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        saveToLocalStorage();
        setIsEditing(false);
        setIsViewMode(true);
        alert('Company settings saved successfully!');
    };

    const handleCancel = () => {
        setCompanyData(initialCompanyData);
        setIsEditing(false);
        setIsViewMode(true);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
                localStorage.setItem('companyLogo', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddBranch = () => {
        if (newBranch.trim()) {
            setCompanyData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    additionalBranches: [...prev.address.additionalBranches, newBranch.trim()]
                }
            }));
            setNewBranch('');
        }
    };

    const handleRemoveBranch = (index) => {
        setCompanyData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                additionalBranches: prev.address.additionalBranches.filter((_, i) => i !== index)
            }
        }));
    };

    const downloadCompanyProfile = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(companyData, null, 2)], { type: 'application/json' });
        element.href = URL.createObjectURL(file);
        element.download = "company-profile.json";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: <Building className="w-4 h-4" /> },
        { id: 'contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> },
        { id: 'address', label: 'Address', icon: <MapPin className="w-4 h-4" /> },
        { id: 'financial', label: 'Financial', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'digital', label: 'Digital', icon: <Globe className="w-4 h-4" /> },
        { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> }
    ];

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Company Name"
                    value={companyData.basicInfo.companyName}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('basicInfo', 'companyName', e.target.value)}
                    placeholder="Enter company name"
                    required={true}
                />

                <CommonInputField
                    label="Legal Name"
                    value={companyData.basicInfo.legalName}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('basicInfo', 'legalName', e.target.value)}
                    placeholder="Enter legal name"
                    required={true}
                />

                <CommonInputField
                    label="Registration Number"
                    value={companyData.basicInfo.registrationNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('basicInfo', 'registrationNumber', e.target.value)}
                    placeholder="GST/Tax registration number"
                    required={true}
                />

                <CommonDatePicker
                    label="Founded Date"
                    value={companyData.basicInfo.foundedDate}
                    onChange={(value) => handleInputChange('basicInfo', 'foundedDate', value)}
                    disabled={isViewMode}
                />

                <CommonDropDown
                    label="Industry Type"
                    value={companyData.basicInfo.industryType}
                    options={industryOptions}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'industryType', value)}
                    placeholder="Select industry type"
                />

                <CommonDropDown
                    label="Company Size"
                    value={companyData.basicInfo.companySize}
                    options={companySizeOptions}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'companySize', value)}
                    placeholder="Select company size"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                </label>
                {isViewMode ? (
                    <div className="p-3 bg-gray-100 rounded-lg border border-indigo-600 min-h-[100px]">
                        {companyData.basicInfo.description}
                    </div>
                ) : (
                    <textarea
                        value={companyData.basicInfo.description}
                        onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)}
                        className="w-full p-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                        placeholder="Brief description about the company"
                    />
                )}
            </div>
        </div>
    );

    const renderContactDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Primary Email"
                    type="email"
                    value={companyData.contactDetails.primaryEmail}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('contactDetails', 'primaryEmail', e.target.value)}
                    placeholder="primary@company.com"
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                    required={true}
                />

                <CommonInputField
                    label="Secondary Email (HR)"
                    type="email"
                    value={companyData.contactDetails.secondaryEmail}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('contactDetails', 'secondaryEmail', e.target.value)}
                    placeholder="hr@company.com"
                    icon={<Mail className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Phone Number"
                    type="tel"
                    value={companyData.contactDetails.phoneNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('contactDetails', 'phoneNumber', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                    required={true}
                />

                <CommonInputField
                    label="Mobile Number"
                    type="tel"
                    value={companyData.contactDetails.mobileNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('contactDetails', 'mobileNumber', e.target.value)}
                    placeholder="+1 (555) 987-6543"
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Fax Number"
                    type="tel"
                    value={companyData.contactDetails.faxNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('contactDetails', 'faxNumber', e.target.value)}
                    placeholder="+1 (555) 456-7890"
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                />
            </div>
        </div>
    );

    const renderAddressDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Head Office Address <span className='ml-1 text-red-500'>*</span>
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-100 rounded-lg border border-indigo-600 flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            {companyData.address.headOffice}
                        </div>
                    ) : (
                        <textarea
                            value={companyData.address.headOffice}
                            onChange={(e) => handleInputChange('address', 'headOffice', e.target.value)}
                            className="w-full p-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            rows="2"
                            placeholder="Full address of head office"
                        />
                    )}
                </div>

                <CommonInputField
                    label="City"
                    value={companyData.address.city}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                    placeholder="City"
                    required={true}
                />

                <CommonInputField
                    label="State"
                    value={companyData.address.state}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                    placeholder="State/Province"
                    required={true}
                />

                <CommonInputField
                    label="Country"
                    value={companyData.address.country}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                    placeholder="Country"
                    required={true}
                />

                <CommonInputField
                    label="Postal Code"
                    value={companyData.address.postalCode}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                    placeholder="Postal/ZIP code"
                    required={true}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Branches
                </label>
                {isViewMode ? (
                    <div className="space-y-2">
                        {companyData.address.additionalBranches.map((branch, index) => (
                            <div key={index} className="p-3 bg-gray-100 rounded-lg border border-indigo-600 flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                {branch}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newBranch}
                                onChange={(e) => setNewBranch(e.target.value)}
                                className="flex-1 p-3 border border-indigo-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Enter branch address"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddBranch()}
                            />
                            <button
                                onClick={handleAddBranch}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <span>Add</span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            {companyData.address.additionalBranches.map((branch, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 border border-indigo-600 rounded-lg border">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {branch}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveBranch(index)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderFinancialDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonDropDown
                    label="Default Currency"
                    value={companyData.financialDetails.defaultCurrency}
                    options={currencyOptions}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'defaultCurrency', value)}
                    placeholder="Select currency"
                    icon={<Banknote className="w-4 h-4 text-gray-400" />}
                    required={true}
                />

                <CommonInputField
                    label="Tax ID"
                    value={companyData.financialDetails.taxId}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'taxId', e.target.value)}
                    placeholder="Tax identification number"
                    required={true}
                />

                <CommonInputField
                    label="Bank Name"
                    value={companyData.financialDetails.bankName}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'bankName', e.target.value)}
                    placeholder="Bank name"
                    required={true}
                />

                <CommonInputField
                    label="Account Number"
                    value={companyData.financialDetails.bankAccountNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'bankAccountNumber', e.target.value)}
                    placeholder="Bank account number"
                    required={true}
                />

                <CommonInputField
                    label="Bank Branch"
                    value={companyData.financialDetails.bankBranch}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'bankBranch', e.target.value)}
                    placeholder="Bank branch name"
                />

                <CommonInputField
                    label="IFSC Code"
                    value={companyData.financialDetails.bankIfscCode}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'bankIfscCode', e.target.value)}
                    placeholder="Bank IFSC code"
                />

                <CommonInputField
                    label="SWIFT Code"
                    value={companyData.financialDetails.swiftCode}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('financialDetails', 'swiftCode', e.target.value)}
                    placeholder="SWIFT/BIC code"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CommonDropDown
                        label="Financial Year Start"
                        value={companyData.financialDetails.financialYearStart}
                        options={monthOptions}
                        disabled={isViewMode}
                        onChange={(value) => handleInputChange('financialDetails', 'financialYearStart', value)}
                        placeholder="Select month"
                    />

                    <CommonDropDown
                        label="Financial Year End"
                        value={companyData.financialDetails.financialYearEnd}
                        options={monthOptions}
                        disabled={isViewMode}
                        onChange={(value) => handleInputChange('financialDetails', 'financialYearEnd', value)}
                        placeholder="Select month"
                    />
                </div>
            </div>
        </div>
    );

    const renderDigitalPresence = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Website"
                    type="url"
                    value={companyData.digitalPresence.website}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('digitalPresence', 'website', e.target.value)}
                    placeholder="www.company.com"
                    icon={<Globe className="w-4 h-4 text-gray-400" />}
                    required={true}
                />

                <CommonInputField
                    label="Company Domain"
                    value={companyData.digitalPresence.domain}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('digitalPresence', 'domain', e.target.value)}
                    placeholder="company.com"
                    required={true}
                />

                <CommonInputField
                    label="LinkedIn"
                    type="url"
                    value={companyData.digitalPresence.linkedin}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('digitalPresence', 'linkedin', e.target.value)}
                    placeholder="linkedin.com/company/company-name"
                    icon={<Globe className="w-4 h-4 text-gray-400" />}
                />

                <CommonInputField
                    label="Twitter"
                    type="url"
                    value={companyData.digitalPresence.twitter}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('digitalPresence', 'twitter', e.target.value)}
                    placeholder="twitter.com/company"
                    icon={<Globe className="w-4 h-4 text-gray-400" />}
                />

                <div className="md:col-span-2">
                    <CommonInputField
                        label="Employee Portal URL"
                        type="url"
                        value={companyData.digitalPresence.employeePortalUrl}
                        disabled={isViewMode}
                        onChange={(e) => handleInputChange('digitalPresence', 'employeePortalUrl', e.target.value)}
                        placeholder="portal.company.com"
                        icon={<Globe className="w-4 h-4 text-gray-400" />}
                        required={true}
                    />
                </div>
            </div>
        </div>
    );

    const renderCompliance = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Certificate
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-100 rounded-lg border border-indigo-600 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {companyData.compliance.registrationCertificate}
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={companyData.compliance.registrationCertificate}
                                onChange={(e) => handleInputChange('compliance', 'registrationCertificate', e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="certificate.pdf"
                            />
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Certificate
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-100 rounded-lg border border-indigo-600 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {companyData.compliance.taxCertificate}
                            </div>
                            <button className="text-indigo-600 hover:text-indigo-800">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={companyData.compliance.taxCertificate}
                                onChange={(e) => handleInputChange('compliance', 'taxCertificate', e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="tax-certificate.pdf"
                            />
                            <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    )}
                </div>

                <CommonInputField
                    label="License Number"
                    value={companyData.compliance.licenseNumber}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('compliance', 'licenseNumber', e.target.value)}
                    placeholder="Business license number"
                />

                <CommonDatePicker
                    label="License Expiry Date"
                    value={companyData.compliance.licenseExpiry}
                    onChange={(value) => handleInputChange('compliance', 'licenseExpiry', value)}
                    disabled={isViewMode}
                />

                <CommonInputField
                    label="Insurance Policy"
                    value={companyData.compliance.insurancePolicy}
                    disabled={isViewMode}
                    onChange={(e) => handleInputChange('compliance', 'insurancePolicy', e.target.value)}
                    placeholder="Insurance policy number"
                />

                <CommonDatePicker
                    label="Insurance Expiry Date"
                    value={companyData.compliance.insuranceExpiry}
                    onChange={(value) => handleInputChange('compliance', 'insuranceExpiry', value)}
                    disabled={isViewMode}
                />
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'basic': return renderBasicInfo();
            case 'contact': return renderContactDetails();
            case 'address': return renderAddressDetails();
            case 'financial': return renderFinancialDetails();
            case 'digital': return renderDigitalPresence();
            case 'compliance': return renderCompliance();
            default: return renderBasicInfo();
        }
    };

    return (
        <div className="p-3">
            <div className="mx-auto">
                <div className="mb-8">
                    <BreadCrumb
                        items={[{ label: "Company Settings", }]}
                        title="Company Settings"
                        description="Manage your company profile and settings"
                        actions={
                            <div className="flex items-center gap-3">
                                {isViewMode ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setIsViewMode(false);
                                                setIsEditing(true);
                                            }}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            Edit Settings
                                        </button>
                                    </>
                                ) : (
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
                                )}
                            </div>
                        }
                    />

                    {/* Logo Upload Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50">
                                    {logoPreview ? (
                                        <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                                    ) : (
                                        <Building className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Company Logo</h3>
                                    <p className="text-sm text-gray-500">Upload your company logo (PNG, JPG, max 2MB)</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <label className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 cursor-pointer">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload Logo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                </label>
                                {logoPreview && (
                                    <button
                                        onClick={() => setLogoPreview(null)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <div className="flex overflow-x-auto scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex pt-3 items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${activeTab === tab.id
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

                    {/* Tab Content */}
                    <div className="p-6">
                        {renderContent()}
                    </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                        {isViewMode ? (
                            <p>Click "Edit Settings" to modify company information</p>
                        ) : (
                            <p>Make your changes and click "Save Changes" to update company settings</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={downloadCompanyProfile}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download Profile
                        </button>

                        {isViewMode && (
                            <button
                                onClick={() => {
                                    const shouldReset = window.confirm('Are you sure you want to reset to default settings? This will discard all customizations.');
                                    if (shouldReset) {
                                        setCompanyData(initialCompanyData);
                                        localStorage.removeItem('companySettings');
                                        localStorage.removeItem('companyLogo');
                                        setLogoPreview(null);
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
    );
}

export default CompanySettingsEntry;