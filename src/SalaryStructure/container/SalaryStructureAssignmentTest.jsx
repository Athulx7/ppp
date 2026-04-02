import React, { useState, useEffect } from 'react';
import {
    Save, X, User, Award, Calendar, FileText,
    CheckCircle, AlertCircle, Loader2, Link2,
    Building2, Clock, BadgeCheck
} from 'lucide-react';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import { ApiCall } from '../../library/constants';

function SalaryStructureAssignment({ isOpen, onClose, assignmentId }) {
    const isEditMode = !!assignmentId;

    const BLANK = {
        assignmentType: 'designation',
        targetId: '',
        targetName: '',
        structureId: '',
        structureName: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        endDate: '',
        isPermanent: true,
        reason: '',
        status: 'active'
    };

    const [formData, setFormData] = useState({ ...BLANK });
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [structures, setStructures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedTarget, setSelectedTarget] = useState(null);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        fetchDropdowns()
    }, [])

    async function fetchDropdowns() {
        try {
            setLoading(true)

            const res = await ApiCall("get", "/salarystructure/assignmentDropdowns")

            if (res?.data?.success) {
                const data = res.data.data

                setDesignations(data.designations || [])
                setEmployees(data.employees || [])
                setStructures(data.structures || [])
            }

        } catch (err) {
            console.error("Dropdown fetch error:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setFormData({ ...BLANK });
            setSelectedTarget(null);
            setSelectedStructure(null);
            setErrors({});
            setShowSuccess(false);
            return;
        }
        if (isEditMode && assignmentId) fetchAssignmentData(assignmentId);
    }, [isOpen, isEditMode, assignmentId]);

    const fetchAssignmentData = (id) => {
        setLoading(true);
        setTimeout(() => {
            const sample = {
                id: 1, type: 'employee', targetId: 101, targetName: 'John Smith',
                employeeCode: 'EMP001', structureId: 1,
                structureName: 'Junior Software Engineer',
                effectiveDate: '2023-06-15', endDate: '', isPermanent: true,
                reason: 'Initial assignment on joining', status: 'active'
            };
            setFormData({
                assignmentType: sample.type,
                targetId: sample.targetId,
                targetName: sample.targetName,
                structureId: sample.structureId,
                structureName: sample.structureName,
                effectiveDate: sample.effectiveDate,
                endDate: sample.endDate || '',
                isPermanent: !sample.endDate,
                reason: sample.reason || '',
                status: sample.status
            });
            setSelectedTarget({ id: sample.targetId, name: sample.targetName, employeeCode: sample.employeeCode });
            setSelectedStructure({ id: sample.structureId, name: sample.structureName });
            setLoading(false);
        }, 500);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
        if (field === 'assignmentType') {
            setFormData(prev => ({ ...prev, assignmentType: value, targetId: '', targetName: '' }));
            setSelectedTarget(null);
        }
    };

    const handleTargetSelect = (id) => {
        const list = formData.assignmentType === 'designation' ? designations : employees;
        const found = list.find(i => i.value === id);
        if (!found) return;
        setSelectedTarget(found);
        setFormData(prev => ({ ...prev, targetId: found.value, targetName: found.label }));
        if (errors.targetId) setErrors(prev => ({ ...prev, targetId: null }));
    };

    const handleStructureSelect = (id) => {
        const found = structures.find(s => s.value === id || s.value === Number(id));
        if (!found) return;
        setSelectedStructure(found);
        setFormData(prev => ({ ...prev, structureId: found.value, structureName: found.label }));
        if (errors.structureId) setErrors(prev => ({ ...prev, structureId: null }));
    };

    const validate = () => {
        const e = {};
        if (!formData.targetId) e.targetId = 'Please select a target';
        if (!formData.structureId) e.structureId = 'Please select a salary structure';
        if (!formData.effectiveDate) e.effectiveDate = 'Effective date is required';
        if (!formData.isPermanent && !formData.endDate)
            e.endDate = 'End date required for temporary assignments';
        if (formData.endDate && formData.endDate < formData.effectiveDate)
            e.endDate = 'End date cannot be before effective date';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        if (!validate()) return
        try {
            setLoading(true)
            const payload = {
                type: formData.assignmentType,
                targetId: formData.targetId,
                structureId: formData.structureId,
                effectiveDate: formData.effectiveDate,
                endDate: formData.isPermanent ? null : formData.endDate,
                reason: formData.reason,
                status: formData.status
            }
            console.log('save payload',payload)
            const res = await ApiCall("post", "/salarystructure/saveassign", payload)
            console.log('save api',res)

            if (res?.data?.success) {
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    onClose()
                }, 1500)
            }

        } catch (err) {
            console.error(err)
            setErrors(prev => ({
                ...prev,
                submit: err?.response?.data?.message || "Failed to save"
            }))
        } finally {
            setLoading(false)
        }
    }

    const targetOptions = formData.assignmentType === 'designation'
        ? designations.map(d => ({ value: d.value, label: d.label }))
        : employees.map(e => ({ value: e.value, label: e.label }));

    const structureOptions = structures.map(s => ({ value: s.value, label: s.label }));

    const canPreview = selectedTarget && selectedStructure;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) onClose() }}>

            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-md shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">

                <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-5">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-md flex items-center justify-center">
                                <Link2 className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg leading-tight">
                                    {isEditMode ? 'Edit Assignment' : 'Assign Salary Structure'}
                                </h2>
                                <p className="text-indigo-200 text-xs mt-0.5">
                                    {isEditMode
                                        ? 'Modify salary structure assignment details'
                                        : 'Link a salary structure to a designation or employee'}
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={onClose}
                            className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {showSuccess && (
                    <div className="flex-shrink-0 flex items-center gap-3 px-6 py-3 bg-emerald-50 border-b border-emerald-200">
                        <CheckCircle size={18} className="text-emerald-500 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-emerald-800">Assignment saved successfully!</p>
                            <p className="text-xs text-emerald-600">Closing in a moment…</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar">
                    <div className="p-6 space-y-6">

                        <section>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Assignment Type</p>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'designation', icon: Building2, label: 'Designation', sub: 'All employees with this role' },
                                    { value: 'employee', icon: User, label: 'Individual Employee', sub: 'A specific person' },
                                ].map(opt => {
                                    const Icon = opt.icon;
                                    const active = formData.assignmentType === opt.value;
                                    return (
                                        <button key={opt.value} type="button"
                                            onClick={() => handleChange('assignmentType', opt.value)}
                                            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all
                                                ${active
                                                    ? 'border-indigo-500 bg-indigo-50'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
                                                ${active ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                                                <Icon size={18} className={active ? 'text-indigo-600' : 'text-gray-500'} />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${active ? 'text-indigo-700' : 'text-gray-800'}`}>
                                                    {opt.label}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
                                            </div>
                                            {active && (
                                                <BadgeCheck size={16} className="text-indigo-500 ml-auto flex-shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <CommonDropDown
                                label={formData.assignmentType === 'designation' ? 'Designation' : 'Employee'}
                                options={targetOptions}
                                value={formData.targetId}
                                onChange={handleTargetSelect}
                                placeholder={`Choose a ${formData.assignmentType === 'designation' ? 'designation' : 'employee'}…`}
                                required
                            />
                            {errors.targetId && <ErrorMsg msg={errors.targetId} />}

                            {selectedTarget && formData.assignmentType === 'employee' && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Chip label="Code" value={selectedTarget.value} />
                                    <Chip label="Role" value={selectedTarget.designation} />
                                    <Chip label="Dept" value={selectedTarget.department} />
                                </div>
                            )}

                            {selectedTarget && formData.assignmentType === 'designation' && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Chip label="Code" value={selectedTarget.value} />
                                </div>
                            )}
                        </section>

                        <section>
                            <CommonDropDown
                                label="Salary Structure"
                                options={structureOptions}
                                value={formData.structureId}
                                onChange={handleStructureSelect}
                                placeholder="Choose a salary structure…"
                                required
                            />
                            {errors.structureId && <ErrorMsg msg={errors.structureId} />}

                            {selectedStructure && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Chip label="Code" value={structures.find(s => s.value === selectedStructure.value)?.structure_code} />
                                </div>
                            )}
                        </section>

                        <section>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Duration</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <CommonDatePicker
                                    label="Effective Date"
                                    value={formData.effectiveDate}
                                    onChange={e => handleChange('effectiveDate', e)}
                                    required
                                    errorMessage={errors.effectiveDate && <ErrorMsg msg={errors.effectiveDate} />}
                                />

                                <div className="flex flex-col justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer mt-6 sm:mt-0">
                                        <input type="checkbox"
                                            checked={formData.isPermanent}
                                            onChange={e => handleChange('isPermanent', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-sm text-gray-700 font-medium">Permanent (no end date)</span>
                                    </label>

                                    {!formData.isPermanent && (
                                        <CommonDatePicker
                                            label="End Date"
                                            value={formData.endDate}
                                            onChange={e => handleChange('endDate', e)}
                                            required
                                            errorMessage={errors.endDate && <ErrorMsg msg={errors.endDate} />}
                                        />
                                    )}
                                </div>
                            </div>
                        </section>

                        <section>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Reason</p>
                            <textarea
                                value={formData.reason}
                                onChange={e => handleChange('reason', e.target.value)}
                                rows={3}
                                placeholder="e.g. New joining, Promotion, Transfer, Annual revision…"
                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm
                                           focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none
                                           placeholder:text-gray-400 transition-colors"
                            />
                        </section>

                        {isEditMode && (
                            <section>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</p>
                                <CommonDropDown
                                    label="Status"
                                    options={[
                                        { value: 'active', label: 'Active' },
                                        { value: 'inactive', label: 'Inactive' },
                                    ]}
                                    value={formData.status}
                                    onChange={v => handleChange('status', v)}
                                />
                            </section>
                        )}

                        {canPreview && (
                            <div className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4">
                                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                    <BadgeCheck size={12} /> Assignment Summary
                                </p>
                                <div className="grid grid-cols-2 gap-3">
                                    <SummaryRow label="Target" value={formData.targetName} />
                                    <SummaryRow label="Structure" value={formData.structureName} />
                                    <SummaryRow label="Effective From"
                                        value={formData.effectiveDate
                                            ? new Date(formData.effectiveDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                            : '—'} />
                                    <SummaryRow label="Duration"
                                        value={formData.isPermanent ? 'Permanent' : (formData.endDate || '—')} />
                                </div>
                            </div>
                        )}

                        {errors.submit && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                <AlertCircle size={15} className="flex-shrink-0" />
                                {errors.submit}
                            </div>
                        )}
                    </div>

                    <div className="flex-shrink-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl sticky bottom-0">
                        <button type="button" onClick={onClose} disabled={loading}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 border border-gray-300
                                       rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white
                                       rounded-md hover:bg-indigo-700 active:bg-indigo-800 transition-colors
                                       shadow-sm flex items-center gap-2 min-w-[140px] justify-center
                                       disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading
                                ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                                : <><Save size={15} /> {isEditMode ? 'Update Assignment' : 'Save Assignment'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Chip({ label, value, highlight }) {
    if (!value) return null;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border
            ${highlight
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
            <span className="text-gray-400 font-normal">{label}:</span> {value}
        </span>
    );
}

function SummaryRow({ label, value }) {
    return (
        <div>
            <p className="text-xs text-indigo-400 font-medium">{label}</p>
            <p className="text-sm font-semibold text-indigo-800 mt-0.5">{value || '—'}</p>
        </div>
    );
}

function ErrorMsg({ msg }) {
    return (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
            <AlertCircle size={11} /> {msg}
        </p>
    );
}

export default SalaryStructureAssignment;