import JobLayout from '@shared/components/layout/JobLayout'
import { type ReactElement } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

function App(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/jobs/search' replace />} />
        <Route path='/jobs/search' element={<JobLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
