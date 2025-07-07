import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  FileText, 
  Ticket,
  Calendar,
  PieChart,
  Download
} from 'lucide-react';
import { leaseAPI, tenantAPI, ticketAPI, paymentAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    leaseAnalytics: {},
    paymentAnalytics: {},
    ticketStats: {},
    tenantStats: {}
  });
  const [chartData, setChartData] = useState({
    paymentTrends: [],
    leaseDistribution: [],
    ticketsByStatus: [],
    monthlyRevenue: []
  });

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      
      const [
        leaseAnalyticsResponse,
        paymentAnalyticsResponse,
        tenantsResponse,
        ticketsResponse,
        paymentsResponse,
        leasesResponse
      ] = await Promise.all([
        leaseAPI.getLeaseAnalytics(),
        leaseAPI.getPaymentAnalytics(),
        tenantAPI.getAll(),
        ticketAPI.getAll(),
        paymentAPI.getAll(),
        leaseAPI.getAll()
      ]);

      const tenants = tenantsResponse.data;
      const tickets = ticketsResponse.data;
      const payments = paymentsResponse.data;
      const leases = leasesResponse.data;

      // Process analytics data
      const leaseAnalytics = leaseAnalyticsResponse.data;
      const paymentAnalytics = paymentAnalyticsResponse.data;
      
      // Calculate additional stats
      const ticketStats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'Open').length,
        inProgress: tickets.filter(t => t.status === 'In Progress').length,
        resolved: tickets.filter(t => t.status === 'Resolved').length,
        avgResolutionTime: '2.5 days' // This would be calculated from actual data
      };

      const tenantStats = {
        total: tenants.length,
        withPayments: tenants.filter(t => t.payments && t.payments.length > 0).length,
        withoutPayments: tenants.filter(t => !t.payments || t.payments.length === 0).length,
        activeLeases: leases.filter(l => l.isActive).length
      };

      setAnalytics({
        leaseAnalytics,
        paymentAnalytics,
        ticketStats,
        tenantStats
      });

      // Prepare chart data
      prepareChartData(payments, tickets, leases);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const prepareChartData = (payments, tickets, leases) => {
    // Real payment trends - group payments by month
    const paymentsByMonth = payments.reduce((acc, payment) => {
      const month = new Date(payment.date).toLocaleDateString('en-US', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { amount: 0, count: 0 };
      }
      acc[month].amount += payment.amount || 0;
      acc[month].count += 1;
      return acc;
    }, {});

    const paymentTrends = Object.entries(paymentsByMonth).map(([month, data]) => ({
      month,
      amount: data.amount,
      count: data.count
    }));

    // Lease distribution by status
    const activeLeases = leases.filter(l => l.isActive).length;
    const expiredLeases = leases.filter(l => !l.isActive).length;
    const leaseDistribution = [
      { name: 'Active', value: activeLeases, color: '#10B981' },
      { name: 'Expired', value: expiredLeases, color: '#EF4444' }
    ];

    // Tickets by status
    const ticketsByStatus = [
      { status: 'Open', count: tickets.filter(t => t.status === 'Open').length },
      { status: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length },
      { status: 'Resolved', count: tickets.filter(t => t.status === 'Resolved').length },
      { status: 'Closed', count: tickets.filter(t => t.status === 'Closed').length }
    ];

    // Real monthly revenue from payments
    const monthlyRevenue = Object.entries(paymentsByMonth).map(([month, data]) => ({
      month,
      revenue: data.amount,
      payments: data.count
    }));

    setChartData({
      paymentTrends,
      leaseDistribution,
      ticketsByStatus,
      monthlyRevenue
    });
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
    <div className={`stat-card border-l-4 ${color}`}>
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
            {subtitle && (
              <dd className="text-sm text-gray-500">{subtitle}</dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Analytics & Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Insights into your property management
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${analytics.paymentAnalytics.totalRentCollected?.toLocaleString() || 0}`}
          subtitle="All time collected"
          icon={DollarSign}
          color="border-l-green-500 text-green-500"
          trend="+12%"
        />
        <StatCard
          title="Active Tenants"
          value={analytics.tenantStats.withPayments || 0}
          subtitle={`${analytics.tenantStats.total || 0} total tenants`}
          icon={Users}
          color="border-l-blue-500 text-blue-500"
        />
        <StatCard
          title="Active Leases"
          value={analytics.leaseAnalytics.activeLeases || 0}
          subtitle={`${analytics.leaseAnalytics.totalLeases || 0} total leases`}
          icon={FileText}
          color="border-l-purple-500 text-purple-500"
        />
        <StatCard
          title="Open Tickets"
          value={analytics.ticketStats.open || 0}
          subtitle={`${analytics.ticketStats.total || 0} total tickets`}
          icon={Ticket}
          color="border-l-red-500 text-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Trends */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.paymentTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'amount' ? `$${value.toLocaleString()}` : value,
                name === 'amount' ? 'Revenue' : 'Payment Count'
              ]} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Revenue"
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Payments"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Lease Distribution */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lease Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip />
              <Legend />
              <RechartsPieChart data={chartData.leaseDistribution}>
                {chartData.leaseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Status */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.ticketsByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Revenue */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue & Payment Count</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="payments" fill="#EF4444" name="Payments" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tenant Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tenants</span>
              <span className="font-medium">{analytics.tenantStats.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">With Payments</span>
              <span className="font-medium text-green-600">{analytics.tenantStats.withPayments || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">No Payments</span>
              <span className="font-medium text-red-600">{analytics.tenantStats.withoutPayments || 0}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Payment Rate</span>
                <span className="font-bold text-green-600">
                  {analytics.tenantStats.total > 0 
                    ? Math.round((analytics.tenantStats.withPayments / analytics.tenantStats.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ticket Performance */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tickets</span>
              <span className="font-medium">{analytics.ticketStats.total || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Open</span>
              <span className="font-medium text-red-600">{analytics.ticketStats.open || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="font-medium text-yellow-600">{analytics.ticketStats.inProgress || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Resolved</span>
              <span className="font-medium text-green-600">{analytics.ticketStats.resolved || 0}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Resolution Rate</span>
                <span className="font-bold text-green-600">
                  {analytics.ticketStats.total > 0 
                    ? Math.round((analytics.ticketStats.resolved / analytics.ticketStats.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Collected</span>
              <span className="font-medium text-green-600">
                ${analytics.paymentAnalytics.totalRentCollected?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Unpaid Tenants</span>
              <span className="font-medium text-red-600">{analytics.paymentAnalytics.unpaidTenants || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Tenants</span>
              <span className="font-medium">{analytics.tenantStats.total || 0}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">Collection Rate</span>
                <span className="font-bold text-green-600">
                  {analytics.tenantStats.total > 0 
                    ? Math.round((analytics.tenantStats.withPayments / analytics.tenantStats.total) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 