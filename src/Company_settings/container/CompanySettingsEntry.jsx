import React, { useState, useEffect } from 'react';
import {
    Building, MapPin, Phone, Mail, Globe, CreditCard,
    Edit2, Save, X, Upload, Eye, Download,
    Banknote, FileText, Users, Shield, Calendar
} from 'lucide-react';

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

    const handleNestedInputChange = (section, subSection, field, value) => {
        setCompanyData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [field]: value
                }
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
                // Save logo to localStorage
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

    const exportToPDF = () => {
        // In a real application, you would use a library like jsPDF or html2pdf
        alert('PDF export functionality would be implemented with a PDF library');
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.companyName}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.basicInfo.companyName}
                            onChange={(e) => handleInputChange('basicInfo', 'companyName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter company name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Legal Name *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.legalName}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.basicInfo.legalName}
                            onChange={(e) => handleInputChange('basicInfo', 'legalName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter legal name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Number *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.registrationNumber}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.basicInfo.registrationNumber}
                            onChange={(e) => handleInputChange('basicInfo', 'registrationNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="GST/Tax registration number"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Founded Date
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.foundedDate}</div>
                    ) : (
                        <input
                            type="date"
                            value={companyData.basicInfo.foundedDate}
                            onChange={(e) => handleInputChange('basicInfo', 'foundedDate', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry Type
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.industryType}</div>
                    ) : (
                        <select
                            value={companyData.basicInfo.industryType}
                            onChange={(e) => handleInputChange('basicInfo', 'industryType', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="Information Technology">Information Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.basicInfo.companySize}</div>
                    ) : (
                        <select
                            value={companyData.basicInfo.companySize}
                            onChange={(e) => handleInputChange('basicInfo', 'companySize', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="1-10">1-10 Employees</option>
                            <option value="11-50">11-50 Employees</option>
                            <option value="51-200">51-200 Employees</option>
                            <option value="200-500">200-500 Employees</option>
                            <option value="500-1000">500-1000 Employees</option>
                            <option value="1000+">1000+ Employees</option>
                        </select>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                </label>
                {isViewMode ? (
                    <div className="p-3 bg-gray-50 rounded-lg border min-h-[100px]">{companyData.basicInfo.description}</div>
                ) : (
                    <textarea
                        value={companyData.basicInfo.description}
                        onChange={(e) => handleInputChange('basicInfo', 'description', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Email *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {companyData.contactDetails.primaryEmail}
                        </div>
                    ) : (
                        <input
                            type="email"
                            value={companyData.contactDetails.primaryEmail}
                            onChange={(e) => handleInputChange('contactDetails', 'primaryEmail', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="primary@company.com"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Secondary Email (HR)
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {companyData.contactDetails.secondaryEmail}
                        </div>
                    ) : (
                        <input
                            type="email"
                            value={companyData.contactDetails.secondaryEmail}
                            onChange={(e) => handleInputChange('contactDetails', 'secondaryEmail', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="hr@company.com"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {companyData.contactDetails.phoneNumber}
                        </div>
                    ) : (
                        <input
                            type="tel"
                            value={companyData.contactDetails.phoneNumber}
                            onChange={(e) => handleInputChange('contactDetails', 'phoneNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Number
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {companyData.contactDetails.mobileNumber}
                        </div>
                    ) : (
                        <input
                            type="tel"
                            value={companyData.contactDetails.mobileNumber}
                            onChange={(e) => handleInputChange('contactDetails', 'mobileNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 987-6543"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fax Number
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            {companyData.contactDetails.faxNumber}
                        </div>
                    ) : (
                        <input
                            type="tel"
                            value={companyData.contactDetails.faxNumber}
                            onChange={(e) => handleInputChange('contactDetails', 'faxNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="+1 (555) 456-7890"
                        />
                    )}
                </div>
            </div>
        </div>
    );

    const renderAddressDetails = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Head Office Address *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                            {companyData.address.headOffice}
                        </div>
                    ) : (
                        <textarea
                            value={companyData.address.headOffice}
                            onChange={(e) => handleInputChange('address', 'headOffice', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="2"
                            placeholder="Full address of head office"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.address.city}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.address.city}
                            onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="City"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.address.state}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.address.state}
                            onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="State/Province"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.address.country}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.address.country}
                            onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Country"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.address.postalCode}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.address.postalCode}
                            onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Postal/ZIP code"
                        />
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Branches
                </label>
                {isViewMode ? (
                    <div className="space-y-2">
                        {companyData.address.additionalBranches.map((branch, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border flex items-start gap-2">
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
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter branch address"
                                onKeyPress={(e) => e.key === 'Enter' && handleAddBranch()}
                            />
                            <button
                                onClick={handleAddBranch}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <span>Add</span>
                            </button>
                        </div>
                        <div className="space-y-2">
                            {companyData.address.additionalBranches.map((branch, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Banknote className="w-4 h-4 text-gray-400" />
                            {companyData.financialDetails.defaultCurrency}
                        </div>
                    ) : (
                        <select
                            value={companyData.financialDetails.defaultCurrency}
                            onChange={(e) => handleInputChange('financialDetails', 'defaultCurrency', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="USD - US Dollar">USD - US Dollar</option>
                            <option value="EUR - Euro">EUR - Euro</option>
                            <option value="GBP - British Pound">GBP - British Pound</option>
                            <option value="INR - Indian Rupee">INR - Indian Rupee</option>
                            <option value="JPY - Japanese Yen">JPY - Japanese Yen</option>
                            <option value="CAD - Canadian Dollar">CAD - Canadian Dollar</option>
                            <option value="AUD - Australian Dollar">AUD - Australian Dollar</option>
                        </select>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.taxId}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.taxId}
                            onChange={(e) => handleInputChange('financialDetails', 'taxId', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tax identification number"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.bankName}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.bankName}
                            onChange={(e) => handleInputChange('financialDetails', 'bankName', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bank name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.bankAccountNumber}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.bankAccountNumber}
                            onChange={(e) => handleInputChange('financialDetails', 'bankAccountNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bank account number"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Branch
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.bankBranch}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.bankBranch}
                            onChange={(e) => handleInputChange('financialDetails', 'bankBranch', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bank branch name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        IFSC Code
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.bankIfscCode}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.bankIfscCode}
                            onChange={(e) => handleInputChange('financialDetails', 'bankIfscCode', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Bank IFSC code"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        SWIFT Code
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.swiftCode}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.financialDetails.swiftCode}
                            onChange={(e) => handleInputChange('financialDetails', 'swiftCode', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="SWIFT/BIC code"
                        />
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Financial Year Start
                        </label>
                        {isViewMode ? (
                            <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.financialYearStart}</div>
                        ) : (
                            <select
                                value={companyData.financialDetails.financialYearStart}
                                onChange={(e) => handleInputChange('financialDetails', 'financialYearStart', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="January">January</option>
                                <option value="April">April</option>
                                <option value="July">July</option>
                                <option value="October">October</option>
                            </select>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Financial Year End
                        </label>
                        {isViewMode ? (
                            <div className="p-3 bg-gray-50 rounded-lg border">{companyData.financialDetails.financialYearEnd}</div>
                        ) : (
                            <select
                                value={companyData.financialDetails.financialYearEnd}
                                onChange={(e) => handleInputChange('financialDetails', 'financialYearEnd', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="December">December</option>
                                <option value="March">March</option>
                                <option value="June">June</option>
                                <option value="September">September</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDigitalPresence = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${companyData.digitalPresence.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {companyData.digitalPresence.website}
                            </a>
                        </div>
                    ) : (
                        <input
                            type="url"
                            value={companyData.digitalPresence.website}
                            onChange={(e) => handleInputChange('digitalPresence', 'website', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="www.company.com"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Domain *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.digitalPresence.domain}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.digitalPresence.domain}
                            onChange={(e) => handleInputChange('digitalPresence', 'domain', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="company.com"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${companyData.digitalPresence.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {companyData.digitalPresence.linkedin}
                            </a>
                        </div>
                    ) : (
                        <input
                            type="url"
                            value={companyData.digitalPresence.linkedin}
                            onChange={(e) => handleInputChange('digitalPresence', 'linkedin', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="linkedin.com/company/company-name"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${companyData.digitalPresence.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {companyData.digitalPresence.twitter}
                            </a>
                        </div>
                    ) : (
                        <input
                            type="url"
                            value={companyData.digitalPresence.twitter}
                            onChange={(e) => handleInputChange('digitalPresence', 'twitter', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="twitter.com/company"
                        />
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Employee Portal URL *
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center gap-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={`https://${companyData.digitalPresence.employeePortalUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {companyData.digitalPresence.employeePortalUrl}
                            </a>
                        </div>
                    ) : (
                        <input
                            type="url"
                            value={companyData.digitalPresence.employeePortalUrl}
                            onChange={(e) => handleInputChange('digitalPresence', 'employeePortalUrl', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="portal.company.com"
                        />
                    )}
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
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {companyData.compliance.registrationCertificate}
                            </div>
                            <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={companyData.compliance.registrationCertificate}
                                onChange={(e) => handleInputChange('compliance', 'registrationCertificate', e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="certificate.pdf"
                            />
                            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
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
                        <div className="p-3 bg-gray-50 rounded-lg border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                {companyData.compliance.taxCertificate}
                            </div>
                            <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={companyData.compliance.taxCertificate}
                                onChange={(e) => handleInputChange('compliance', 'taxCertificate', e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="tax-certificate.pdf"
                            />
                            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
                                <Upload className="w-4 h-4" />
                                <span>Upload</span>
                                <input type="file" className="hidden" />
                            </label>
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Number
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.compliance.licenseNumber}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.compliance.licenseNumber}
                            onChange={(e) => handleInputChange('compliance', 'licenseNumber', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Business license number"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        License Expiry Date
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.compliance.licenseExpiry}</div>
                    ) : (
                        <input
                            type="date"
                            value={companyData.compliance.licenseExpiry}
                            onChange={(e) => handleInputChange('compliance', 'licenseExpiry', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Policy
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.compliance.insurancePolicy}</div>
                    ) : (
                        <input
                            type="text"
                            value={companyData.compliance.insurancePolicy}
                            onChange={(e) => handleInputChange('compliance', 'insurancePolicy', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Insurance policy number"
                        />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Insurance Expiry Date
                    </label>
                    {isViewMode ? (
                        <div className="p-3 bg-gray-50 rounded-lg border">{companyData.compliance.insuranceExpiry}</div>
                    ) : (
                        <input
                            type="date"
                            value={companyData.compliance.insuranceExpiry}
                            onChange={(e) => handleInputChange('compliance', 'insuranceExpiry', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    )}
                </div>
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
        <div className="p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Company Settings</h1>
                            <p className="text-gray-600 mt-2">Manage your company profile and settings</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {isViewMode ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setIsViewMode(false);
                                            setIsEditing(true);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Settings
                                    </button>
                                    <button
                                        onClick={exportToPDF}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export PDF
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
                    </div>

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
                                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer">
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
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600'
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