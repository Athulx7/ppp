import React, { useState, useEffect } from 'react';
import { Building, MapPin, Phone, Globe, CreditCard, Edit2, Save, X, Download, Banknote, } from 'lucide-react';
import BreadCrumb from '../../basicComponents/BreadCrumb';
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import { ApiCall } from '../../library/constants';
import moment from 'moment';
import LoadingSpinner from '../../basicComponents/LoadingSpinner';
import CommonStatusPopUp from '../../basicComponents/CommonStatusPopUp';

function CompanySettingsEntry() {
    const [isLoading, setIsLoading] = useState(false)
    const [statusPopup, setStatusPopup] = useState({
        show: false,
        type: "default",
        title: "",
        message: "",
        autoClose: false
    })

    const [companyData, setCompanyData] = useState({
        basicInfo: {},
        contactDetails: {},
        address: {},
        financialDetails: {},
        digitalPresence: {}
    })
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [isViewMode, setIsViewMode] = useState(true);
    const [logoPreview, setLogoPreview] = useState(null);
    const [newBranch, setNewBranch] = useState('');

    // Dropdown options
    const industryOptions = [
        { label: 'Information Technology', value: 'it' },
        { label: 'Healthcare', value: 'Healthcare' },
        { label: 'Finance', value: 'Finance' },
        { label: 'Manufacturing', value: 'Manufacturing' },
        { label: 'Retail', value: 'Retail' },
        { label: 'Education', value: 'Education' },
        { label: 'Other', value: 'Other' }
    ];

    const companySizeOptions = [
        { label: '1-10 Employees', value: 'emp1_10' },
        { label: '11-50 Employees', value: 'emp11_50' },
        { label: '51-200 Employees', value: 'emp51_200' },
        { label: '200-500 Employees', value: 'emp200_500' },
        { label: '500-1000 Employees', value: 'emp500_1000' },
        { label: '1000+ Employees', value: 'emp_1000' }
    ];

    const currencyOptions = [
        { label: 'USD - US Dollar', value: 'USD' },
        { label: 'EUR - Euro', value: 'EUR' },
        { label: 'GBP - British Pound', value: 'GBP' },
        { label: 'INR - Indian Rupee', value: 'INR' },
        { label: 'JPY - Japanese Yen', value: 'JPY' },
        { label: 'CAD - Canadian Dollar', value: 'CAD' },
        { label: 'AUD - Australian Dollar', value: 'AUD' }
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

    useEffect(() => {
        getSavedcompanyinfo()
    }, []);

    async function getSavedcompanyinfo() {
        setIsLoading(true)
        try {
            const result = await ApiCall('get', 'getcompanyinfo')
            const data = result?.data?.data?.data

            if (!data) return

            setCompanyData({
                basicInfo: {
                    companyName: data.company_name || "",
                    legalName: data.legal_name || "",
                    registrationNumber: data.registration_number || "",
                    foundedDate: data.founded_date ? moment(data.founded_date).format("DD/MM/YYYY") : "",
                    industryType: data.industry_type || "",
                    companySize: data.company_size || "",
                    description: data.company_description || ""
                },
                contactDetails: {
                    primaryEmail: data.primary_email || "",
                    secondaryEmail: data.secondary_email_hr || "",
                    phoneNumber: data.phone_number || "",
                    mobileNumber: data.mobile_number || "",
                    faxNumber: data.fax_number || ""
                },
                address: {
                    headOffice: data.head_office_address || "",
                    city: data.city || "",
                    state: data.state || "",
                    country: data.country || "",
                    postalCode: data.postal_code || "",
                    additionalBranches: []
                },
                financialDetails: {
                    defaultCurrency: data.default_currency || "",
                    taxId: data.tax_id || "",
                    bankName: data.bank_name || "",
                    bankAccountNumber: data.account_number || "",
                    bankBranch: data.bank_branch || "",
                    bankIfscCode: data.ifsc_code || "",
                    swiftCode: data.swift_code || "",
                    financialYearStart: data.fy_start_month || "",
                    financialYearEnd: data.fy_end_month || ""
                },
                digitalPresence: {
                    website: data.website || "",
                    domain: data.company_domain || "",
                    linkedin: data.linkedin_url || "",
                    twitter: data.twitter_url || "",
                    employeePortalUrl: ""
                }
            })

        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    const handleInputChange = (section, field, value) => {
        setCompanyData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const payload = {
                company_name: companyData.basicInfo.companyName,
                legal_name: companyData.basicInfo.legalName,
                registration_number: companyData.basicInfo.registrationNumber,
                founded_date: companyData.basicInfo.foundedDate
                    ? moment(companyData.basicInfo.foundedDate, "DD/MM/YYYY").format("YYYY-MM-DD")
                    : null,

                industry_type: companyData.basicInfo.industryType,
                company_size: companyData.basicInfo.companySize,
                company_description: companyData.basicInfo.description,

                primary_email: companyData.contactDetails.primaryEmail,
                secondary_email_hr: companyData.contactDetails.secondaryEmail,
                phone_number: companyData.contactDetails.phoneNumber,
                mobile_number: companyData.contactDetails.mobileNumber,
                fax_number: companyData.contactDetails.faxNumber,

                head_office_address: companyData.address.headOffice,
                city: companyData.address.city,
                state: companyData.address.state,
                country: companyData.address.country,
                postal_code: companyData.address.postalCode,

                default_currency: companyData.financialDetails.defaultCurrency,
                tax_id: companyData.financialDetails.taxId,
                fy_start_month: companyData.financialDetails.financialYearStart,
                fy_end_month: companyData.financialDetails.financialYearEnd,
                bank_name: companyData.financialDetails.bankName,
                account_number: companyData.financialDetails.bankAccountNumber,
                bank_branch: companyData.financialDetails.bankBranch,
                ifsc_code: companyData.financialDetails.bankIfscCode,
                swift_code: companyData.financialDetails.swiftCode,

                website: companyData.digitalPresence.website,
                company_domain: companyData.digitalPresence.domain,
                linkedin_url: companyData.digitalPresence.linkedin,
                twitter_url: companyData.digitalPresence.twitter
            }

            const res = await ApiCall("POST", "/savecomapnyinfo", payload)
            console.log('company data sae', res)

            if (res?.data?.success) {
                setStatusPopup({
                    show: true,
                    type: "success",
                    title: "Success",
                    message: "Company settings saved successfully!",
                    autoClose: true
                })
                setIsEditing(false);
                setIsViewMode(true);
            } else {
                setStatusPopup({
                    show: true,
                    type: "error",
                    title: "Save Failed",
                    message: `${res.data.data.message}` || "Something went wrong while saving.",
                    autoClose: false
                })
            }
        } catch (error) {
            console.error("Save failed:", error);
            setStatusPopup({
                show: true,
                type: "error",
                title: "Save Failed",
                message: "Something went wrong while saving.",
                autoClose: false
            })

        }
        setIsLoading(false)
    }

    const handleCancel = () => {
        setIsEditing(false);
        setIsViewMode(true);
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
    ];

    const renderBasicInfo = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CommonInputField
                    label="Company Name"
                    value={companyData.basicInfo.companyName}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'companyName', value)}
                    placeholder="Enter company name"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Legal Name"
                    value={companyData.basicInfo.legalName}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'legalName', value)}
                    placeholder="Enter legal name"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Registration Number"
                    value={companyData.basicInfo.registrationNumber}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'registrationNumber', value)}
                    placeholder="GST/Tax registration number"
                    loading={isLoading}
                />

                <CommonDatePicker
                    label="Founded Date"
                    value={companyData.basicInfo.foundedDate}
                    onChange={(value) =>
                        handleInputChange('basicInfo', 'foundedDate', value)
                    }
                    disabled={isViewMode}
                    loading={isLoading}
                />

                <CommonDropDown
                    label="Industry Type"
                    value={companyData.basicInfo.industryType}
                    options={industryOptions}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'industryType', value)}
                    loading={isLoading}
                />

                <CommonDropDown
                    label="Company Size"
                    value={companyData.basicInfo.companySize}
                    options={companySizeOptions}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('basicInfo', 'companySize', value)}
                    placeholder="Select company size"
                    loading={isLoading}
                />
            </div>

            <div>
                {isLoading ? (
                    <div className="mb-2 h-4 w-24 bg-gray-200 rounded animate-pulse"></div> )
                    :
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                </label> }
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
                    onChange={(value) => handleInputChange('contactDetails', 'primaryEmail', value)}
                    placeholder="primary@company.com"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Secondary Email (HR)"
                    type="email"
                    value={companyData.contactDetails.secondaryEmail}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('contactDetails', 'secondaryEmail', value)}
                    placeholder="hr@company.com"
                    loading={isLoading}
                />

                <CommonInputField
                    label="Phone Number"
                    type="tel"
                    value={companyData.contactDetails.phoneNumber}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('contactDetails', 'phoneNumber', value)}
                    placeholder="+1 (555) 123-4567"
                    loading={isLoading}
                    required={true}
                />

                <CommonInputField
                    label="Mobile Number"
                    type="tel"
                    value={companyData.contactDetails.mobileNumber}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('contactDetails', 'mobileNumber', value)}
                    placeholder="+1 (555) 987-6543"
                    loading={isLoading}
                />

                <CommonInputField
                    label="Fax Number"
                    type="tel"
                    value={companyData.contactDetails.faxNumber}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('contactDetails', 'faxNumber', value)}
                    placeholder="+1 (555) 456-7890"
                    loading={isLoading}
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
                    onChange={(value) => handleInputChange('address', 'city', value)}
                    placeholder="City"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="State"
                    value={companyData.address.state}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('address', 'state', value)}
                    placeholder="State/Province"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Country"
                    value={companyData.address.country}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('address', 'country', value)}
                    placeholder="Country"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Postal Code"
                    value={companyData.address.postalCode}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('address', 'postalCode', value)}
                    placeholder="Postal/ZIP code"
                    required={true}
                    loading={isLoading}
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
                    loading={isLoading}
                />

                <CommonInputField
                    label="Tax ID"
                    value={companyData.financialDetails.taxId}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'taxId', value)}
                    placeholder="Tax identification number"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Bank Name"
                    value={companyData.financialDetails.bankName}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'bankName', value)}
                    placeholder="Bank name"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Account Number"
                    value={companyData.financialDetails.bankAccountNumber}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'bankAccountNumber', value)}
                    placeholder="Bank account number"
                    required={true}
                    loading={isLoading}
                />

                <CommonInputField
                    label="Bank Branch"
                    value={companyData.financialDetails.bankBranch}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'bankBranch', value)}
                    placeholder="Bank branch name"
                />

                <CommonInputField
                    label="IFSC Code"
                    value={companyData.financialDetails.bankIfscCode}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'bankIfscCode', value)}
                    placeholder="Bank IFSC code"
                />

                <CommonInputField
                    label="SWIFT Code"
                    value={companyData.financialDetails.swiftCode}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('financialDetails', 'swiftCode', value)}
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
                    onChange={(value) => handleInputChange('digitalPresence', 'website', value)}
                    placeholder="www.company.com"
                />

                <CommonInputField
                    label="Company Domain"
                    value={companyData.digitalPresence.domain}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('digitalPresence', 'domain', value)}
                    placeholder="company.com"
                />

                <CommonInputField
                    label="LinkedIn"
                    type="url"
                    value={companyData.digitalPresence.linkedin}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('digitalPresence', 'linkedin', value)}
                    placeholder="linkedin.com/company/company-name"
                />

                <CommonInputField
                    label="Twitter"
                    type="url"
                    value={companyData.digitalPresence.twitter}
                    disabled={isViewMode}
                    onChange={(value) => handleInputChange('digitalPresence', 'twitter', value)}
                    placeholder="twitter.com/company"
                />

                <div className="md:col-span-2">
                    <CommonInputField
                        label="Employee Portal URL"
                        type="url"
                        value={companyData.digitalPresence.employeePortalUrl}
                        disabled={isViewMode}
                        onChange={(value) => handleInputChange('digitalPresence', 'employeePortalUrl', value)}
                        placeholder="portal.company.com"
                    />
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
            default: return renderBasicInfo();
        }
    };

    return (
        <div className="">
            <div className="mb-5">
                <BreadCrumb
                    items={[{ label: "Company Settings", }]}
                    title="Company Settings"
                    description="Manage your company profile and settings"
                    loading = {isLoading}
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
            </div>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    {isLoading ? (
                <div className="h-10 w-xl m-2 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : 
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
                    </div> }
                </div>

                <div className="p-6 max-h-96 overflow-y-scroll scrollbar">
                    {renderContent()}
                </div>
            </div>

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

                    {/* {!isViewMode && (
                        <button
                            onClick={() => {
                                const shouldReset = window.confirm('Are you sure you want to reset to default settings? This will discard all customizations.');
                                if (shouldReset) {
                                    setLogoPreview(null);
                                    alert('Settings reset to default!');
                                }
                            }}
                            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Reset to Default
                        </button>
                    )} */}
                </div>
            </div>
            {isLoading && <LoadingSpinner />}
            <CommonStatusPopUp
                isOpen={statusPopup.show}
                type={statusPopup.type}
                title={statusPopup.title}
                body={statusPopup.message}
                autoClose={statusPopup.autoClose}
                onClose={() =>
                    setStatusPopup(prev => ({ ...prev, show: false }))
                }
            />

        </div>
    );
}

export default CompanySettingsEntry;