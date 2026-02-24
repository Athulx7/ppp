import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './MProtectedRoute'
import Dashboard from './Dashboard/container/Dashboard'
import AdminDashboard from './Dashboard/components/AdminDashboard'
import MasterMain from './Master/containers/MasterMain'
import MasterFormPage from './Master/containers/MasterFormPage'
import EmployeeDashboard from './Dashboard/components/EmployeeDashboard'
import HRDashboard from './Dashboard/components/HrDashboard'
import PayrollManagerDashboard from './Dashboard/components/PayRollManagerDashboard'
import LoginPage from './LandingPages/LoginPage/LoginPage'
import MyCalendarEntry from './MyCalendar/container/MyCalendarEntry'
import SalaryComponentEntry from './SalaryComponents/container/SalaryComponentEntry'
import SalaryStructureEntry from './SalaryStructure/container/SalaryStructureEntry'
import SalaryStructureAddEditEntry from './SalaryStructure/container/SalaryStructureAddEditEntry'
import NotFoundPage from './NotFoundPage'
import UserProfileEntry from './UserProfile/container/UserProfileEntry'
import CompanySettingsEntry from './Company_settings/container/CompanySettingsEntry'
import ZCursorTracker from './ZCursorTracker'
import EmployeeMasterEntry from './EmployeeMaster/container/EmployeeMasterEntry'
import EmpMstAddEditEntry from './EmployeeMaster/container/EmpMstAddEditEntry'
import MenuMappingTest from './MenuMapping/MenuMappingTest'
import UploadDashboard from './UploadCenter/container/UploadCenterEntry'
import UploadProgress from './UploadCenter/components/UploadProgress'
import UploadHistory from './UploadCenter/components/UploadHistory'
import CtcReportTest from './CtcReport/CtcReportTest'
import PayslipsTest from './Payslips/PayslipsTest'
import LeaveSettingTest from './LeaveSetting/LeaveSettingTest'
import LeaveSettingsAddEditTest from './LeaveSetting/LeaveSettingsAddEditTest'
import LeaveApprovalWorkflow from './LeaveApprovalWorkFlow/LeaveApprovalWorkflowTest'
import LeaveRequest from './LeaveRequest/LeaveRequestTest'

const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem('token')
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  if (token) {
    switch (user.role_code) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />
      case 'HR':
        return <Navigate to="/hr" replace />
      case 'PAYROLL_MANAGER':
        return <Navigate to="/payroll" replace />
      case 'EMPLOYEE':
        return <Navigate to="/employee" replace />
      default:
        return <Navigate to="/" replace />
    }
  }
  return children
}

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* <Route path='/admin' element={<ProtectedRoute allowedRoles={['ADMIN']}> <Dashboard /> </ProtectedRoute>}> */}
        <Route path='/admin' element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />

          {/* Done fe be */}
          <Route path='master/:menuId' element={<MasterMain />} />
          <Route path="master/:menuId/add" element={<MasterFormPage />} />
          <Route path="master/:menuId/edit/:rowId" element={<MasterFormPage />} />
          <Route path='companysettings' element={<CompanySettingsEntry />} />
          <Route path='employee_master_entry' element={<EmployeeMasterEntry />} />
          <Route path='employee_master_entry/edit/add' element={<EmpMstAddEditEntry />} />
          <Route path='employee_master_entry/edit/:id' element={<EmpMstAddEditEntry />} />

          <Route path='mycalendar' element={<MyCalendarEntry />} />
          <Route path='salary_components' element={<SalaryComponentEntry />} />
          <Route path='salary_structure' element={<SalaryStructureEntry />} />
          <Route path='salary_structure/create' element={<SalaryStructureAddEditEntry />} />
          <Route path='salary_structure/edit/:id' element={<SalaryStructureAddEditEntry />} />

          <Route path='profile' element={<UserProfileEntry />} />
          <Route path='menumapping' element={<MenuMappingTest />} />
          <Route path='uploadDash' element={<UploadDashboard />} />
          <Route path='uploadProgress/:batchId' element={<UploadProgress />} />
          <Route path='uploadHistory' element={<UploadHistory />} />
          <Route path='ctcreport' element={<CtcReportTest />} />
          <Route path='payslip' element={<PayslipsTest />} />
          <Route path='leavesetting' element={<LeaveSettingTest />} />
          <Route path='leave-settings/add' element={<LeaveSettingsAddEditTest />} />
          <Route path='leave-settings/edit' element={<LeaveSettingsAddEditTest />} />
          <Route path='leaveapprovalworkflow' element={<LeaveApprovalWorkflow />} />
          <Route path='leaveRequest' element={<LeaveRequest />} />

        </Route>

        <Route path='/employee' element={<ProtectedRoute allowedRoles={['EMPLOYEE']}><Dashboard /></ProtectedRoute>}>
          <Route index element={<EmployeeDashboard />} />
          <Route path='mycalendar' element={<MyCalendarEntry />} />
          <Route path='ctcreport' element={<CtcReportTest />} />
          <Route path='payslip' element={<PayslipsTest />} />
        </Route>

        <Route path='/hr' element={<ProtectedRoute allowedRoles={['HR']}><Dashboard /> </ProtectedRoute>}>
          <Route index element={<HRDashboard />} />
          <Route path='master/:menuId' element={<MasterMain />} />
          <Route path="master/:menuId/add" element={<MasterFormPage />} />
          <Route path="master/:menuId/edit/:rowId" element={<MasterFormPage />} />
          <Route path='salary_components' element={<SalaryComponentEntry />} />
          <Route path='salary_structure' element={<SalaryStructureEntry />} />
          <Route path='salary_structure/create' element={<SalaryStructureAddEditEntry />} />
          <Route path='salary_structure/edit/:id' element={<SalaryStructureAddEditEntry />} />
          <Route path='employee_master_entry' element={<EmployeeMasterEntry />} />
          <Route path='employee_master_entry/edit/add' element={<EmpMstAddEditEntry />} />
          <Route path='employee_master_entry/edit/:id' element={<EmpMstAddEditEntry />} />
          <Route path='mycalendar' element={<MyCalendarEntry />} />

          <Route path='uploadDash' element={<UploadDashboard />} />
          <Route path='uploadProgress/:batchId' element={<UploadProgress />} />
          <Route path='uploadHistory' element={<UploadHistory />} />
          <Route path='ctcreport' element={<CtcReportTest />} />
          <Route path='payslip' element={<PayslipsTest />} />
        </Route>

        <Route path='/payroll' element={<ProtectedRoute allowedRoles={['PAYROLL_MANAGER']}> <Dashboard /> </ProtectedRoute>}>
          <Route index element={<PayrollManagerDashboard />} />
          <Route path='mycalendar' element={<MyCalendarEntry />} />

          <Route path='uploadDash' element={<UploadDashboard />} />
          <Route path='uploadProgress/:batchId' element={<UploadProgress />} />
          <Route path='uploadHistory' element={<UploadHistory />} />
          <Route path='ctcreport' element={<CtcReportTest />} />
          <Route path='payslip' element={<PayslipsTest />} />
        </Route>

        <Route path='/dashboard' element={<RoleBasedRedirect />} />

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      {/* <ZCursorTracker /> */}
    </>
  )
}

const RoleBasedRedirect = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  switch (user.role_code) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />
    case 'HR':
      return <Navigate to="/hr" replace />
    case 'PAYROLL_MANAGER':
      return <Navigate to="/payroll" replace />
    case 'EMPLOYEE':
      return <Navigate to="/employee" replace />
    default:
      return <Navigate to="/" replace />
  }
}

export default App