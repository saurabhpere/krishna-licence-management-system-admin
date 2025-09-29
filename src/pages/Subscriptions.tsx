import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiClient } from '../lib/api';
import { Subscription } from '../types';
import { formatDate, formatCurrency, getStatusColor, getStatusText } from '../lib/utils';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Package,
  Calendar,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Subscriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['subscriptions', currentPage, searchTerm, statusFilter],
    () => apiClient.getSubscriptions({
      page: currentPage,
      limit: 10,
      search: searchTerm || undefined,
    })
  );

  const approveMutation = useMutation((id: number) => apiClient.approveSubscription(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      toast.success('Subscription approved successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to approve subscription');
    },
  });

  const assignMutation = useMutation((id: number) => apiClient.assignSubscription(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      toast.success('Subscription assigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to assign subscription');
    },
  });

  const approveAndAssign = useMutation(
    async (id: number) => {
      await apiClient.approveSubscription(id);
      return await apiClient.assignSubscription(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subscriptions']);
        toast.success('Approved and assigned successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to approve and assign');
      },
    }
  );

  const unassignMutation = useMutation((id: number) => apiClient.unassignSubscription(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      toast.success('Subscription unassigned successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to unassign subscription');
    },
  });

  const handleApprove = (id: number) => {
    if (window.confirm('Are you sure you want to approve this subscription?')) {
      approveMutation.mutate(id);
    }
  };

  const handleAssign = (id: number) => {
    if (window.confirm('Are you sure you want to assign this subscription?')) {
      assignMutation.mutate(id);
    }
  };

  const handleUnassign = (id: number) => {
    if (window.confirm('Are you sure you want to unassign this subscription?')) {
      unassignMutation.mutate(id);
    }
  };

  const subscriptions = data?.data || [];
  const pagination = data?.pagination;

  const filteredSubscriptions = subscriptions.filter(subscription => {
    if (statusFilter && subscription.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const getActionButton = (subscription: Subscription) => {
    switch (subscription.status) {
      case 'requested':
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleApprove(subscription.id)}
              disabled={approveMutation.isLoading}
              className="btn btn-secondary btn-sm flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve
            </button>
            <button
              onClick={() => approveAndAssign.mutate(subscription.id)}
              disabled={approveAndAssign.isLoading}
              className="btn btn-primary btn-sm flex items-center"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve + Assign
            </button>
          </div>
        );
      case 'approved':
        return (
          <button
            onClick={() => handleAssign(subscription.id)}
            disabled={assignMutation.isLoading}
            className="btn btn-primary btn-sm flex items-center"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Assign
          </button>
        );
      case 'active':
        return (
          <button
            onClick={() => handleUnassign(subscription.id)}
            disabled={unassignMutation.isLoading}
            className="btn btn-danger btn-sm flex items-center"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Unassign
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage subscription requests and assignments
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All Statuses</option>
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription Pack
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      No subscriptions match your current filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {subscription.customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subscription.customer.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {subscription.customer.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.pack.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Package className="h-3 w-3 mr-1" />
                          {subscription.pack.sku}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(subscription.pack.price)} / {subscription.pack.validity_months} month{subscription.pack.validity_months !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`badge ${getStatusColor(subscription.status)}`}>
                        {getStatusText(subscription.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Requested: {formatDate(subscription.requested_at)}
                        </div>
                        {subscription.approved_at && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            Approved: {formatDate(subscription.approved_at)}
                          </div>
                        )}
                        {subscription.assigned_at && (
                          <div className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-blue-500" />
                            Assigned: {formatDate(subscription.assigned_at)}
                          </div>
                        )}
                        {subscription.expires_at && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1 text-orange-500" />
                            Expires: {formatDate(subscription.expires_at)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {getActionButton(subscription)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                disabled={currentPage === pagination.total_pages}
                className="btn btn-secondary btn-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(currentPage - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="btn btn-secondary btn-sm disabled:opacity-50 rounded-l-md"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.total_pages, prev + 1))}
                    disabled={currentPage === pagination.total_pages}
                    className="btn btn-secondary btn-sm disabled:opacity-50 rounded-r-md"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
