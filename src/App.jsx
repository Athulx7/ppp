import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard/container/Dashboard'
import AdminDashboard from './Dashboard/components/AdminDashboard'
import MasterMain from './Master/containers/MasterMain'
import MasterFormPage from './Master/containers/MasterFormPage'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route index element={<AdminDashboard />} />
          <Route path='/master/:menuId' element={<MasterMain />} />
          <Route path="/master/:menuId/add" element={<MasterFormPage />} />
          <Route path="/master/:menuId/edit/:rowId" element={<MasterFormPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App