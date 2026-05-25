import AdminDashboard from './Dashboard/components/AdminDashboard'
import EmployeeDashboard from './Dashboard/components/EmployeeDashboard'
import HRDashboard from './Dashboard/components/HrDashboard'
import PayrollManagerDashboard from './Dashboard/components/PayRollManagerDashboard'
import MasterMain from './Master/containers/MasterMain'
import MasterFormPage from './Master/containers/MasterFormPage'
import MyCalendarEntry from './MyCalendar/container/MyCalendarEntry'
import SalaryComponentEntry from './SalaryComponents/container/SalaryComponentEntry'
import SalaryStructureEntry from './SalaryStructure/container/SalaryStructureEntry'
import SalaryStructureAddEditEntry from './SalaryStructure/container/SalaryStructureAddEditEntry'
import UserProfileEntry from './UserProfile/container/UserProfileEntry'
import CompanySettingsEntry from './Company_settings/container/CompanySettingsEntry'
import EmployeeMasterEntry from './EmployeeMaster/container/EmployeeMasterEntry'
import EmpMstAddEditEntry from './EmployeeMaster/container/EmpMstAddEditEntry'
import UploadDashboard from './UploadCenter/container/UploadCenterEntry'
import UploadProgressEntry from './UploadCenter/container/UploadProgressEntry'
import UploadHistoryEntry from './UploadCenter/container/UploadHistoryEntry'
import LeaveSettingTest from './LeaveSetting/LeaveSettingTest'
import LeaveSettingsAddEditTest from './LeaveSetting/LeaveSettingsAddEditTest'
import LeaveApprovalWorkflow from './LeaveApprovalWorkFlow/LeaveApprovalWorkflowTest'
import LeaveRequest from './LeaveRequest/LeaveRequestTest'
import MyLeaves from './LeaveMyLeavss/MyLeaveTest'
import LeaveApproval from './LeaveApproval/LeaveApprovalTest'
import SalaryAdvanceRequest from './SalaryAdvanceRequest/SalaryAdvanceRequestTest'
import SalaryAdvanceApproval from './SalaryAdvanceApproval/SalaryAdvanceApprovaltest'
import PayrollRun from './PayrollRuns/PayrollRunstest'
import PayrollInputstest from './PayrollRuns/PayrollInputstest'
import PayrollSettings from './Payrollsettings/payrollSettinsTest'
import MenuMappingEntry from './MenuMapping/container/MenuMappingEntry'
import CtcReportEntry from './CtcReport/container/CtcReportEntry'
import PayslipsEntry from './Payslips/container/PayslipsEntry'
import JobCalendar from './JobTracking/JobCalendar'
import AdminJobDashboard from './JobTracking/JobAdminView'
import JobTrackingEntry from './JobTracking/container/JobTrackingEntry'
import ChatPage from './ChatModule/Chatpage'
import ChatBotPage from './ChatModule/ChatBotPage'
import LeaveRequestMobile from './Dashboard/Mobile/Leaverequestmobile'
import RegularizeMobile from './Dashboard/Mobile/Regularizemobile'
import PayslipsMobile from './Dashboard/Mobile/Payslipsmobile'
import ProfileMobile from './Dashboard/Mobile/Profilemobile'
import ManagerApprovalsMobile from './Dashboard/Mobile/Managerapprovalsmobile'
import LeaveMasterEntry from './LeaveMaster/container/LeaveMasterEntry'
import LeaveMasterListEntry from './LeaveMaster/container/LeaveMasterListEntry'

export const DASHBOARD_ROUTES = {
    ADMIN: { component: AdminDashboard },
    HR: { component: HRDashboard },
    PAYROLL_MANAGER: { component: PayrollManagerDashboard },
    EMPLOYEE: { component: EmployeeDashboard },
}

export const ALL_ROUTES = [

    { path: 'master/:mastercode', component: MasterMain, dynamic: true },
    { path: 'master/:mastercode/add', component: MasterFormPage, skipCheck: true },
    { path: 'master/:mastercode/edit/:rowId', component: MasterFormPage, skipCheck: true },

    { path: 'companysettings', component: CompanySettingsEntry },

    { path: 'employee_master_entry', component: EmployeeMasterEntry },
    { path: 'employee_master_entry/edit/add', component: EmpMstAddEditEntry, skipCheck: true },
    { path: 'employee_master_entry/edit/:id', component: EmpMstAddEditEntry, skipCheck: true },

    { path: 'mycalendar', component: MyCalendarEntry },

    { path: 'profile', component: UserProfileEntry },

    { path: 'salary_components', component: SalaryComponentEntry },
    { path: 'salary_structure', component: SalaryStructureEntry },
    { path: 'salary_structure/create', component: SalaryStructureAddEditEntry, skipCheck: true },
    { path: 'salary_structure/edit/:id', component: SalaryStructureAddEditEntry, skipCheck: true },
    { path: 'salary_structure/view/:id', component: SalaryStructureAddEditEntry, skipCheck: true },

    { path: 'uploadDash', component: UploadDashboard },
    { path: 'uploadProgress/:batchId', component: UploadProgressEntry, skipCheck: true },
    { path: 'uploadHistory', component: UploadHistoryEntry },
    { path: 'ctcreport', component: CtcReportEntry },

    { path: 'payslip', component: PayslipsEntry },

    { path: 'leaveMasterList', component: LeaveMasterListEntry },
    { path: 'leaveMaster/add', component: LeaveMasterEntry, skipCheck: true },
    { path: 'leaveMaster/edit/:id', component: LeaveMasterEntry, skipCheck: true },

    { path: 'leavesetting', component: LeaveSettingTest },
    { path: 'leave-settings/add', component: LeaveSettingsAddEditTest, skipCheck: true },
    { path: 'leave-settings/edit', component: LeaveSettingsAddEditTest, skipCheck: true },
    { path: 'leaveapprovalworkflow', component: LeaveApprovalWorkflow },
    { path: 'leaveRequest', component: LeaveRequest },
    { path: 'myleves', component: MyLeaves },
    { path: 'leaveapproval', component: LeaveApproval },

    { path: 'salaryadvanceRequest', component: SalaryAdvanceRequest },
    { path: 'salaryadvanceapproval', component: SalaryAdvanceApproval },

    { path: 'payrollruns', component: PayrollRun },
    { path: 'payrollinputs', component: PayrollInputstest },
    { path: 'payrollsettings', component: PayrollSettings },

    { path: 'menumapping', component: MenuMappingEntry },

    { path: 'jobtracking', component: JobTrackingEntry },
    { path: 'jobcalendar', component: JobCalendar },
    { path: 'adminjobtracking', component: AdminJobDashboard },

    { path: 'chat', component: ChatPage },
    { path: 'chatbot', component: ChatBotPage },

    { path: 'leave', component: LeaveRequestMobile, skipCheck: true },
    { path: 'regularize', component: RegularizeMobile, skipCheck: true },
    { path: 'payslips', component: PayslipsMobile, skipCheck: true },
    { path: 'profile', component: ProfileMobile, skipCheck: true },
    { path: 'approvals', component: ManagerApprovalsMobile, skipCheck: true },
]