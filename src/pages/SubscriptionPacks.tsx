import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { apiClient } from '../lib/api';
import { SubscriptionPack, SubscriptionPackRequest } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  DollarSign,
  Calendar,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SubscriptionPacks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<SubscriptionPack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['subscription-packs', currentPage, searchTerm],
    () => apiClient.getSubscriptionPacks({
      page: currentPage,
      limit: 10,
      search: searchTerm || undefined,
    })
  );

  const createMutation = useMutation((data: SubscriptionPackRequest) => {
    console.log('🔍 API Client check:', apiClient);
    console.log('🔍 API Client method check:', apiClient?.createSubscriptionPack);
    return apiClient.createSubscriptionPack(data);
  }, {
    onSuccess: (data) => {
      console.log('✅ Create mutation success:', data);
      queryClient.invalidateQueries('subscription-packs');
      setIsModalOpen(false);
      reset(); // Reset form after successful creation
      toast.success('Subscription pack created successfully!');
    },
    onError: (error: any) => {
      console.error('❌ Create mutation error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to create subscription pack';
      
      toast.error(`Error: ${errorMessage}`);
    },
    onMutate: (data) => {
      console.log('🔄 Creating subscription pack with data:', data);
    }
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: SubscriptionPackRequest }) =>
      apiClient.updateSubscriptionPack(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('subscription-packs');
        setIsModalOpen(false);
        setEditingPack(null);
        toast.success('Subscription pack updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to update subscription pack');
      },
    }
  );

  const deleteMutation = useMutation(apiClient.deleteSubscriptionPack, {
    onSuccess: () => {
      queryClient.invalidateQueries('subscription-packs');
      toast.success('Subscription pack deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete subscription pack');
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionPackRequest>();

  const onSubmit = (data: SubscriptionPackRequest) => {
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    
    // Ensure price and validity_months are numbers
    const cleanData = {
      ...data,
      price: parseFloat(data.price.toString()),
      validity_months: parseInt(data.validity_months.toString())
    };
    
    console.log('Clean data:', cleanData);
    
    if (editingPack) {
      updateMutation.mutate({ id: editingPack.id, data: cleanData });
    } else {
      createMutation.mutate(cleanData);
    }
  };

  const onFormError = (errors: any) => {
    console.log('Form validation errors:', errors);
    toast.error('Please fix the form errors before submitting');
  };

  const handleEdit = (pack: SubscriptionPack) => {
    setEditingPack(pack);
    reset({
      name: pack.name,
      description: pack.description || '',
      sku: pack.sku,
      price: pack.price,
      validity_months: pack.validity_months,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this subscription pack?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPack(null);
    reset();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingPack(null);
    reset();
  };

  const packs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Packs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage subscription plans and pricing
          </p>
        </div>
        <button
          onClick={handleOpenModal}
          className="btn btn-primary btn-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Pack
        </button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search packs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pack Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  </td>
                </tr>
              ) : packs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No subscription packs</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating a new subscription pack.
                    </p>
                  </td>
                </tr>
              ) : (
                packs.map((pack) => (
                  <tr key={pack.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{pack.name}</div>
                        <div className="text-sm text-gray-500">{pack.description || 'No description'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Tag className="h-3 w-3 mr-1" />
                        {pack.sku}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        {formatCurrency(pack.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        {pack.validity_months} month{pack.validity_months !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(pack.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(pack)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pack.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPack ? 'Edit Subscription Pack' : 'Create Subscription Pack'}
              </h3>
              <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="input mt-1"
                    placeholder="Premium Plan"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    className="input mt-1"
                    rows={3}
                    placeholder="Plan description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU *
                  </label>
                  <input
                    {...register('sku', { required: 'SKU is required' })}
                    className="input mt-1"
                    placeholder="premium-plan"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price *
                    </label>
                    <input
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price must be positive' }
                      })}
                      type="number"
                      step="0.01"
                      className="input mt-1"
                      placeholder="29.99"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Validity (months) *
                    </label>
                    <input
                      {...register('validity_months', { 
                        required: 'Validity is required',
                        min: { value: 1, message: 'Must be at least 1 month' },
                        max: { value: 12, message: 'Must be at most 12 months' }
                      })}
                      type="number"
                      min="1"
                      max="12"
                      className="input mt-1"
                      placeholder="6"
                    />
                    {errors.validity_months && (
                      <p className="mt-1 text-sm text-red-600">{errors.validity_months.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="btn btn-secondary btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="btn btn-primary btn-md"
                  >
                    {createMutation.isLoading || updateMutation.isLoading
                      ? 'Saving...'
                      : editingPack
                      ? 'Update'
                      : 'Create'}
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

export default SubscriptionPacks;
