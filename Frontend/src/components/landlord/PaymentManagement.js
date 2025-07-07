import React, { useState, useEffect, useCallback } from 'react';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  BarChart3
} from 'lucide-react';
import { paymentAPI, tenantAPI, leaseAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [unpaidTenants, setUnpaidTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [paymentAnalytics, setPaymentAnalytics] = useState({});
  const [formData, setFormData] = useState({
    tenantId: '',
    leaseId: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const filterPayments = useCallback(() => {
    if (!searchTerm) {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter(payment =>
        payment.paymentID?.toString().includes(searchTerm) ||
        payment.amount?.toString().includes(searchTerm) ||
        getTenantName(payment.tenantId).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPayments(filtered);
    }
  }, [searchTerm, payments]);

  useEffect(() => {
    filterPayments();
  }, [filterPayments]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [
        paymentsResponse,
        tenantsResponse,
        leasesResponse,
        unpaidTenantsResponse,
        analyticsResponse
      ] = await Promise.all([
        paymentAPI.getAll(),
        tenantAPI.getAll(),
        leaseAPI.getAll(),
        tenantAPI.getUnpaid(),
        leaseAPI.getPaymentAnalytics().catch(() => ({ data: {} }))
      ]);

      setPayments(paymentsResponse.data);
      setTenants(tenantsResponse.data);
      setLeases(leasesResponse.data);
      setUnpaidTenants(unpaidTenantsResponse.data);
      setPaymentAnalytics(analyticsResponse.data || {});
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = () => {
    setFormData({
      tenantId: '',
      leaseId: '',
      amount: '',
      description: ''
    });
    setShowModal(true);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!formData.tenantId || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let paymentData;
      
      if (formData.leaseId) {
        // Create payment linked to lease using the special endpoint
        paymentData = {
          tenantId: parseInt(formData.tenantId),
          leaseId: formData.leaseId,
          amount: parseFloat(formData.amount),
          description: formData.description || `Payment for lease ${formData.leaseId}`
        };
        
        await paymentAPI.createForLease(paymentData);
        toast.success('Payment recorded and linked to lease successfully');
      } else {
        // Create regular payment not linked to lease
        paymentData = {
          tenantId: parseInt(formData.tenantId),
          amount: parseFloat(formData.amount),
          date: new Date().toISOString(),
          description: formData.description || `Payment from tenant ${formData.tenantId}`
        };
        
        await paymentAPI.create(paymentData);
        toast.success('Payment recorded successfully');
      }
      
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      console.error('Error recording payment:', error);
      if (error.response?.status === 500) {
        toast.error('Server error. Please try again.');
      } else {
        toast.error('Failed to record payment');
      }
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentAPI.delete(paymentId);
        toast.success('Payment deleted successfully');
        fetchAllData();
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast.error('Failed to delete payment');
      }
    }
  };

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    return tenant ? tenant.name : `Tenant ${tenantId}`;
  };

  const getLeaseInfo = (leaseId) => {
    return leases.find(l => l.leaseId === leaseId);
  };

  const getTenantLeases = (tenantId) => {
    return leases.filter(l => l.tenantId === parseInt(tenantId));
  };

  const PaymentCard = ({ payment }) => {
    const leaseInfo = payment.leaseId ? getLeaseInfo(payment.leaseId) : null;
    
    return (
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                leaseInfo ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {leaseInfo ? (
                  <FileText className={`h-6 w-6 ${leaseInfo ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <DollarSign className="h-6 w-6 text-green-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900">
                Payment #{payment.paymentID}
              </h3>
              <div className="mt-1 space-y-1">
                <div className="text-sm text-gray-500">
                  Tenant: {getTenantName(payment.tenantId)}
                </div>
                <div className="text-sm text-gray-500">
                  Amount: ${payment.amount?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">
                  Date: {new Date(payment.date).toLocaleDateString()}
                </div>
                {leaseInfo && (
                  <div className="text-sm text-blue-600 font-medium">
                    Lease: ${leaseInfo.rentAmount?.toLocaleString()} 
                    (${leaseInfo.balance?.toLocaleString()} remaining)
                  </div>
                )}
                {payment.description && (
                  <div className="text-sm text-gray-500">
                    {payment.description}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDeletePayment(payment.paymentID)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Payment"
            >
              <AlertCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {leaseInfo && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Payment Progress</span>
              <span className="text-xs text-gray-500">
                {leaseInfo.paymentProgress?.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(leaseInfo.paymentProgress || 0, 100)}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>Paid: ${leaseInfo.totalPaid?.toLocaleString()}</span>
              <span>Total: ${leaseInfo.rentAmount?.toLocaleString()}</span>
            </div>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              {new Date(payment.date).toLocaleString()}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              leaseInfo ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
              {leaseInfo ? 'Lease Payment' : 'General Payment'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const UnpaidTenantCard = ({ tenant }) => (
    <div className="card border-l-4 border-l-red-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <User className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">{tenant.name}</h4>
            <p className="text-xs text-gray-500">{tenant.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormData({
              tenantId: tenant.id,
              leaseId: '',
              amount: '',
              description: `Payment for ${tenant.name}`
            });
            setShowModal(true);
          }}
          className="btn-primary text-xs py-1 px-2"
        >
          Add Payment
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading payment data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Payment Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage all rental payments with lease balance tracking
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
          <button
            onClick={handleAddPayment}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Record Payment
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card border-l-4 border-l-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Collected
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  ${paymentAnalytics.totalRentCollected?.toLocaleString() || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-blue-500" />
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

        <div className="stat-card border-l-4 border-l-red-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Unpaid Tenants
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {paymentAnalytics.unpaidTenants || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-purple-500" />
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
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search payments by ID, amount, or tenant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Unpaid Tenants Section */}
      {unpaidTenants.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-lg font-medium text-red-900">
              Tenants with No Payments ({unpaidTenants.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unpaidTenants.map((tenant) => (
              <UnpaidTenantCard key={tenant.id} tenant={tenant} />
            ))}
          </div>
        </div>
      )}

      {/* Payments Grid */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          All Payments ({filteredPayments.length})
        </h3>
        
        {filteredPayments.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPayments.map((payment) => (
              <PaymentCard key={payment.paymentID} payment={payment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Start by recording the first payment.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleAddPayment}
                  className="btn-primary"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Record Payment
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Record New Payment
              </h3>
              
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tenant</label>
                  <select
                    required
                    className="input-field mt-1"
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value, leaseId: '' })}
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.email}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.tenantId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Lease (Optional - for balance tracking)
                    </label>
                    <select
                      className="input-field mt-1"
                      value={formData.leaseId}
                      onChange={(e) => setFormData({ ...formData, leaseId: e.target.value })}
                    >
                      <option value="">Select a lease (optional)</option>
                      {getTenantLeases(formData.tenantId).map((lease) => (
                        <option key={lease.leaseId} value={lease.leaseId}>
                          ${lease.rentAmount?.toLocaleString()} lease - 
                          ${lease.balance?.toLocaleString()} remaining 
                          ({lease.paymentProgress?.toFixed(1)}% paid)
                        </option>
                      ))}
                    </select>
                    {formData.leaseId && (
                      <p className="mt-1 text-xs text-blue-600">
                        Payment will be tracked against this lease for balance calculation
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      className="input-field pl-7"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                  <textarea
                    rows={3}
                    className="input-field mt-1"
                    placeholder="Payment description or notes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Record Payment
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

export default PaymentManagement; 