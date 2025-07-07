import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Ticket, 
  DollarSign, 
  Plus, 
  Eye, 
  AlertCircle,
  TrendingUp,
  Home
} from 'lucide-react';
import { tenantAPI, leaseAPI, ticketAPI, paymentAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Overview = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalTenants: 0,
    activeLeases: 0,
    pendingTickets: 0,
    monthlyRevenue: 0,
    unpaidTenants: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    recentPayments: [],
    recentTickets: [],
    expiringLeases: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        tenantsResponse,
        leasesResponse,
        ticketsResponse,
        paymentsResponse,
        unpaidTenantsResponse,
        leaseAnalytics,
        paymentAnalytics
      ] = await Promise.all([
        tenantAPI.getAll(),
        leaseAPI.getAll(),
        ticketAPI.getAll(),
        paymentAPI.getAll(),
        tenantAPI.getUnpaid(),
        leaseAPI.getLeaseAnalytics(),
        leaseAPI.getPaymentAnalytics()
      ]);

      // Calculate metrics
      const totalTenants = tenantsResponse.data.length;
      const activeLeases = leaseAnalytics.data.activeLeases || 0;
      const pendingTickets = ticketsResponse.data.filter(ticket => 
        ticket.status === 'Open' || ticket.status === 'In Progress'
      ).length;
      const monthlyRevenue = paymentAnalytics.data.totalRentCollected || 0;
      const unpaidTenants = unpaidTenantsResponse.data.length;

      setMetrics({
        totalTenants,
        activeLeases,
        pendingTickets,
        monthlyRevenue,
        unpaidTenants
      });

      // Set recent activity
      setRecentActivity({
        recentPayments: paymentsResponse.data.slice(0, 5),
        recentTickets: ticketsResponse.data.slice(0, 5),
        expiringLeases: leasesResponse.data.filter(lease => {
          const endDate = new Date(lease.endDate);
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          return endDate <= thirtyDaysFromNow && lease.isActive;
        }).slice(0, 5)
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, color, trend, onClick }) => (
    <div 
      className={`stat-card cursor-pointer border-l-4 ${color}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${color.replace('border-l-', 'text-')}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900">
                {typeof value === 'number' && title.includes('Revenue') 
                  ? `$${value.toLocaleString()}` 
                  : value}
              </div>
              {trend && (
                <div className="ml-2 flex items-baseline text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">{trend}</span>
                </div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color }) => (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your properties.
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
          <button
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Tenants"
          value={metrics.totalTenants}
          icon={Users}
          color="border-l-blue-500 text-blue-500"
          onClick={() => window.location.href = '/landlord/tenants'}
        />
        <MetricCard
          title="Active Leases"
          value={metrics.activeLeases}
          icon={FileText}
          color="border-l-green-500 text-green-500"
          onClick={() => window.location.href = '/landlord/leases'}
        />
        <MetricCard
          title="Pending Tickets"
          value={metrics.pendingTickets}
          icon={Ticket}
          color="border-l-yellow-500 text-yellow-500"
          onClick={() => window.location.href = '/landlord/tickets'}
        />
        <MetricCard
          title="Monthly Revenue"
          value={metrics.monthlyRevenue}
          icon={DollarSign}
          color="border-l-purple-500 text-purple-500"
          onClick={() => window.location.href = '/landlord/analytics'}
        />
        <MetricCard
          title="Unpaid Tenants"
          value={metrics.unpaidTenants}
          icon={AlertCircle}
          color="border-l-red-500 text-red-500"
          onClick={() => window.location.href = '/landlord/payments'}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Add New Tenant"
          description="Register a new tenant to the system"
          icon={Plus}
          color="bg-blue-500"
          onClick={() => window.location.href = '/landlord/tenants'}
        />
        <QuickActionCard
          title="Create Lease"
          description="Create a new lease agreement"
          icon={FileText}
          color="bg-green-500"
          onClick={() => window.location.href = '/landlord/leases'}
        />
        <QuickActionCard
          title="View All Tickets"
          description="Manage maintenance requests"
          icon={Ticket}
          color="bg-yellow-500"
          onClick={() => window.location.href = '/landlord/tickets'}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Payments */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Payments</h3>
          {recentActivity.recentPayments.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.recentPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Payment #{payment.paymentID}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    ${payment.amount?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent payments</p>
          )}
        </div>

        {/* Recent Tickets */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Tickets</h3>
          {recentActivity.recentTickets.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.recentTickets.map((ticket) => (
                <div key={ticket.ticketID} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Ticket #{ticket.ticketID}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'Open' ? 'bg-red-100 text-red-800' :
                      ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.description?.substring(0, 50)}...
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No recent tickets</p>
          )}
        </div>

        {/* Expiring Leases */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Expiring Leases</h3>
          {recentActivity.expiringLeases.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.expiringLeases.map((lease) => (
                <div key={lease.leaseId} className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Lease {lease.leaseId}
                    </p>
                    <span className="text-xs text-red-600 font-medium">
                      {new Date(lease.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Tenant ID: {lease.tenantId}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No expiring leases</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview; 