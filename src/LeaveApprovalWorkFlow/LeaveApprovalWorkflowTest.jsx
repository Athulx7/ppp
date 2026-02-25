import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Save, X, ArrowLeft, Users, Briefcase, User, Award,
    Calendar, Plus, Trash2, Edit, Copy, Check, AlertCircle,
    ChevronRight, ChevronDown, Shield, Settings, GitBranch,
    Layers, Clock, Filter, Search, Download, Upload,
    Eye, EyeOff, MoveUp, MoveDown, Info, HelpCircle,
    CheckCircle, XCircle, AlertTriangle, Clock3, UserCheck
} from 'lucide-react';
import Breadcrumb from '../basicComponents/BreadCrumb';
import CommonDropDown from '../basicComponents/CommonDropDown';
import CommonInputField from '../basicComponents/CommonInputField';

function LeaveApprovalWorkflow() {
    const navigate = useNavigate();
    const [leaveMaster, setLeaveMaster] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [approvalRules, setApprovalRules] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLeaveFilter, setSelectedLeaveFilter] = useState('');
    const [expandedSections, setExpandedSections] = useState({});
    const [showInactive, setShowInactive] = useState(false);

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
        requires_attachment: false,
        requires_approval_note: false,
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
                color: 'bg-blue-100 text-blue-800',
                icon: '🌴'
            },
            {
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                category: 'Sick',
                accrual_type: 'Monthly',
                max_per_year: 10,
                carry_forward: false,
                is_active: true,
                color: 'bg-green-100 text-green-800',
                icon: '🤒'
            },
            {
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                category: 'Earned',
                accrual_type: 'Yearly',
                max_per_year: 18,
                carry_forward: true,
                is_active: true,
                color: 'bg-purple-100 text-purple-800',
                icon: '🏖️'
            },
            {
                leave_code: 'L004',
                leave_name: 'Maternity Leave',
                category: 'Maternity',
                accrual_type: 'One-time',
                max_per_year: 180,
                carry_forward: false,
                is_active: true,
                color: 'bg-pink-100 text-pink-800',
                icon: '👶'
            },
            {
                leave_code: 'L005',
                leave_name: 'Paternity Leave',
                category: 'Paternity',
                accrual_type: 'One-time',
                max_per_year: 15,
                carry_forward: false,
                is_active: true,
                color: 'bg-indigo-100 text-indigo-800',
                icon: '👨‍👦'
            },
            {
                leave_code: 'L006',
                leave_name: 'Bereavement Leave',
                category: 'Bereavement',
                accrual_type: 'Per Occasion',
                max_per_year: 7,
                carry_forward: false,
                is_active: true,
                color: 'bg-gray-100 text-gray-800',
                icon: '💔'
            },
            {
                leave_code: 'L007',
                leave_name: 'Compensatory Off',
                category: 'Compensatory',
                accrual_type: 'Per Occasion',
                max_per_year: 12,
                carry_forward: true,
                is_active: true,
                color: 'bg-orange-100 text-orange-800',
                icon: '⏰'
            },
            {
                leave_code: 'L008',
                leave_name: 'Marriage Leave',
                category: 'Special',
                accrual_type: 'One-time',
                max_per_year: 5,
                carry_forward: false,
                is_active: true,
                color: 'bg-amber-100 text-amber-800',
                icon: '💒'
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
                rule_name: 'Short Leave',
                description: 'For short duration casual leaves',
                min_days: 1,
                max_days: 3,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 2,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 1,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 45
            },
            {
                id: 2,
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                rule_name: 'Medium Leave',
                description: 'Extended casual leave',
                min_days: 4,
                max_days: 7,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 3,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 2,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 28
            },
            {
                id: 3,
                leave_code: 'L001',
                leave_name: 'Casual Leave',
                rule_name: 'Long Leave',
                description: 'Extended leave requiring higher approval',
                min_days: 8,
                max_days: 12,
                approver_type: 'role',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 4,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 3,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 12
            },
            {
                id: 4,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: 'Short Sick Leave',
                description: 'Brief sick leave without medical certificate',
                min_days: 1,
                max_days: 2,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 1,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 1,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 67
            },
            {
                id: 5,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: 'Extended Sick Leave',
                description: 'Sick leave requiring medical certificate',
                min_days: 3,
                max_days: 5,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 2,
                requires_attachment: true,
                requires_approval_note: true,
                is_active: true,
                priority: 2,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 34
            },
            {
                id: 6,
                leave_code: 'L002',
                leave_name: 'Sick Leave',
                rule_name: 'Long Sick Leave',
                description: 'Extended medical leave',
                min_days: 6,
                max_days: 10,
                approver_type: 'designation',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 3,
                requires_attachment: true,
                requires_approval_note: true,
                is_active: true,
                priority: 3,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 8
            },
            {
                id: 7,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: 'Standard Earned Leave',
                description: 'Regular earned leave',
                min_days: 1,
                max_days: 5,
                approver_type: 'role',
                approver_value: 'Team Lead',
                alternate_approver: 'Department Head',
                escalation_days: 2,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 1,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 52
            },
            {
                id: 8,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: 'Extended Earned Leave',
                description: 'Long earned leave',
                min_days: 6,
                max_days: 10,
                approver_type: 'role',
                approver_value: 'Department Head',
                alternate_approver: 'HR Manager',
                escalation_days: 3,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 2,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 31
            },
            {
                id: 9,
                leave_code: 'L003',
                leave_name: 'Earned Leave',
                rule_name: 'Maximum Earned Leave',
                description: 'Maximum allowed earned leave',
                min_days: 11,
                max_days: 18,
                approver_type: 'designation',
                approver_value: 'HR Manager',
                alternate_approver: 'Admin',
                escalation_days: 4,
                requires_attachment: false,
                requires_approval_note: true,
                is_active: true,
                priority: 3,
                created_by: 'Admin',
                created_on: '2024-01-15',
                approval_count: 15
            }
        ];
        setApprovalRules(dummyRules);
        
        // Initialize expanded sections
        const initialExpanded = {};
        dummyRules.forEach(rule => {
            if (!initialExpanded[rule.leave_code]) {
                initialExpanded[rule.leave_code] = true;
            }
        });
        setExpandedSections(initialExpanded);
    }, []);

    // Filter rules
    const getFilteredRules = () => {
        let filtered = approvalRules;

        if (!showInactive) {
            filtered = filtered.filter(rule => rule.is_active);
        }

        if (selectedLeaveFilter) {
            filtered = filtered.filter(rule => rule.leave_code === selectedLeaveFilter);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(rule =>
                rule.leave_name.toLowerCase().includes(query) ||
                rule.rule_name.toLowerCase().includes(query) ||
                rule.description?.toLowerCase().includes(query) ||
                rule.approver_value.toLowerCase().includes(query)
            );
        }

        return filtered.sort((a, b) => {
            if (a.leave_code === b.leave_code) {
                return a.priority - b.priority;
            }
            return a.leave_code.localeCompare(b.leave_code);
        });
    };

    // Group rules by leave type
    const getGroupedRules = () => {
        const filtered = getFilteredRules();
        const grouped = {};
        
        filtered.forEach(rule => {
            if (!grouped[rule.leave_code]) {
                const leave = leaveMaster.find(l => l.leave_code === rule.leave_code);
                grouped[rule.leave_code] = {
                    leave_code: rule.leave_code,
                    leave_name: rule.leave_name,
                    leave_details: leave,
                    rules: []
                };
            }
            grouped[rule.leave_code].rules.push(rule);
        });

        return Object.values(grouped).sort((a, b) => a.leave_name.localeCompare(b.leave_name));
    };

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
            priority: parseInt(newRule.priority),
            created_by: 'Admin',
            created_on: new Date().toISOString().split('T')[0],
            approval_count: 0
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
            requires_attachment: false,
            requires_approval_note: false,
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
            requires_attachment: rule.requires_attachment || false,
            requires_approval_note: rule.requires_approval_note || false,
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
            rule_name: `${rule.rule_name} (Copy)`,
            approval_count: 0,
            created_on: new Date().toISOString().split('T')[0]
        };
        setApprovalRules([...approvalRules, newRule]);
    };

    const handleMovePriority = (ruleId, direction) => {
        const rules = getFilteredRules();
        const index = rules.findIndex(r => r.id === ruleId);
        if (index === -1) return;

        if (direction === 'up' && index > 0) {
            const prevRule = rules[index - 1];
            const currentRule = rules[index];
            
            setApprovalRules(approvalRules.map(r => {
                if (r.id === currentRule.id) {
                    return { ...r, priority: prevRule.priority };
                }
                if (r.id === prevRule.id) {
                    return { ...r, priority: currentRule.priority };
                }
                return r;
            }));
        } else if (direction === 'down' && index < rules.length - 1) {
            const nextRule = rules[index + 1];
            const currentRule = rules[index];
            
            setApprovalRules(approvalRules.map(r => {
                if (r.id === currentRule.id) {
                    return { ...r, priority: nextRule.priority };
                }
                if (r.id === nextRule.id) {
                    return { ...r, priority: currentRule.priority };
                }
                return r;
            }));
        }
    };

    const toggleSection = (leaveCode) => {
        setExpandedSections(prev => ({
            ...prev,
            [leaveCode]: !prev[leaveCode]
        }));
    };

    // Available approver options
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

    const getApproverLabel = (type, value) => {
        if (!value) return '—';
        
        if (type === 'role') {
            return value;
        } else if (type === 'designation') {
            return value;
        } else if (type === 'specific_person') {
            const person = approverSpecific.find(p => p.value === value);
            return person ? person.label : value;
        }
        return value;
    };

    const groupedRules = getGroupedRules();

    return (
        <div className="p-3 md:p-4 lg:p-6 bg-gray-50 min-h-screen">
            <Breadcrumb
                items={[
                    { label: 'Settings', to: '/settings' },
                    { label: 'Leave Approval Workflow' }
                ]}
                title="Leave Approval Workflow"
                description="Configure approval hierarchy and rules for leave requests"
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total Rules</p>
                            <p className="text-lg md:text-xl font-bold text-gray-900">{approvalRules.length}</p>
                        </div>
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Layers className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Active: {approvalRules.filter(r => r.is_active).length} | Inactive: {approvalRules.filter(r => !r.is_active).length}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Leave Types</p>
                            <p className="text-lg md:text-xl font-bold text-gray-900">{leaveMaster.length}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        With rules: {new Set(approvalRules.map(r => r.leave_code)).size}
                    </p>
                </div>

                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Avg Approvers</p>
                            <p className="text-lg md:text-xl font-bold text-gray-900">
                                {(approvalRules.length / new Set(approvalRules.map(r => r.leave_code)).size || 0).toFixed(1)}
                            </p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">per leave type</p>
                </div>

                <div className="bg-white rounded-lg p-3 md:p-4 shadow-sm border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500">Total Approvals</p>
                            <p className="text-lg md:text-xl font-bold text-gray-900">
                                {approvalRules.reduce((sum, r) => sum + (r.approval_count || 0), 0)}
                            </p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">processed via rules</p>
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <div className="relative">
                        <label className="block mb-1 text-xs font-medium text-gray-700">
                            Search Rules
                        </label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name, description..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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

                    <div className="flex items-end">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showInactive}
                                onChange={(e) => setShowInactive(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700">Show inactive rules</span>
                        </label>
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => {
                                setSelectedLeaveFilter('');
                                setSearchQuery('');
                                setShowInactive(false);
                            }}
                            className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
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
                                    requires_attachment: false,
                                    requires_approval_note: false,
                                    is_active: true,
                                    priority: approvalRules.length + 1
                                });
                                setShowAddModal(true);
                            }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Rule
                        </button>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
                    <span>
                        Showing {groupedRules.reduce((sum, g) => sum + g.rules.length, 0)} of {approvalRules.length} rules
                    </span>
                    <span>
                        {groupedRules.length} leave types with rules
                    </span>
                </div>
            </div>

            {/* Rules Display - Card Based Layout */}
            <div className="space-y-4 md:space-y-6">
                {groupedRules.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Rules Found</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            {searchQuery || selectedLeaveFilter ? 'Try adjusting your filters' : 'Add your first approval rule to get started'}
                        </p>
                        {!searchQuery && !selectedLeaveFilter && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Rule
                            </button>
                        )}
                    </div>
                ) : (
                    groupedRules.map(group => {
                        const leave = group.leave_details || {
                            color: 'bg-gray-100 text-gray-800',
                            icon: '📋'
                        };
                        
                        return (
                            <div key={group.leave_code} className="bg-white rounded-xl shadow-sm overflow-hidden">
                                {/* Section Header */}
                                <div 
                                    className={`px-4 md:px-6 py-3 flex items-center justify-between cursor-pointer ${leave.color}`}
                                    onClick={() => toggleSection(group.leave_code)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg md:text-xl">{leave.icon || '📋'}</span>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base">
                                                {group.leave_name}
                                            </h3>
                                            <p className="text-xs opacity-75">
                                                {group.rules.length} rule{group.rules.length !== 1 ? 's' : ''} • 
                                                Max {leave.max_per_year} days/year
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-white bg-opacity-30 px-2 py-1 rounded-full">
                                            Priority {group.rules[0]?.priority} - {group.rules[group.rules.length - 1]?.priority}
                                        </span>
                                        {expandedSections[group.leave_code] ? (
                                            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                        )}
                                    </div>
                                </div>

                                {/* Rules List */}
                                {expandedSections[group.leave_code] && (
                                    <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                                        {group.rules.map((rule, index) => (
                                            <div 
                                                key={rule.id} 
                                                className={`border rounded-lg p-3 md:p-4 transition-all hover:shadow-md ${
                                                    !rule.is_active ? 'bg-gray-50 opacity-75' : ''
                                                }`}
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-start gap-3">
                                                    {/* Rule Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h4 className="font-medium text-sm md:text-base text-gray-900 flex items-center gap-2">
                                                                    {rule.rule_name}
                                                                    {rule.is_active ? (
                                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                            Active
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                                                                            Inactive
                                                                        </span>
                                                                    )}
                                                                </h4>
                                                                {rule.description && (
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {rule.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                                                                Priority {rule.priority}
                                                            </span>
                                                        </div>

                                                        {/* Rule Details Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-3 text-xs">
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <span className="text-gray-500 block">Duration</span>
                                                                <span className="font-medium">{rule.min_days} - {rule.max_days} days</span>
                                                            </div>
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <span className="text-gray-500 block">Primary Approver</span>
                                                                <span className="font-medium">{getApproverLabel(rule.approver_type, rule.approver_value)}</span>
                                                                <span className="text-gray-400 block text-[10px] capitalize">({rule.approver_type})</span>
                                                            </div>
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <span className="text-gray-500 block">Alternate</span>
                                                                <span className="font-medium">{getApproverLabel(rule.approver_type, rule.alternate_approver) || '—'}</span>
                                                            </div>
                                                            <div className="bg-gray-50 p-2 rounded">
                                                                <span className="text-gray-500 block">Escalation</span>
                                                                <span className="font-medium">{rule.escalation_days ? `${rule.escalation_days} days` : '—'}</span>
                                                            </div>
                                                        </div>

                                                        {/* Additional Requirements */}
                                                        {(rule.requires_attachment || rule.requires_approval_note) && (
                                                            <div className="flex gap-3 mt-2 text-xs">
                                                                {rule.requires_attachment && (
                                                                    <span className="flex items-center gap-1 text-amber-600">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        Requires attachment
                                                                    </span>
                                                                )}
                                                                {rule.requires_approval_note && (
                                                                    <span className="flex items-center gap-1 text-blue-600">
                                                                        <Info className="w-3 h-3" />
                                                                        Approval note required
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Metadata */}
                                                        <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                                                            <span>Created: {rule.created_on}</span>
                                                            <span>By: {rule.created_by}</span>
                                                            <span>{rule.approval_count} approvals</span>
                                                        </div>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex lg:flex-col items-center gap-1 lg:ml-auto">
                                                        <button
                                                            onClick={() => handleMovePriority(rule.id, 'up')}
                                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            title="Move Up"
                                                            disabled={index === 0}
                                                        >
                                                            <MoveUp className={`w-4 h-4 ${index === 0 ? 'opacity-30' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleMovePriority(rule.id, 'down')}
                                                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            title="Move Down"
                                                            disabled={index === group.rules.length - 1}
                                                        >
                                                            <MoveDown className={`w-4 h-4 ${index === group.rules.length - 1 ? 'opacity-30' : ''}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEditRule(rule)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCopyRule(rule)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                                            title="Copy"
                                                        >
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(rule.id)}
                                                            className={`p-1.5 rounded-lg ${
                                                                rule.is_active 
                                                                    ? 'text-amber-600 hover:bg-amber-50' 
                                                                    : 'text-green-600 hover:bg-green-50'
                                                            }`}
                                                            title={rule.is_active ? 'Deactivate' : 'Activate'}
                                                        >
                                                            {rule.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteRule(rule.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Workflow Visualization */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-4 md:p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm md:text-base">
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
                            <div key={leave.leave_code} className="border rounded-lg p-3 md:p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${leave.color}`}>
                                        {leave.icon} {leave.leave_name}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {leaveRules.map((rule, index) => (
                                        <React.Fragment key={rule.id}>
                                            <div className="bg-indigo-50 rounded-lg p-2 md:p-3 text-xs md:text-sm">
                                                <div className="font-medium text-indigo-700">{rule.min_days}-{rule.max_days} days</div>
                                                <div className="text-[10px] md:text-xs text-gray-600 mt-1">
                                                    → {getApproverLabel(rule.approver_type, rule.approver_value)}
                                                </div>
                                                {rule.alternate_approver && (
                                                    <div className="text-[10px] text-gray-500">
                                                        Alt: {getApproverLabel(rule.approver_type, rule.alternate_approver)}
                                                    </div>
                                                )}
                                            </div>
                                            {index < leaveRules.length - 1 && (
                                                <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add/Edit Rule Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900">
                                {editingRule ? 'Edit Approval Rule' : 'Add New Approval Rule'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingRule(null);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
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

                            {/* Rule Name and Description */}
                            <CommonInputField
                                label="Rule Name *"
                                value={newRule.rule_name}
                                onChange={(e) => setNewRule({ ...newRule, rule_name: e.target.value })}
                                placeholder="e.g., 1-3 Days Approval"
                            />

                            <CommonInputField
                                label="Description"
                                value={newRule.description}
                                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                                placeholder="Brief description of this rule"
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
                                hint="Rules with lower priority numbers are checked first"
                            />

                            {/* Approver Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Approver Type *
                                </label>
                                <div className="grid grid-cols-3 gap-2 md:gap-3">
                                    <label className={`p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                                        newRule.approver_type === 'role' 
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                            : 'border-gray-200 hover:border-gray-300'
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
                                            <Shield className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-xs md:text-sm">Role Based</div>
                                        </div>
                                    </label>

                                    <label className={`p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                                        newRule.approver_type === 'designation' 
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                            : 'border-gray-200 hover:border-gray-300'
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
                                            <Briefcase className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-xs md:text-sm">Designation</div>
                                        </div>
                                    </label>

                                    <label className={`p-2 md:p-3 border rounded-lg cursor-pointer transition-all ${
                                        newRule.approver_type === 'specific_person' 
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                                            : 'border-gray-200 hover:border-gray-300'
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
                                            <User className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 text-indigo-600" />
                                            <div className="font-medium text-xs md:text-sm">Specific Person</div>
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

                            {/* Additional Requirements */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Requirements
                                </label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newRule.requires_attachment}
                                            onChange={(e) => setNewRule({ ...newRule, requires_attachment: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Requires attachment</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newRule.requires_approval_note}
                                            onChange={(e) => setNewRule({ ...newRule, requires_approval_note: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Requires approval note</span>
                                    </label>
                                </div>
                            </div>

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
                                    <h4 className="font-medium text-gray-900 mb-2 text-sm">Rule Preview</h4>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
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

                        <div className="sticky bottom-0 bg-gray-50 border-t px-4 md:px-6 py-3 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setEditingRule(null);
                                }}
                                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddRule}
                                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm"
                            >
                                <Save className="w-4 h-4" />
                                {editingRule ? 'Update Rule' : 'Add Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LeaveApprovalWorkflow;