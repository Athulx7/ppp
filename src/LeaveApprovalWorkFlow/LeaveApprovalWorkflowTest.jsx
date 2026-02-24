import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Users, Briefcase, User, Award,
    Calendar, Plus, Trash2, Edit, Copy, Check, AlertCircle,
    ChevronRight, ChevronDown, Shield, Settings, GitBranch,
    Layers, Clock, Filter, Search, Download, Upload
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';
import CommonTable from '../basicComponents/commonTable';

function LeaveApprovalWorkflow() {
    const navigate = useNavigate();
    const [leaveMaster, setLeaveMaster] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [approvalRules, setApprovalRules] = useState([]);
    const [filteredRules, setFilteredRules] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLeaveFilter, setSelectedLeaveFilter] = useState('');

    // New rule form state
    const [newRule, setNewRule] = useState({
        leave_code: '',
        rule_name: '',
        min_days: '',
        max_days: '',
        approver_type: 'role', // 'role', 'designation', 'specific_person'
        approver_value: '',
        alternate_approver: '',
        escalation_days: '',
        is_active: true,
        priority: 1
    });

    // Dummy Leave Master Data
    useEffect(() => {
        const dummyLeaveMaster = [
            {
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                category: 'Casual',
                accrual_type: 'Monthly',
                max_per_year: 12,
                carry_forward: true,
                is_active: true,
                color: 'bg-blue-100 text-blue-800'
            },
            {
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                category: 'Sick',
                accrual_type: 'Monthly',
                max_per_year: 10,
                carry_forward: false,
                is_active: true,
                color: 'bg-green-100 text-green-800'
            },
            {
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                category: 'Earned',
                accrual_type: 'Yearly',
                max_per_year: 18,
                carry_forward: true,
                is_active: true,
                color: 'bg-purple-100 text-purple-800'
            },
            {
                leave_code: 'L004',
                leave_name: 'Maternity Leave',
                category: 'Maternity',
                accrual_type: 'One-time',
                max_per_year: 180,
                carry_forward: false,
                is_active: true,
                color: 'bg-pink-100 text-pink-800'
            },
            {
                leave_code: 'L005',
                leave_name: 'Paternity Leave',
                category: 'Paternity',
                accrual_type: 'One-time',
                max_per_year: 15,
                carry_forward: false,
                is_active: true,
                color: 'bg-indigo-100 text-indigo-800'
            },
            {
                leave_code: 'L006',
                leave_name: 'Bereavement Leave',
                category: 'Bereavement',
                accrual_type: 'Per Occasion',
                max_per_year: 7,
                carry_forward: false,
                is_active: true,
                color: 'bg-gray-100 text-gray-800'
            }
        ];
        setLeaveMaster(dummyLeaveMaster);
    }, []);

    // Dummy Approval Rules Data
    useEffect(() => {
        const dummyRules = [
            {
                id: 1,
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                rule_name: '1-3 Days Approval',
                min_days: 1,
                max_days: 3,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 2,
                is_active: true,
                priority: 1
            },
            {
                id: 2,
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                rule_name: '4-7 Days Approval',
                min_days: 4,
                max_days: 7,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 3,
                is_active: true,
                priority: 2
            },
            {
                id: 3,
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                rule_name: '8+ Days Approval',
                min_days: 8,
                max_days: 12,
                approver_type: 'role',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 4,
                is_active: true,
                priority: 3
            },
            {
                id: 4,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: '1-2 Days Approval',
                min_days: 1,
                max_days: 2,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 1,
                is_active: true,
                priority: 1
            },
            {
                id: 5,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: '3-5 Days Approval',
                min_days: 3,
                max_days: 5,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 2,
                is_active: true,
                priority: 2
            },
            {
                id: 6,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: '6+ Days Approval',
                min_days: 6,
                max_days: 10,
                approver_type: 'designation',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 3,
                is_active: true,
                priority: 3
            },
            {
                id: 7,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: '1-5 Days Approval',
                min_days: 1,
                max_days: 5,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 2,
                is_active: true,
                priority: 1
            },
            {
                id: 8,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: '6-10 Days Approval',
                min_days: 6,
                max_days: 10,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 3,
                is_active: true,
                priority: 2
            },
            {
                id: 9,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: '11-18 Days Approval',
                min_days: 11,
                max_days: 18,
                approver_type: 'designation',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 4,
                is_active: true,
                priority: 3
            }
        ];
        setApprovalRules(dummyRules);
        setFilteredRules(dummyRules);
    }, []);

    // Filter rules based on search and leave filter
    useEffect(() => {
        let filtered = approvalRules;

        if (selectedLeaveFilter) {
            filtered = filtered.filter(rule => rule.leave_code === selectedLeaveFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(rule =>
                rule.leave_name.toLowerCase().includes(query) ||
                rule.rule_name.toLowerCase().includes(query) ||
                rule.approver_value.toLowerCase().includes(query)
            );
        }

        setFilteredRules(filtered);
    }, [approvalRules, selectedLeaveFilter, searchQuery]);

    const handleAddRule = () => {
        if (!newRule.leave_code || !newRule.rule_name || !newRule.min_days || !newRule.max_days || !newRule.approver_value) {
            alert('Please fill all required fields');
            return;
        }

        const leave = leaveMaster.find(l => l.leave_code === newRule.leave_code);

        const rule = {
            id: editingRule ? editingRule.id : Date.now(),
            ...newRule,
            leave_name: leave.leave_name,
            min_days: parseInt(newRule.min_days),
            max_days: parseInt(newRule.max_days),
            escalation_days: newRule.escalation_days ? parseInt(newRule.escalation_days) : null,
            priority: parseInt(newRule.priority)
        };

        if (editingRule) {
            setApprovalRules(approvalRules.map(r => r.id === editingRule.id ? rule : r));
        } else {
            setApprovalRules([...approvalRules, rule]);
        }

        setShowAddModal(false);
        setEditingRule(null);
        setNewRule({
            leave_code: '',
            rule_name: '',
            min_days: '',
            max_days: '',
            approver_type: 'role',
            approver_value: '',
            alternate_approver: '',
            escalation_days: '',
            is_active: true,
            priority: 1
        });
    };

    const handleEditRule = (rule) => {
        setEditingRule(rule);
        setNewRule({
            leave_code: rule.leave_code,
            rule_name: rule.rule_name,
            min_days: rule.min_days,
            max_days: rule.max_days,
            approver_type: rule.approver_type,
            approver_value: rule.approver_value,
            alternate_approver: rule.alternate_approver || '',
            escalation_days: rule.escalation_days || '',
            is_active: rule.is_active,
            priority: rule.priority
        });
        setShowAddModal(true);
    };

    const handleDeleteRule = (id) => {
        if (window.confirm('Are you sure you want to delete this approval rule?')) {
            setApprovalRules(approvalRules.filter(rule => rule.id !== id));
        }
    };

    const handleToggleStatus = (id) => {
        setApprovalRules(approvalRules.map(rule =>
            rule.id === id ? { ...rule, is_active: !rule.is_active } : rule
        ));
    };

    const handleCopyRule = (rule) => {
        const newRule = {
            ...rule,
            id: Date.now(),
            rule_name: `${rule.rule_name} (Copy)`
        };
        setApprovalRules([...approvalRules, newRule]);
    };

    // Approval Rules Table Columns
    const ruleColumns = [
        {
            header: "Actions",
            cell: row => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleEditRule(row)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit"
                    >
                        <Edit className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => handleCopyRule(row)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded-lg"
                        title="Copy"
                    >
                        <Copy className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => handleDeleteRule(row.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(row.id)}
                        className={`p-1 rounded-lg ${row.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        title={row.is_active ? 'Deactivate' : 'Activate'}
                    >
                        {row.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    </button>
                </div>
            ),
            width: "120px"
        },
        {
            header: "Leave Type",
            cell: row => {
                const leave = leaveMaster.find(l => l.leave_code === row.leave_code);
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave?.color || 'bg-gray-100'}`}>
                        {row.leave_name}
                    </span>
                );
            }
        },
        {
            header: "Rule Name",
            accessor: "rule_name"
        },
        {
            header: "Day Range",
            cell: row => `${row.min_days} - ${row.max_days} days`
        },
        {
            header: "Approver Type",
            accessor: "approver_type",
            cell: row => {
                const types = {
                    'role': 'Role Based',
                    'designation': 'Designation Based',
                    'specific_person': 'Specific Person'
                };
                return types[row.approver_type] || row.approver_type;
            }
        },
        {
            header: "Primary Approver",
            accessor: "approver_value"
        },
        {
            header: "Alternate Approver",
            accessor: "alternate_approver",
            cell: row => row.alternate_approver || '—'
        },
        {
            header: "Escalation (Days)",
            accessor: "escalation_days",
            cell: row => row.escalation_days ? `${row.escalation_days} days` : '—'
        },
        {
            header: "Priority",
            accessor: "priority"
        },
        {
            header: "Status",
            accessor: "is_active",
            cell: row => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {row.is_active ? 'Active' : 'Inactive'}
                </span>
            )
        }
    ];

    // Available approver options (dummy)
    const approverRoles = [
        { value: 'Team Lead', label: 'Team Lead' },
        { value: 'Department Head', label: 'Department Head' },
        { value: 'HR Manager', label: 'HR Manager' },
        { value: 'HR Executive', label: 'HR Executive' },
        { value: 'Admin', label: 'Administrator' },
        { value: 'Payroll Manager', label: 'Payroll Manager' },
        { value: 'Finance Manager', label: 'Finance Manager' }
    ];

    const approverDesignations = [
        { value: 'Tech Lead', label: 'Tech Lead' },
        { value: 'HR Manager', label: 'HR Manager' },
        { value: 'Sales Manager', label: 'Sales Manager' },
        { value: 'Accountant', label: 'Accountant' },
        { value: 'Senior Software Engineer', label: 'Senior Software Engineer' }
    ];

    const approverSpecific = [
        { value: 'EMP001', label: 'John Doe (HR Manager)' },
        { value: 'EMP003', label: 'Michael Chen (Tech Lead)' },
        { value: 'EMP004', label: 'Sarah Johnson (Sales Manager)' }
    ];

    const getApproverOptions = () => {
        switch (newRule.approver_type) {
            case 'role':
                return approverRoles;
            case 'designation':
                return approverDesignations;
            case 'specific_person':
                return approverSpecific;
            default:
                return [];
        }
    };

    return (
        <div className="p-3">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Leave Approval Workflow' }
                ]}
                title="Leave Approval Workflow"
                description="Configure approval hierarchy for leave requests based on leave type and duration"
            />

            {/* Header with back button */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Settings
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div>
                    <h3 className="font-medium text-indigo-900">Approval Workflow Configuration</h3>
                    <p className="text-sm text-indigo-700 mt-1">
                        Define who approves leave requests based on leave type and duration.
                        You can set different approvers for different day ranges and configure escalation rules.
                        Rules are evaluated in order of priority (lower number = higher priority).
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <label className="block mb-1 text-sm font-medium text-gray-700">
                            Search
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by rule name, leave type..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <CommonDropDown
                        label="Filter by Leave Type"
                        value={selectedLeaveFilter}
                        onChange={setSelectedLeaveFilter}
                        options={[
                            { label: 'All Leave Types', value: '' },
                            ...leaveMaster.map(l => ({
                                label: l.leave_name,
                                value: l.leave_code
                            }))
                        ]}
                        placeholder="Select leave type"
                    />

                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => {
                                setSelectedLeaveFilter('');
                                setSearchQuery('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Clear Filters
                        </button>
                        <button
                            onClick={() => {
                                setEditingRule(null);
                                setNewRule({
                                    leave_code: '',
                                    rule_name: '',
                                    min_days: '',
                                    max_days: '',
                                    approver_type: 'role',
                                    approver_value: '',
                                    alternate_approver: '',
                                    escalation_days: '',
                                    is_active: true,
                                    priority: approvalRules.length + 1
                                });
                                setShowAddModal(true);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Approval Rule
                        </button>
                    </div>
                </div>
            </div>

            {/* Rules Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                        <h2 className="font-semibold text-gray-900">Approval Rules</h2>
                        <p className="text-sm text-gray-500">
                            Showing {filteredRules.length} of {approvalRules.length} rules
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-1">
                            <Upload className="w-4 h-4" />
                            Import
                        </button>
                    </div>
                </div>

                <CommonTable
                    columns={ruleColumns}
                    data={filteredRules}
                    itemsPerPage={10}
                    showSearch={false}
                    showPagination={true}
                />
            </div>

            {/* Add/Edit Rule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingRule ? 'Edit Approval Rule' : 'Add New Approval Rule'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingRule(null);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Leave Type Selection */}
                            <CommonDropDown
                                label="Select Leave Type *"
                                value={newRule.leave_code}
                                onChange={(val) => setNewRule({ ...newRule, leave_code: val })}
                                options={leaveMaster.map(l => ({
                                    label: l.leave_name,
                                    value: l.leave_code,
                                    description: `${l.category} - ${l.max_per_year} days/year`
                                }))}
                                placeholder="Choose leave type"
                            />

                            {/* Rule Name */}
                            <CommonInputField
                                label="Rule Name *"
                                value={newRule.rule_name}
                                onChange={(e) => setNewRule({ ...newRule, rule_name: e.target.value })}
                                placeholder="e.g., 1-3 Days Approval"
                            />

                            {/* Day Range */}
                            <div className="grid grid-cols-2 gap-3">
                                <CommonInputField
                                    label="Min Days *"
                                    type="number"
                                    value={newRule.min_days}
                                    onChange={(e) => setNewRule({ ...newRule, min_days: e.target.value })}
                                    placeholder="1"
                                    min="0"
                                    max="365"
                                />
                                <CommonInputField
                                    label="Max Days *"
                                    type="number"
                                    value={newRule.max_days}
                                    onChange={(e) => setNewRule({ ...newRule, max_days: e.target.value })}
                                    placeholder="3"
                                    min="0"
                                    max="365"
                                />
                            </div>

                            {/* Priority */}
                            <CommonInputField
                                label="Priority (Lower number = Higher priority) *"
                                type="number"
                                value={newRule.priority}
                                onChange={(e) => setNewRule({ ...newRule, priority: e.target.value })}
                                placeholder="1"
                                min="1"
                                max="100"
                            />

                            {/* Approver Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Approver Type *
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    <label className={`p-3 border rounded-lg cursor-pointer ${newRule.approver_type === 'role' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="approver_type"
                                            value="role"
                                            checked={newRule.approver_type === 'role'}
                                            onChange={(e) => setNewRule({ ...newRule, approver_type: e.target.value, approver_value: '' })}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Shield className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-sm">Role Based</div>
                                        </div>
                                    </label>

                                    <label className={`p-3 border rounded-lg cursor-pointer ${newRule.approver_type === 'designation' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="approver_type"
                                            value="designation"
                                            checked={newRule.approver_type === 'designation'}
                                            onChange={(e) => setNewRule({ ...newRule, approver_type: e.target.value, approver_value: '' })}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <Briefcase className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-sm">Designation</div>
                                        </div>
                                    </label>

                                    <label className={`p-3 border rounded-lg cursor-pointer ${newRule.approver_type === 'specific_person' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="approver_type"
                                            value="specific_person"
                                            checked={newRule.approver_type === 'specific_person'}
                                            onChange={(e) => setNewRule({ ...newRule, approver_type: e.target.value, approver_value: '' })}
                                            className="hidden"
                                        />
                                        <div className="text-center">
                                            <User className="w-5 h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-sm">Specific Person</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Primary Approver */}
                            <CommonDropDown
                                label="Primary Approver *"
                                value={newRule.approver_value}
                                onChange={(val) => setNewRule({ ...newRule, approver_value: val })}
                                options={getApproverOptions()}
                                placeholder={`Select ${newRule.approver_type}`}
                            />

                            {/* Alternate Approver */}
                            <CommonDropDown
                                label="Alternate Approver"
                                value={newRule.alternate_approver}
                                onChange={(val) => setNewRule({ ...newRule, alternate_approver: val })}
                                options={[
                                    { label: 'None', value: '' },
                                    ...getApproverOptions()
                                ]}
                                placeholder="Select alternate approver"
                            />

                            {/* Escalation Days */}
                            <CommonInputField
                                label="Escalate After (Days)"
                                type="number"
                                value={newRule.escalation_days}
                                onChange={(e) => setNewRule({ ...newRule, escalation_days: e.target.value })}
                                placeholder="e.g., 2"
                                hint="If no action taken in X days, escalate to alternate approver"
                                min="0"
                                max="30"
                            />

                            {/* Status */}
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newRule.is_active}
                                        onChange={(e) => setNewRule({ ...newRule, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">Active</span>
                                </label>
                            </div>

                            {/* Preview Card */}
                            {newRule.leave_code && newRule.min_days && newRule.max_days && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Rule Preview</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="text-gray-600">Leave Type:</span>
                                        <span className="font-medium">
                                            {leaveMaster.find(l => l.leave_code === newRule.leave_code)?.leave_name}
                                        </span>
                                        <span className="text-gray-600">Duration:</span>
                                        <span className="font-medium">{newRule.min_days} - {newRule.max_days} days</span>
                                        <span className="text-gray-600">Approver:</span>
                                        <span className="font-medium">{newRule.approver_value || 'Not selected'}</span>
                                        {newRule.escalation_days && (
                                            <>
                                                <span className="text-gray-600">Escalation:</span>
                                                <span className="font-medium">After {newRule.escalation_days} days</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingRule(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRule}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                {editingRule ? 'Update Rule' : 'Add Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Workflow Visualization */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-indigo-600" />
                    Approval Flow Preview
                </h3>
                <div className="space-y-4">
                    {leaveMaster.slice(0, 3).map(leave => {
                        const leaveRules = approvalRules
                            .filter(r => r.leave_code === leave.leave_code && r.is_active)
                            .sort((a, b) => a.priority - b.priority);

                        if (leaveRules.length === 0) return null;

                        return (
                            <div key={leave.leave_code} className="border rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.color}`}>
                                        {leave.leave_name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {leaveRules.map((rule, index) => (
                                        <React.Fragment key={rule.id}>
                                            <div className="bg-indigo-50 rounded-lg p-3 text-sm">
                                                <div className="font-medium text-indigo-700">{rule.min_days}-{rule.max_days} days</div>
                                                <div className="text-xs text-gray-600 mt-1">→ {rule.approver_value}</div>
                                                {rule.alternate_approver && (
                                                    <div className="text-xs text-gray-500">Alt: {rule.alternate_approver}</div>
                                                )}
                                            </div>
                                            {index < leaveRules.length - 1 && (
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default LeaveApprovalWorkflow;