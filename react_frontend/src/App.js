import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Appbar from './components/Appbar';
import Dashboard from './components/Dashboard';
import PaymentOverview from './components/PaymentOverview';
import SupportTickets from './components/SupportTickets';
import TicketDetail from './components/TicketDetail';
import DocumentCenter from './components/Documents';
import History from './components/History';

function App() {
  return (
    <UserProvider>
      <Router>
        <Appbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/payments" element={<PaymentOverview />} />
          <Route path="/support" element={<SupportTickets />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
          <Route path="/documents" element={<DocumentCenter />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
