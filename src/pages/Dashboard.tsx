import React from 'react';
import { useQuery } from 'react-query';
import { apiClient } from '../lib/api';
import { Users, Package, FileText, CheckCircle, Clock } from 'lucide-react';
import { formatDate, formatCurrency, getStatusColor, getStatusText } from '../lib/utils';

const Dashboard: React.FC = () => {
  const { data: packsData } = useQuery('subscription-packs', () =>
    apiClient.getSubscriptionPacks({ limit: 5 })
  );

  const { data: customersData } = useQuery('customers', () =>
    apiClient.getCustomers({ limit: 5 })
  );

  const { data: subscriptionsData } = useQuery('subscriptions', () =>
    apiClient.getSubscriptions({ limit: 10 })
  );

  const stats = [
    {
      name: 'Total Customers',
      value: customersData?.pagination?.total || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Subscription Packs',
      value: packsData?.pagination?.total || 0,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'Total Subscriptions',
      value: subscriptionsData?.pagination?.total || 0,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Active Subscriptions',
      value: subscriptionsData?.data?.filter(sub => sub.status === 'active').length || 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  const recentSubscriptions = subscriptionsData?.data?.slice(0, 5) || [];
  const pendingRequests = subscriptionsData?.data?.filter(sub => sub.status === 'requested').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your license management system
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Requests Alert */}
      {pendingRequests > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Pending Subscription Requests
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  You have {pendingRequests} subscription request{pendingRequests !== 1 ? 's' : ''} waiting for approval.
                  <a href="/subscriptions" className="font-medium underline text-yellow-800 hover:text-yellow-900 ml-1">
                    Review them now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Subscriptions */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Recent Subscriptions</h3>
          </div>
          <div className="card-content">
            {recentSubscriptions.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentSubscriptions.map((subscription) => (
                    <li key={subscription.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {subscription.customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {subscription.customer.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {subscription.pack.name}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <span className={`badge ${getStatusColor(subscription.status)}`}>
                            {getStatusText(subscription.status)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(subscription.created_at)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating subscription packs.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subscription Packs Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Subscription Packs</h3>
          </div>
          <div className="card-content">
            {packsData?.data && packsData.data.length > 0 ? (
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {packsData.data.map((pack) => (
                    <li key={pack.id} className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {pack.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {pack.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(pack.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pack.validity_months} month{pack.validity_months !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-6">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No subscription packs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create your first subscription pack to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
