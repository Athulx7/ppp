import React from 'react'
import { Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/admin' element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />
          <Route path='master/:menuId' element={<MasterMain />} />
          <Route path="master/:menuId/add" element={<MasterFormPage />} />
          <Route path="master/:menuId/edit/:rowId" element={<MasterFormPage />} />

          <Route path='empDash' element={<EmployeeDashboard />} />
          <Route path= 'hrDash' element={<HRDashboard />} />
          <Route path='payrollDash' element={<PayrollManagerDashboard />} />

          <Route path='mycalendar' element={<MyCalendarEntry />} />

          <Route path='salary_components' element={<SalaryComponentEntry />} />

          <Route path='salary_structure' element={<SalaryStructureEntry />} />
          <Route path='salary_structure/create' element={<SalaryStructureAddEditEntry />} />
          <Route path='salary_structure/edit/:id' element={<SalaryStructureAddEditEntry />} />
          
        </Route>
      </Routes>
    </>
  )
}

export default App