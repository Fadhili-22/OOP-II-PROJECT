import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  DollarSign,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit,
  Trash2
} from 'lucide-react';
import { leaseAPI, tenantAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const LeaseManagement = () => {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [filteredLeases, setFilteredLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showScreeningModal, setShowScreeningModal] = useState(false);
  const [selectedLease, setSelectedLease] = useState(null);
  const [leaseAnalytics, setLeaseAnalytics] = useState({});
  const [formData, setFormData] = useState({
    tenantId: '',
    landlordId: '1', // Assuming current landlord ID
    startDate: '',
    endDate: '',
    rentAmount: '',
    status: 'Active'
  });
  const [screeningData, setScreeningData] = useState({
    idNumber: '',
    tenantName: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterLeases();
  }, [searchTerm, leases]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const [
        leasesResponse,
        tenantsResponse,
        analyticsResponse
      ] = await Promise.all([
        leaseAPI.getAll(),
        tenantAPI.getAll(),
        leaseAPI.getLeaseAnalytics()
      ]);

      setLeases(leasesResponse.data);
      setTenants(tenantsResponse.data);
      setLeaseAnalytics(analyticsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load lease data');
    } finally {
      setLoading(false);
    }
  };

  const filterLeases = () => {
    if (!searchTerm) {
      setFilteredLeases(leases);
    } else {
      const filtered = leases.filter(lease =>
        lease.leaseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.tenantId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLeases(filtered);
    }
  };

  const handleAddLease = () => {
    setSelectedLease(null);
    setFormData({
      tenantId: '',
      landlordId: '1',
      startDate: '',
      endDate: '',
      rentAmount: '',
      status: 'Active'
    });
    setShowModal(true);
  };

  const handleEditLease = (lease) => {
    setSelectedLease(lease);
    setFormData({
      tenantId: lease.tenantId || '',
      landlordId: lease.landlordId || '1',
      startDate: lease.startDate ? new Date(lease.startDate).toISOString().split('T')[0] : '',
      endDate: lease.endDate ? new Date(lease.endDate).toISOString().split('T')[0] : '',
      rentAmount: lease.rentAmount || '',
      status: lease.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tenantId || !formData.startDate || !formData.endDate || !formData.rentAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const leaseData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      rentAmount: parseFloat(formData.rentAmount),
      isActive: formData.status === 'Active'
    };

    try {
      if (selectedLease) {
        await leaseAPI.update(selectedLease.leaseId, leaseData);
        toast.success('Lease updated successfully');
      } else {
        await leaseAPI.create(leaseData);
        toast.success('Lease created successfully');
      }
      
      setShowModal(false);
      fetchAllData();
    } catch (error) {
      console.error('Error saving lease:', error);
      toast.error('Failed to save lease');
    }
  };

  const handleDeleteLease = async (leaseId) => {
    if (window.confirm('Are you sure you want to delete this lease?')) {
      try {
        await leaseAPI.delete(leaseId);
        toast.success('Lease deleted successfully');
        fetchAllData();
      } catch (error) {
        console.error('Error deleting lease:', error);
        toast.error('Failed to delete lease');
      }
    }
  };

  const handleRenewLease = async (leaseId) => {
    try {
      await leaseAPI.renew(leaseId);
      toast.success('Lease renewed successfully');
      fetchAllData();
    } catch (error) {
      console.error('Error renewing lease:', error);
      toast.error('Failed to renew lease');
    }
  };

  const handleScreenTenant = async (e) => {
    e.preventDefault();
    
    try {
      const response = await leaseAPI.screenTenant({
        idNumber: screeningData.idNumber,
        tenantName: screeningData.tenantName
      });
      
      toast.success(response.data);
      setShowScreeningModal(false);
      setScreeningData({ idNumber: '', tenantName: '' });
    } catch (error) {
      console.error('Error screening tenant:', error);
      toast.error('Failed to screen tenant');
    }
  };

  const getTenantName = (tenantId) => {
    const tenant = tenants.find(t => t.id?.toString() === tenantId?.toString());
    return tenant ? tenant.name : `Tenant ${tenantId}`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isLeaseExpiring = (endDate) => {
    const end = new Date(endDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return end <= thirtyDaysFromNow && end > new Date();
  };

  const LeaseCard = ({ lease }) => (
    <div className={`card hover:shadow-lg transition-shadow ${
      isLeaseExpiring(lease.endDate) ? 'border-l-4 border-l-yellow-500' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900">
              Lease {lease.leaseId}
            </h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-1" />
                {getTenantName(lease.tenantId)}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                ${lease.rentAmount?.toLocaleString()}/month
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lease.status)}`}>
            {lease.status || 'Active'}
          </span>
          
          <div className="flex items-center space-x-1">
            {lease.isActive && (
              <button
                onClick={() => handleRenewLease(lease.leaseId)}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Renew Lease"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => handleEditLease(lease)}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
              title="Edit Lease"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteLease(lease.leaseId)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete Lease"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLeaseExpiring(lease.endDate) && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
            <span className="text-sm text-yellow-800">
              Lease expires in {Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
            </span>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading lease data..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Lease Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage lease agreements and renewals
          </p>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4 flex space-x-3">
          <button
            onClick={() => setShowScreeningModal(true)}
            className="btn-secondary flex items-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Screen Tenant
          </button>
          <button
            onClick={handleAddLease}
            className="btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Lease
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card border-l-4 border-l-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Leases
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {leaseAnalytics.totalLeases || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Leases
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {leaseAnalytics.activeLeases || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-yellow-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Expiring Soon
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {leases.filter(lease => isLeaseExpiring(lease.endDate)).length}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="stat-card border-l-4 border-l-purple-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Rent
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  ${leases.length > 0 ? 
                    Math.round(leases.reduce((sum, l) => sum + (l.rentAmount || 0), 0) / leases.length).toLocaleString() 
                    : 0}
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
              placeholder="Search leases by ID, tenant, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Leases Grid */}
      {filteredLeases.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredLeases.map((lease) => (
            <LeaseCard key={lease.leaseId} lease={lease} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No leases found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by creating your first lease.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={handleAddLease}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Lease
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Lease Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedLease ? 'Edit Lease' : 'Create New Lease'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tenant</label>
                  <select
                    required
                    className="input-field mt-1"
                    value={formData.tenantId}
                    onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  >
                    <option value="">Select a tenant</option>
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name} - {tenant.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      required
                      className="input-field mt-1"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      required
                      className="input-field mt-1"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monthly Rent</label>
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
                      value={formData.rentAmount}
                      onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="input-field mt-1"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
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
                    {selectedLease ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Screening Modal */}
      {showScreeningModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Screen Tenant
              </h3>
              
              <form onSubmit={handleScreenTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
                  <input
                    type="text"
                    required
                    className="input-field mt-1"
                    value={screeningData.tenantName}
                    onChange={(e) => setScreeningData({ ...screeningData, tenantName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID Number</label>
                  <input
                    type="number"
                    required
                    className="input-field mt-1"
                    placeholder="Enter ID number for screening"
                    value={screeningData.idNumber}
                    onChange={(e) => setScreeningData({ ...screeningData, idNumber: e.target.value })}
                  />
                  <p className="mt-1 text-xs text-gray-500">Even numbers are approved, odd numbers are rejected</p>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowScreeningModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Screen Tenant
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

export default LeaseManagement; 