import { BrowserRouter } from 'react-router-dom'
import JobLayout from './components/layout/JobLayout'

function App() {
  return (
    <BrowserRouter>
      <JobLayout />
    </BrowserRouter>
  )
}

export default App