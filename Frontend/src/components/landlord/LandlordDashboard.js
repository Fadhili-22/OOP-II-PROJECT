import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  CreditCard, 
  FileText, 
  Ticket, 
  BarChart3, 
  Settings, 
  LogOut,
  Building2
} from 'lucide-react';

// Import all landlord components
import Overview from './Overview';
import TenantManagement from './TenantManagement';
import PaymentManagement from './PaymentManagement';
import LeaseManagement from './LeaseManagement';
import TicketManagement from './TicketManagement';
import Analytics from './Analytics';

const LandlordDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', href: '/landlord', icon: Home, current: true },
    { name: 'Tenants', href: '/landlord/tenants', icon: Users, current: false },
    { name: 'Payments', href: '/landlord/payments', icon: CreditCard, current: false },
    { name: 'Leases', href: '/landlord/leases', icon: FileText, current: false },
    { name: 'Tickets', href: '/landlord/tickets', icon: Ticket, current: false },
    { name: 'Analytics', href: '/landlord/analytics', icon: BarChart3, current: false },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden`} 
           onClick={() => setSidebarOpen(false)}></div>

      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="mx-2 text-xl font-semibold text-gray-800">TMS</span>
          </div>
        </div>

        <nav className="mt-10">
          <div className="px-6 py-4">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Landlord Dashboard
            </p>
            <div className="mt-2 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                Landlord Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Welcome back, {user?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="tenants" element={<TenantManagement />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="leases" element={<LeaseManagement />} />
              <Route path="tickets" element={<TicketManagement />} />
              <Route path="analytics" element={<Analytics />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandlordDashboard; 