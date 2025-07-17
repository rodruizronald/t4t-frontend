import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import JobLayout from '@shared/components/layout/JobLayout'

function App() {
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
