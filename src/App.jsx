import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard/container/Dashboard'

function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App