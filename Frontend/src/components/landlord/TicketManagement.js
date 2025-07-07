import React, { useState, useEffect, useCallback } from 'react';
import { 
  Ticket, 
  Search, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  MessageSquare
} from 'lucide-react';
import { ticketAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const filterTickets = useCallback(() => {
    let filtered = tickets;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.ticketID?.toString().includes(searchTerm) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => 
        ticket.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, tickets]);

  useEffect(() => {
    filterTickets();
  }, [filterTickets]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getAll();
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketAPI.delete(ticketId);
        toast.success('Ticket deleted successfully');
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
        toast.error('Failed to delete ticket');
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    try {
      await ticketAPI.updateStatus(selectedTicket.ticketID, newStatus);
      toast.success('Status updated successfully');
      setShowStatusModal(false);
      setNewStatus('');
      fetchTickets();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddResolution = async (e) => {
    e.preventDefault();
    
    try {
      await ticketAPI.addResolution(selectedTicket.ticketID, resolutionNotes);
      toast.success('Resolution notes added successfully');
      setShowResolutionModal(false);
      setResolutionNotes('');
      fetchTickets();
    } catch (error) {
      console.error('Error adding resolution:', error);
      toast.error('Failed to add resolution');
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

  const getTicketStats = () => {
    const total = tickets.length;
    const open = tickets.filter(t => t.status === 'Open').length;
    const inProgress = tickets.filter(t => t.status === 'In Progress').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    
    return { total, open, inProgress, resolved };
  };

  const stats = getTicketStats();

  const TicketCard = ({ ticket }) => (
    <div className="card hover:shadow-lg transition-shadow">
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
              {ticket.category && (
                <span className="text-xs text-gray-500">
                  {ticket.category}
                </span>
              )}
              {ticket.tenantId && (
                <span className="text-xs text-blue-600">
                  Tenant ID: {ticket.tenantId}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => {
                setSelectedTicket(ticket);
                setNewStatus(ticket.status || 'Open');
                setShowStatusModal(true);
              }}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Update Status"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setSelectedTicket(ticket);
                setResolutionNotes(ticket.resolutionNotes || '');
                setShowResolutionModal(true);
              }}
              className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
              title="Add Resolution"
            >
              <MessageSquare className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteTicket(ticket.ticketID)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete Ticket"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {ticket.resolutionNotes && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="p-2 bg-green-50 rounded text-sm">
            <strong>Resolution:</strong> {ticket.resolutionNotes}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <LoadingSpinner text="Loading tickets..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Ticket Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review and manage tenant maintenance requests
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card border-l-4 border-l-blue-500">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Ticket className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Tickets
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.total}
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
                  Open
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.open}
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
                  In Progress
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.inProgress}
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
                  Resolved
                </dt>
                <dd className="text-2xl font-semibold text-gray-900">
                  {stats.resolved}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search tickets by ID, description, or staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tickets Grid */}
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.ticketID} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Ticket className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tickets found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Tickets created by tenants will appear here for you to review and manage.'}
          </p>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Update Status - Ticket #{selectedTicket?.ticketID}
              </h3>
              
              <form onSubmit={handleUpdateStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    required
                    className="input-field mt-1"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowStatusModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Update Status
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Resolution Modal */}
      {showResolutionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Add Resolution - Ticket #{selectedTicket?.ticketID}
              </h3>
              
              <form onSubmit={handleAddResolution} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Resolution Notes</label>
                  <textarea
                    required
                    rows={4}
                    className="input-field mt-1"
                    placeholder="Describe how the issue was resolved..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResolutionModal(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Add Resolution
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

export default TicketManagement; 