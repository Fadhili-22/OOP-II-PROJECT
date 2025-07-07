import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  CreditCard, 
  Ticket, 
  FileText, 
  Plus,
  LogOut,
  User,
  DollarSign,
  Phone,
  Mail,
  Building2,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { tenantAPI, ticketAPI, paymentAPI, leaseAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TenantDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tenantData, setTenantData] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leases, setLeases] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    description: '',
    urgency: 'Medium',
    category: 'Maintenance'
  });

  // Add timeout for loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        console.log('⏰ Loading timeout reached - showing emergency logout');
        setLoadingTimeout(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [loading]);

  const fetchTenantData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingTimeout(false);
      console.log('🔍 Fetching tenant data for user:', user);
      
      // Always set basic tenant data from user object
      setTenantData(user);
      
      // Check if user has a valid ID before making API calls
      if (!user || (user.id !== 0 && !user.id)) {
        console.log('⚠️ No valid user ID found, using basic user data only');
        setPayments([]);
        setTickets([]);
        setLeases([]);
        return;
      }
      
      // Try to fetch additional tenant data, but don't fail if it doesn't work
      try {
        console.log('📞 Calling tenantAPI.getById with ID:', user.id);
        const tenantResponse = await tenantAPI.getById(user.id);
        console.log('✅ Tenant data response:', tenantResponse.data);
        if (tenantResponse.data) {
          setTenantData(tenantResponse.data);
        }
      } catch (error) {
        console.log('⚠️ Could not fetch detailed tenant data:', error.message);
        // Keep using user data as fallback
      }

      // Try to fetch payments using the new tenant-specific endpoint
      try {
        console.log('📞 Calling paymentAPI.getByTenant with ID:', user.id);
        const paymentsResponse = await paymentAPI.getByTenant(user.id);
        console.log('✅ Payments response:', paymentsResponse.data);
        setPayments(paymentsResponse.data || []);
      } catch (error) {
        console.log('⚠️ Could not fetch payments:', error.message);
        console.log('Error details:', error.response?.status, error.response?.data);
        setPayments([]);
      }

      // Try to fetch lease information for the tenant
      try {
        console.log('📞 Calling leaseAPI.getAll to find tenant leases');
        const leasesResponse = await leaseAPI.getAll();
        console.log('✅ Leases response:', leasesResponse.data);
        
        // Filter leases for this tenant
        const tenantLeases = leasesResponse.data?.filter(lease => lease.tenantId === user.id) || [];
        console.log('🏠 Tenant leases:', tenantLeases);
        setLeases(tenantLeases);
      } catch (error) {
        console.log('⚠️ Could not fetch leases:', error.message);
        setLeases([]);
      }

      // Try to fetch tenant-specific tickets
      try {
        console.log('📞 Calling ticketAPI.getByTenant with ID:', user.id);
        const ticketsResponse = await ticketAPI.getByTenant(user.id);
        console.log('✅ Tickets response:', ticketsResponse.data);
        setTickets(ticketsResponse.data || []);
      } catch (error) {
        console.log('⚠️ Could not fetch tickets:', error.message);
        console.log('Error details:', error.response?.status, error.response?.data);
        setTickets([]);
      }

    } catch (error) {
      console.error('💥 Error in fetchTenantData:', error);
      // Always set fallback data to prevent infinite loading
      setTenantData(user);
      setPayments([]);
      setTickets([]);
      setLeases([]);
    } finally {
      console.log('✨ Setting loading to false');
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchTenantData();
    }
  }, [user, fetchTenantData]);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    try {
      const ticketData = {
        description: ticketForm.description,
        urgency: ticketForm.urgency,
        category: ticketForm.category,
        status: 'Open',
        tenantId: user.id
      };
      
      await ticketAPI.create(ticketData);
      toast.success('Ticket created successfully');
      setShowTicketModal(false);
      setTicketForm({
        description: '',
        urgency: 'Medium',
        category: 'Maintenance'
      });
      fetchTenantData();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Failed to create ticket');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaseInfo = (leaseId) => {
    return leases.find(l => l.leaseId === leaseId);
  };

  const getTotalLeaseAmount = () => {
    return leases.reduce((sum, lease) => sum + (lease.rentAmount || 0), 0);
  };

  const getTotalPaidOnLeases = () => {
    return leases.reduce((sum, lease) => sum + (lease.totalPaid || 0), 0);
  };

  const getTotalBalance = () => {
    return leases.reduce((sum, lease) => sum + (lease.balance || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner text="Loading your dashboard..." />
          {loadingTimeout && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800 mb-3">
                Taking longer than expected? There might be a connection issue.
              </p>
              <button
                onClick={() => {
                  console.log('🚨 Emergency logout triggered');
                  logout();
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Emergency Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tenant Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Tenant'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Home className="h-5 w-5 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="h-5 w-5 inline mr-2" />
              Payments & Leases
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Ticket className="h-5 w-5 inline mr-2" />
              Tickets
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {tenantData?.name || user?.name}</h2>
                    <p className="text-gray-600">Here's your tenant dashboard overview</p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="stat-card border-l-4 border-l-green-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Payments
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {payments.length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="stat-card border-l-4 border-l-blue-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Amount Paid
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          ${getTotalPaidOnLeases().toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="stat-card border-l-4 border-l-purple-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Leases
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {leases.filter(l => l.active || l.status === 'Active').length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="stat-card border-l-4 border-l-yellow-500">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Balance Due
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          ${getTotalBalance().toLocaleString()}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lease Overview */}
              {leases.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Lease Overview</h3>
                  <div className="space-y-4">
                    {leases.map((lease) => (
                      <div key={lease.leaseId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-md font-medium text-gray-900">
                            Lease ${lease.rentAmount?.toLocaleString()}
                          </h4>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lease.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {lease.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Start Date</p>
                            <p className="text-sm font-medium">{new Date(lease.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">End Date</p>
                            <p className="text-sm font-medium">{new Date(lease.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Progress</span>
                            <span className="font-medium">{lease.paymentProgress?.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(lease.paymentProgress || 0, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Paid: ${lease.totalPaid?.toLocaleString()}</span>
                            <span>Balance: ${lease.balance?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </div>
                    <p className="text-gray-900 font-medium">{tenantData?.name || user?.name || 'Not available'}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </div>
                    <p className="text-gray-900 font-medium">{tenantData?.email || user?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone Number
                    </div>
                    <p className="text-gray-900 font-medium">{tenantData?.phoneNumber || 'Not available'}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <User className="h-4 w-4 mr-2" />
                      Tenant ID
                    </div>
                    <p className="text-gray-900 font-medium">{tenantData?.id || user?.id || 'Not available'}</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Payments */}
                <div className="card">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.slice(0, 3).map((payment, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Payment #{payment.paymentID}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(payment.date).toLocaleDateString()}
                              {payment.leaseId && (
                                <span className="ml-2 text-blue-600">• Lease Payment</span>
                              )}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-green-600">
                            ${payment.amount?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No payments recorded yet</p>
                  )}
                </div>

                {/* Recent Tickets */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Tickets</h3>
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      New Ticket
                    </button>
                  </div>
                  {tickets.length > 0 ? (
                    <div className="space-y-3">
                      {tickets.slice(0, 3).map((ticket) => (
                        <div key={ticket.ticketID} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900">
                              Ticket #{ticket.ticketID}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                              {ticket.status || 'Open'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {ticket.description?.substring(0, 80)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-3">No tickets created yet</p>
                      <button
                        onClick={() => setShowTicketModal(true)}
                        className="btn-primary text-sm"
                      >
                        Create Your First Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Payments & Leases
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    View your lease agreements and payment history with balance tracking
                  </p>
                </div>
              </div>

              {/* Lease Summary Cards */}
              {leases.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {leases.map((lease) => (
                    <div key={lease.leaseId} className="card border-l-4 border-l-blue-500">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">
                              Lease Agreement
                            </h3>
                            <p className="text-sm text-gray-500">
                              ${lease.rentAmount?.toLocaleString()} total
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lease.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lease.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Start:</span> {new Date(lease.startDate).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="text-gray-500">End:</span> {new Date(lease.endDate).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Payment Progress</span>
                            <span className="font-medium">{lease.paymentProgress?.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`h-3 rounded-full ${
                                lease.paymentProgress >= 100 ? 'bg-green-500' : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(lease.paymentProgress || 0, 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600 font-medium">
                              Paid: ${lease.totalPaid?.toLocaleString()}
                            </span>
                            <span className={`font-medium ${
                              lease.balance > 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              Balance: ${lease.balance?.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {lease.isOverdue && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-xs text-red-800 font-medium">
                              ⚠️ This lease is overdue
                            </p>
                          </div>
                        )}

                        {lease.isFullyPaid && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                            <p className="text-xs text-green-800 font-medium">
                              ✅ Fully paid
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment History */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                {payments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {payments.map((payment, index) => {
                      const leaseInfo = payment.leaseId ? getLeaseInfo(payment.leaseId) : null;
                      
                      return (
                        <div key={index} className="card hover:shadow-lg transition-shadow">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                leaseInfo ? 'bg-blue-100' : 'bg-green-100'
                              }`}>
                                {leaseInfo ? (
                                  <FileText className="h-6 w-6 text-blue-600" />
                                ) : (
                                  <DollarSign className="h-6 w-6 text-green-600" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-medium text-gray-900">
                                Payment #{payment.paymentID}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                Amount: ${payment.amount?.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-500">
                                Date: {new Date(payment.date).toLocaleDateString()}
                              </p>
                              {leaseInfo && (
                                <p className="text-sm text-blue-600 font-medium mt-1">
                                  Lease: ${leaseInfo.rentAmount?.toLocaleString()} 
                                  (${leaseInfo.balance?.toLocaleString()} remaining)
                                </p>
                              )}
                              {payment.description && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {payment.description}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {leaseInfo && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Lease Progress</span>
                                <span>{leaseInfo.paymentProgress?.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className="bg-blue-600 h-1.5 rounded-full" 
                                  style={{ width: `${Math.min(leaseInfo.paymentProgress || 0, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              leaseInfo ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {leaseInfo ? 'Lease Payment' : 'General Payment'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Your payment history will appear here once payments are recorded.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Support Tickets
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your maintenance requests and support tickets
                  </p>
                </div>
                <div className="mt-4 md:mt-0 md:ml-4">
                  <button
                    onClick={() => setShowTicketModal(true)}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Ticket
                  </button>
                </div>
              </div>

              {tickets.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {tickets.map((ticket) => (
                    <div key={ticket.ticketID} className="card hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Ticket className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900">
                              Ticket #{ticket.ticketID}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {ticket.description?.substring(0, 100)}
                              {ticket.description?.length > 100 && '...'}
                            </p>
                            <div className="mt-2 flex items-center space-x-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                {ticket.status || 'Open'}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(ticket.urgency)}`}>
                                {ticket.urgency || 'Medium'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {ticket.assignedStaff && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500">
                            Assigned to: <span className="font-medium">{ticket.assignedStaff}</span>
                          </p>
                        </div>
                      )}
                      
                      {ticket.resolutionNotes && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Resolution:</strong> {ticket.resolutionNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first support ticket to get help with maintenance issues.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowTicketModal(true)}
                      className="btn-primary"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Create Support Ticket
              </h3>
              
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    required
                    rows={4}
                    className="input-field mt-1"
                    placeholder="Describe the issue you're experiencing..."
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <select
                      className="input-field mt-1"
                      value={ticketForm.urgency}
                      onChange={(e) => setTicketForm({ ...ticketForm, urgency: e.target.value })}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      className="input-field mt-1"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="Maintenance">Maintenance</option>
                      <option value="Repair">Repair</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTicketModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Create Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard; 