import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Participants from './pages/Participants/Participants';
import Registration from './pages/Registration/Registration';
import Payments from './pages/Payments/Payments';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="participants" element={<Participants />} />
          <Route path="registration" element={<Registration />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
