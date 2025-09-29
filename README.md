# Krishna License Management System - Admin Panel

A modern, responsive admin panel for the Krishna License Management System built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Dashboard**: Overview of system statistics and recent activity
- **Subscription Pack Management**: Create, read, update, and delete subscription plans
- **Customer Management**: Manage customer accounts and profiles
- **Subscription Management**: Handle subscription requests with approval workflow
- **Authentication**: Secure admin login with JWT tokens
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live data updates using React Query

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Forms**: React Hook Form with validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📋 Prerequisites

- Node.js 16+ and npm
- The Krishna License Management System backend running on `http://localhost:8080`

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Default Admin Credentials

- **Email**: `admin@example.com`
- **Password**: `admin123`

## 📱 Available Pages

### Dashboard
- System overview with key metrics
- Recent subscription activity
- Pending request alerts
- Quick access to all features

### Subscription Packs
- View all subscription plans
- Create new subscription packs
- Edit existing packs
- Delete packs (soft delete)
- Search and pagination

### Customers
- View all customer accounts
- Create new customers
- Edit customer profiles
- View API keys
- Search and pagination

### Subscriptions
- View all subscription requests
- Approve pending requests
- Assign approved subscriptions
- Unassign active subscriptions
- Filter by status
- Timeline view of subscription lifecycle

## 🎨 UI Components

The admin panel uses a consistent design system with:

- **Cards**: For grouping related content
- **Tables**: For displaying tabular data with sorting and pagination
- **Modals**: For forms and confirmations
- **Badges**: For status indicators
- **Buttons**: With different variants and sizes
- **Forms**: With validation and error handling

## 🔧 Configuration

The admin panel automatically connects to the backend API at `http://localhost:8080`. To change this:

1. Create a `.env` file in the root directory
2. Add: `REACT_APP_API_URL=http://your-backend-url:port`

## 📦 Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App (not recommended)

## 🚀 Deployment

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service

3. **Configure environment variables** for production

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Input validation
- XSS protection
- CSRF protection via same-origin policy

## 📊 API Integration

The admin panel integrates with the following backend endpoints:

- `POST /api/admin/login` - Admin authentication
- `GET /api/v1/profile` - Get admin profile
- `GET /api/v1/packs` - List subscription packs
- `POST /api/v1/packs` - Create subscription pack
- `PUT /api/v1/packs/:id` - Update subscription pack
- `DELETE /api/v1/packs/:id` - Delete subscription pack
- `GET /api/v1/customers` - List customers
- `POST /api/v1/customers` - Create customer
- `PUT /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer
- `GET /api/v1/subscriptions` - List subscriptions
- `PUT /api/v1/subscriptions/:id/approve` - Approve subscription
- `PUT /api/v1/subscriptions/:id/assign` - Assign subscription
- `PUT /api/v1/subscriptions/:id/unassign` - Unassign subscription

## 🐛 Troubleshooting

### Common Issues

1. **Backend not running**: Ensure the license management backend is running on port 8080
2. **CORS errors**: The backend should have CORS enabled for localhost:3000
3. **Authentication issues**: Check that admin credentials are correct
4. **Build errors**: Ensure all dependencies are installed with `npm install`

### Getting Help

- Check the browser console for error messages
- Verify the backend API is accessible
- Ensure all environment variables are set correctly

## 📄 License

This project is part of the Krishna License Management System and follows the same licensing terms.