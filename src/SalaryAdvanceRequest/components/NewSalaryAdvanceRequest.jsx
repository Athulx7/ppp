import { Save, Upload, Wallet } from 'lucide-react';
import React from 'react'
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';

function NewSalaryAdvanceRequest({
    handleSubmit,requestData,handleInputChange,touched,
    errors,eligibility,calculateMonthlyDeduction
}) {
    return (
        <>
            <div className="lg:col-span-2">
                <div className="bg-white rounded-md shadow-sm p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                        New Salary Advance Request
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <CommonInputField
                                    label="Advance Amount (₹) *"
                                    type="number"
                                    value={requestData.advance_amount}
                                    onChange={(e) => handleInputChange('advance_amount', e.target.value)}
                                    placeholder="Enter amount"
                                    error={touched.advance_amount ? errors.advance_amount : ''}
                                    min={eligibility.min_amount}
                                    max={eligibility.max_eligible_amount}
                                    hint={`Min: ₹${eligibility.min_amount} | Max: ₹${eligibility.max_eligible_amount}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Repayment Tenure (Months) *
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {eligibility.tenure_options.map(months => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => handleInputChange('repayment_tenure', months.toString())}
                                            className={`p-2 border rounded-md text-sm font-medium transition-all ${requestData.repayment_tenure === months.toString()
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {months} {months === 1 ? 'Month' : 'Months'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {requestData.advance_amount && requestData.repayment_tenure && (
                            <div className="bg-indigo-50 p-3 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Monthly Deduction:</span>
                                    <span className="text-lg font-semibold text-indigo-700">
                                        ₹{calculateMonthlyDeduction().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                                    <span>Total Amount: ₹{parseInt(requestData.advance_amount).toLocaleString()}</span>
                                    <span>Tenure: {requestData.repayment_tenure} months</span>
                                </div>
                            </div>
                        )}

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CommonInputField
                                label="Purpose of Advance *"
                                type="textarea"
                                rows={3}
                                value={requestData.purpose}
                                onChange={(e) => handleInputChange('purpose', e.target.value)}
                                placeholder="Please provide detailed reason for salary advance..."
                                error={touched.purpose ? errors.purpose : ''}
                                hint="Minimum 10 characters"
                            />
                            <CommonDatePicker
                                label="Preferred Disbursal Date *"
                                value={requestData.preferred_date}
                                onChange={(val) => handleInputChange('preferred_date', val)}
                                placeholder="Select date"
                                error={touched.preferred_date ? errors.preferred_date : ''}
                                minDate={new Date().toISOString().split('T')[0]}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CommonInputField
                                label="Emergency Contact Number *"
                                type="tel"
                                value={requestData.emergency_contact}
                                onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                                placeholder="10-digit mobile number"
                                error={touched.emergency_contact ? errors.emergency_contact : ''}
                            />
                            <CommonInputField
                                label="Relationship *"
                                value={requestData.emergency_relation}
                                onChange={(e) => handleInputChange('emergency_relation', e.target.value)}
                                placeholder="e.g., Spouse, Parent, Sibling"
                                error={touched.emergency_relation ? errors.emergency_relation : ''}
                            />
                        </div>

                        <div>
                            <CommonInputField
                                label="Additional Comments (Optional)"
                                type="textarea"
                                rows={2}
                                value={requestData.comments}
                                onChange={(e) => handleInputChange('comments', e.target.value)}
                                placeholder="Any additional information..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Supporting Documents (Optional)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-indigo-500 transition-colors">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 mb-1">Drag & drop files or click to browse</p>
                                <p className="text-xs text-gray-500">PDF, JPG, PNG up to 5MB</p>
                                <input
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        console.log(e.target.files)
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-md">
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-xs text-gray-600">
                                    I confirm that the information provided is true and correct. I understand that the advance amount will be deducted from my salary in equated monthly installments as per the selected tenure.
                                </span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center gap-2 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewSalaryAdvanceRequest