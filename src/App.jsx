import { BrowserRouter, Routes, Route } from 'react-router-dom'
import JobLayout from './components/layout/JobLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/jobs/search' element={<JobLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
