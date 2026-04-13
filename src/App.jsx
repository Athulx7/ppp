// import React from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import ProtectedRoute from './MProtectedRoute'
// import Dashboard from './Dashboard/container/Dashboard'
// import AdminDashboard from './Dashboard/components/AdminDashboard'
// import MasterMain from './Master/containers/MasterMain'
// import MasterFormPage from './Master/containers/MasterFormPage'
// import EmployeeDashboard from './Dashboard/components/EmployeeDashboard'
// import HRDashboard from './Dashboard/components/HrDashboard'
// import PayrollManagerDashboard from './Dashboard/components/PayRollManagerDashboard'
// import LoginPage from './LandingPages/LoginPage/LoginPage'
// import MyCalendarEntry from './MyCalendar/container/MyCalendarEntry'
// import SalaryComponentEntry from './SalaryComponents/container/SalaryComponentEntry'
// import SalaryStructureEntry from './SalaryStructure/container/SalaryStructureEntry'
// import SalaryStructureAddEditEntry from './SalaryStructure/container/SalaryStructureAddEditEntry'
// import NotFoundPage from './NotFoundPage'
// import UserProfileEntry from './UserProfile/container/UserProfileEntry'
// import CompanySettingsEntry from './Company_settings/container/CompanySettingsEntry'
// import ZCursorTracker from './ZCursorTracker'
// import EmployeeMasterEntry from './EmployeeMaster/container/EmployeeMasterEntry'
// import EmpMstAddEditEntry from './EmployeeMaster/container/EmpMstAddEditEntry'
// import UploadDashboard from './UploadCenter/container/UploadCenterEntry'
// import LeaveSettingTest from './LeaveSetting/LeaveSettingTest'
// import LeaveSettingsAddEditTest from './LeaveSetting/LeaveSettingsAddEditTest'
// import LeaveApprovalWorkflow from './LeaveApprovalWorkFlow/LeaveApprovalWorkflowTest'
// import LeaveRequest from './LeaveRequest/LeaveRequestTest'
// import MyLeaves from './LeaveMyLeavss/MyLeaveTest'
// import LeaveApproval from './LeaveApproval/LeaveApprovalTest'
// import SalaryAdvanceRequest from './SalaryAdvanceRequest/SalaryAdvanceRequestTest'
// import SalaryAdvanceApproval from './SalaryAdvanceApproval/SalaryAdvanceApprovaltest'
// import PayrollRun from './PayrollRuns/PayrollRunstest'
// import PayrollInputstest from './PayrollRuns/PayrollInputstest'
// import UploadProgressEntry from './UploadCenter/container/UploadProgressEntry'
// import UploadHistoryEntry from './UploadCenter/container/UploadHistoryEntry'
// import MenuMappingEntry from './MenuMapping/container/MenuMappingEntry'
// import CtcReportEntry from './CtcReport/container/CtcReportEntry'
// import PayslipsEntry from './Payslips/container/PayslipsEntry'
// import PayrollSettings from './Payrollsettings/payrollSettinsTest'
// import AnimatelandingPage from './AnimatedLandingPage/AnimatelandingPage'
// import JobCalendar from './JobTracking/JobCalendar'
// import AdminJobDashboard from './JobTracking/JobAdminView'
// import JobTrackingEntry from './JobTracking/container/JobTrackingEntry'
// import LeaveRequestMobile from './Dashboard/Mobile/Leaverequestmobile'
// import RegularizeMobile from './Dashboard/Mobile/Regularizemobile'
// import PayslipsMobile from './Dashboard/Mobile/Payslipsmobile'
// import ProfileMobile from './Dashboard/Mobile/Profilemobile'
// import ManagerApprovalsMobile from './Dashboard/Mobile/Managerapprovalsmobile'
// import ChatPage from './ChatModule/Chatpage'
// import ChatBotPage from './ChatModule/ChatBotPage'

// const PublicRoute = ({ children }) => {
//   const token = sessionStorage.getItem('token')
//   const user = JSON.parse(sessionStorage.getItem('user') || '{}')

//   if (token) {
//     switch (user.role_code) {
//       case 'ADMIN':
//         return <Navigate to="/admin" replace />
//       case 'HR':
//         return <Navigate to="/hr" replace />
//       case 'PAYROLL_MANAGER':
//         return <Navigate to="/payroll" replace />
//       case 'EMPLOYEE':
//         return <Navigate to="/employee" replace />
//       default:
//         return <Navigate to="/login" replace />
//     }
//   }
//   return children
// }

// function App() {
//   return (
//     <>
//       <Routes>
//         <Route path='/' element={<AnimatelandingPage />} />
//         <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />

//         <Route path='/admin' element={<ProtectedRoute allowedRoles={['ADMIN']}> <Dashboard /> </ProtectedRoute>}>
//         {/* <Route path='/admin' element={<Dashboard />}> */}
//           <Route index element={<AdminDashboard />} />

