import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'badge-success';
    case 'requested':
      return 'badge-warning';
    case 'approved':
      return 'badge-info';
    case 'inactive':
    case 'expired':
      return 'badge-danger';
    default:
      return 'badge-gray';
  }
}

export function getStatusText(status: string): string {
  switch (status) {
    case 'requested':
      return 'Requested';
    case 'approved':
      return 'Approved';
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'expired':
      return 'Expired';
    default:
      return status;
  }
}
