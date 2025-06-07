import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Appbar from './components/Appbar';
import Dashboard from './components/Dashboard';
import PaymentOverview from './components/PaymentOverview';
import SupportTickets from './components/SupportTickets';
import DocumentCenter from './components/Documents';
import History from './components/History';

function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/payments" element={<PaymentOverview />} />
        <Route path="/support" element={<SupportTickets />} />
        <Route path="/documents" element={<DocumentCenter />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;