//           {/* Done fe be */}
//           <Route path='master/:mastercode' element={<MasterMain />} />
//           <Route path="master/:mastercode/add" element={<MasterFormPage />} />
//           <Route path="master/:mastercode/edit/:rowId" element={<MasterFormPage />} />

//           <Route path='companysettings' element={<CompanySettingsEntry />} />

//           <Route path='employee_master_entry' element={<EmployeeMasterEntry />} />
//           <Route path='employee_master_entry/edit/add' element={<EmpMstAddEditEntry />} />
//           <Route path='employee_master_entry/edit/:id' element={<EmpMstAddEditEntry />} />

//           <Route path='mycalendar' element={<MyCalendarEntry />} />

//           <Route path='salary_components' element={<SalaryComponentEntry />} />

//           <Route path='salary_structure' element={<SalaryStructureEntry />} />
//           <Route path='salary_structure/create' element={<SalaryStructureAddEditEntry />} />
//           <Route path='salary_structure/edit/:id' element={<SalaryStructureAddEditEntry />} />
//           <Route path='salary_structure/view/:id' element={<SalaryStructureAddEditEntry />} />

//           <Route path='profile' element={<UserProfileEntry />} />

//           <Route path='menumapping' element={<MenuMappingEntry />} />

//           <Route path='uploadDash' element={<UploadDashboard />} />
//           <Route path='uploadProgress/:batchId' element={<UploadProgressEntry />} />
//           <Route path='uploadHistory' element={<UploadHistoryEntry />} />

//           <Route path='ctcreport' element={<CtcReportEntry />} />

//           <Route path='payslip' element={<PayslipsEntry />} />

//           <Route path='leavesetting' element={<LeaveSettingTest />} />
//           <Route path='leave-settings/add' element={<LeaveSettingsAddEditTest />} />
//           <Route path='leave-settings/edit' element={<LeaveSettingsAddEditTest />} />

//           <Route path='leaveapprovalworkflow' element={<LeaveApprovalWorkflow />} />
//           <Route path='leaveRequest' element={<LeaveRequest />} />
//           <Route path='myleves' element={<MyLeaves />} />
//           <Route path='leaveapproval' element={<LeaveApproval />} />

//           <Route path='salaryadvanceRequest' element={<SalaryAdvanceRequest />} />
//           <Route path='salaryadvanceapproval' element={<SalaryAdvanceApproval />} />

//           <Route path='payrollruns' element={<PayrollRun />} />
//           <Route path='payrollinputs' element={<PayrollInputstest />} />
//           <Route path='payrollsettings' element={<PayrollSettings />} />

//           <Route path='jobtracking' element={<JobTrackingEntry />} />
//           <Route path='jobcalendar' element={<JobCalendar />} />
//           <Route path='adminjobtracking' element={<AdminJobDashboard />} />

//           <Route path='chat' element={<ChatPage />} />
//           <Route path='chatbot' element={<ChatBotPage />} />

//         </Route>

//         <Route path='/employee' element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><Dashboard /></ProtectedRoute>}>
//           <Route index element={<EmployeeDashboard />} />
//           <Route path='mycalendar' element={<MyCalendarEntry />} />
//           <Route path='ctcreport' element={<CtcReportEntry />} />
//           <Route path='payslip' element={<PayslipsEntry />} />
//           <Route path='leaveRequest' element={<LeaveRequest />} />
//           <Route path='myleves' element={<MyLeaves />} />
//           <Route path='salaryadvanceRequest' element={<SalaryAdvanceRequest />} />
//           <Route path='leaveapproval' element={<LeaveApproval />} />

//           {/* for mobile  */}
//           <Route path="leave"      element={<LeaveRequestMobile />} />
//           <Route path="regularize" element={<RegularizeMobile />} />
//           <Route path="payslips"   element={<PayslipsMobile />} />
//           <Route path="profile"    element={<ProfileMobile />} />
//           <Route path="approvals"  element={<ManagerApprovalsMobile />} />
//           <Route path='chat' element={<ChatPage />} />
//           <Route path='chatbot' element={<ChatBotPage />} />

//         </Route>

//         <Route path='/hr' element={<ProtectedRoute allowedRoles={['HR']}><Dashboard /> </ProtectedRoute>}>
//           <Route index element={<HRDashboard />} />
//           <Route path='master/:mastercode' element={<MasterMain />} />
//           <Route path="master/:mastercode/add" element={<MasterFormPage />} />
//           <Route path="master/:mastercode/edit/:rowId" element={<MasterFormPage />} />
//           <Route path='salary_components' element={<SalaryComponentEntry />} />
//           <Route path='salary_structure' element={<SalaryStructureEntry />} />
//           <Route path='salary_structure/create' element={<SalaryStructureAddEditEntry />} />
//           <Route path='salary_structure/edit/:id' element={<SalaryStructureAddEditEntry />} />
//           <Route path='salary_structure/view/:id' element={<SalaryStructureAddEditEntry />} />
//           <Route path='employee_master_entry' element={<EmployeeMasterEntry />} />
//           <Route path='employee_master_entry/edit/add' element={<EmpMstAddEditEntry />} />
//           <Route path='employee_master_entry/edit/:id' element={<EmpMstAddEditEntry />} />
//           <Route path='mycalendar' element={<MyCalendarEntry />} />

//           <Route path='uploadDash' element={<UploadDashboard />} />
//           <Route path='uploadProgress/:batchId' element={<UploadProgressEntry />} />
//           <Route path='uploadHistory' element={<UploadHistoryEntry />} />
//           <Route path='ctcreport' element={<CtcReportEntry />} />
//           <Route path='payslip' element={<PayslipsEntry />} />
//           <Route path='chat' element={<ChatPage />} />
//           <Route path='chatbot' element={<ChatBotPage />} />
//         </Route>

//         <Route path='/payroll' element={<ProtectedRoute allowedRoles={['PAYROLL_MANAGER']}> <Dashboard /> </ProtectedRoute>}>
//           <Route index element={<PayrollManagerDashboard />} />
//           <Route path='mycalendar' element={<MyCalendarEntry />} />

//           <Route path='uploadDash' element={<UploadDashboard />} />
//           <Route path='uploadProgress/:batchId' element={<UploadProgressEntry />} />
//           <Route path='uploadHistory' element={<UploadHistoryEntry />} />
//           <Route path='ctcreport' element={<CtcReportEntry />} />
//           <Route path='payslip' element={<PayslipsEntry />} />
//           <Route path='chat' element={<ChatPage />} />
//           <Route path='chatbot' element={<ChatBotPage />} />
//         </Route>

//         <Route path='/dashboard' element={<RoleBasedRedirect />} />

//         <Route path='*' element={<NotFoundPage />} />
//       </Routes>
//       {/* <ZCursorTracker /> */}
//     </>
//   )
// }

// const RoleBasedRedirect = () => {
//   const user = JSON.parse(sessionStorage.getItem('user') || '{}')

//   switch (user.role_code) {
//     case 'ADMIN':
//       return <Navigate to="/admin" replace />
//     case 'HR':
//       return <Navigate to="/hr" replace />
//     case 'PAYROLL_MANAGER':
//       return <Navigate to="/payroll" replace />
//     case 'EMPLOYEE':
//       return <Navigate to="/employee" replace />
//     default:
//       return <Navigate to="/login" replace />
//   }
// }

// export default App

// src/App.jsx
import React from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoute from './MProtectedRoute'
import Dashboard from './Dashboard/container/Dashboard'
import LoginPage from './LandingPages/LoginPage/LoginPage'
import NotFoundPage from './NotFoundPage'
import AnimatelandingPage from './AnimatedLandingPage/AnimatelandingPage'
import RouteGuard from './RouteGuard'
import { ALL_ROUTES, DASHBOARD_ROUTES } from './routeRegistry'
import { ArrowLeft } from 'lucide-react'

const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem('token')
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  if (token) return <RoleBasedRedirect user={user} />
  return children
}

const RoleBasedRedirect = ({ user }) => {
  const u = user || JSON.parse(sessionStorage.getItem('user') || '{}')
  const map = { ADMIN: '/admin', HR: '/hr', PAYROLL_MANAGER: '/payroll', EMPLOYEE: '/employee' }
  return <Navigate to={map[u.role_code] || '/login'} replace />
}

function RoleRoutes({ basePath, role }) {
  const DashboardIndex = DASHBOARD_ROUTES[role]?.component
  return (
    <Route path={basePath} element={<ProtectedRoute allowedRoles={[role]}> <Dashboard /></ProtectedRoute>}>
      <Route index element={<DashboardIndex />} />
      {ALL_ROUTES.map(({ path, component, skipCheck, dynamic }) => (
        <Route key={`${basePath}-${path}`} path={path} element={<RouteGuard component={component} routePath={path} skipCheck={skipCheck} />} />
      ))}
    </Route>
  )
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<PublicRoute><AnimatelandingPage /></PublicRoute>} />
      <Route path='/login' element={<PublicRoute><LoginPage /></PublicRoute>} />

      {RoleRoutes({ basePath: '/admin', role: 'ADMIN' })}
      {RoleRoutes({ basePath: '/hr', role: 'HR' })}
      {RoleRoutes({ basePath: '/payroll', role: 'PAYROLL_MANAGER' })}
      {RoleRoutes({ basePath: '/employee', role: 'EMPLOYEE' })}

      <Route path='/dashboard' element={<RoleBasedRedirect />} />
      <Route path='/unauthorized' element={<UnauthorizedPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500">You don't have permission to view this page.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => navigate(-1)}
          className="cursor-pointer flex items-center justify-center gap-2 px-6 py-3 text-gray-800 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Go Back
        </button>
      </div>
    </div>
  )
}

export default App