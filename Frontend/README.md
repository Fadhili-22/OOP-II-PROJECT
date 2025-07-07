# Tenant Management System - Frontend

A comprehensive React-based frontend for managing tenant relationships, lease agreements, payments, and support tickets with **dynamic lease balance tracking**.

## 🚀 Key Features

### 🆕 **Dynamic Lease Balance Tracking**
- **Real-time payment progress** against lease amounts
- **Balance visualization** with progress bars and percentage indicators
- **Payment linking** to specific lease agreements
- **Automatic balance calculation** (Balance = Lease Amount - Total Paid)
- **Visual status indicators** for fully paid and overdue leases

### 🏠 **Multi-Role Dashboard System**
- **Landlord Portal**: Full management capabilities with analytics
- **Tenant Portal**: View-only access with ticket creation
- **Role-based authentication** and secure routing

### 💰 **Enhanced Payment Management**
- **Lease-linked payments** for balance tracking
- **General payments** for non-lease transactions
- **Payment history** with lease context
- **Search and filtering** by tenant, amount, or payment ID
- **Visual payment cards** with lease information

### 🎫 **Support Ticket System**
- **Tenant ticket creation** with urgency and category
- **Landlord ticket management** with status updates
- **Staff assignment** and resolution tracking
- **Real-time status updates** and notifications

### 📊 **Analytics & Reporting**
- **Payment analytics** across all leases
- **Lease performance tracking** with progress indicators
- **Unpaid tenant identification** and quick actions
- **Dashboard overview** with key metrics

## 🏗️ Architecture

### Technology Stack
- **React 18** with functional components and hooks
- **Tailwind CSS** for responsive, modern UI design
- **Lucide React** for consistent iconography
- **Recharts** for data visualization and analytics
- **Axios** for API communication
- **React Router** for navigation and routing
- **React Hot Toast** for user notifications
- **Context API** for authentication state management

### Component Structure
```
src/
├── components/
│   ├── auth/
│   │   └── Login.js                    # Role-based authentication
│   ├── landlord/
│   │   ├── LandlordDashboard.js        # Main landlord layout
│   │   ├── Overview.js                 # Dashboard metrics & analytics
│   │   ├── TenantManagement.js         # CRUD operations for tenants
│   │   ├── PaymentManagement.js        # 🆕 Enhanced with lease tracking
│   │   ├── LeaseManagement.js          # Lease agreements & renewals
│   │   ├── TicketManagement.js         # Support ticket management
│   │   └── Analytics.js               # Charts and reporting
│   ├── tenant/
│   │   └── TenantDashboard.js          # 🆕 Enhanced with lease overview
│   └── common/
│       └── LoadingSpinner.js           # Reusable loading component
├── contexts/
│   └── AuthContext.js                  # Authentication state management
├── services/
│   └── api.js                          # 🆕 Enhanced with lease endpoints
└── styles/
    └── index.css                       # Tailwind configuration
```

## 🆕 New Features & Enhancements

### Enhanced Payment Management
The payment system now supports **lease-based tracking**:

#### **Landlord Payment Features:**
- **Lease Selection**: When recording payments, landlords can link them to specific leases
- **Balance Display**: Each payment card shows remaining lease balance
- **Progress Visualization**: Interactive progress bars showing payment completion
- **Smart Filtering**: Search by tenant name, payment ID, or amount
- **Payment Types**: Visual distinction between lease payments and general payments

#### **Tenant Payment View:**
- **Lease Overview Cards**: Visual representation of lease agreements with payment progress
- **Payment History**: Enhanced view showing which payments are linked to leases
- **Balance Tracking**: Real-time display of remaining balance on lease agreements
- **Progress Indicators**: Percentage-based progress bars and status indicators

### Enhanced Dashboards

#### **Landlord Dashboard Updates:**
- **Active Leases Counter**: Replaces average payment with lease count
- **Enhanced Payment Cards**: Show lease information and balance
- **Lease Selection Modal**: Dropdown with lease details when recording payments
- **Analytics Integration**: Real payment data from lease tracking

#### **Tenant Dashboard Updates:**
- **Lease Overview Section**: Detailed view of tenant's lease agreements
- **Balance Due Widget**: Shows total remaining balance across all leases
- **Payment Progress**: Visual progress bars for each lease
- **Enhanced Payment History**: Shows lease linkage and progress

## 🔐 Authentication & Roles

### Landlord Access (`admin@gmail.com` / `admin123`)
- **Full Management Rights**: Create, read, update, delete for all entities
- **Payment Recording**: Link payments to leases for balance tracking
- **Tenant Management**: Complete CRUD operations
- **Lease Management**: Create and manage lease agreements
- **Ticket Management**: View, assign, and resolve support tickets
- **Analytics Access**: Comprehensive reporting and analytics

### Tenant Access
- **Ramadhan**: `ramadhan@gmail.com` / `Ramadhan123` (ID: 2)
- **Onyi**: `onyi@gmail.com` / `Onyi123` (ID: 3)

**Tenant Capabilities:**
- **View-Only Data**: Personal information, payment history, lease details
- **Lease Overview**: Real-time balance and payment progress
- **Ticket Creation**: Submit support requests with urgency and category
- **Payment History**: View linked payments with lease context

## 📋 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Backend API** running on `http://localhost:8082`

### Installation Steps
```bash
# Clone the repository
git clone <repository-url>
cd Frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The application will be available at `http://localhost:3000`

### Environment Configuration
The frontend is configured to connect to the backend API at:
```
http://localhost:8082/api
```

## 🎨 UI/UX Features

### Design System
- **Modern Card-Based Layout**: Clean, organized information presentation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Consistent Color Coding**: 
  - 🟢 Green: Payments and completed items
  - 🔵 Blue: Lease-related information
  - 🟡 Yellow: Warnings and pending items
  - 🔴 Red: Overdue items and errors
  - 🟣 Purple: Analytics and statistics

### Interactive Elements
- **Progress Bars**: Visual payment progress with smooth animations
- **Status Badges**: Color-coded status indicators for tickets and leases
- **Search & Filter**: Real-time filtering with instant results
- **Modal Forms**: User-friendly forms with validation
- **Toast Notifications**: Non-intrusive success/error messages

## 🔄 API Integration

### Enhanced API Services
The frontend communicates with the backend through enhanced API services:

```javascript
// Lease-based payment endpoints
paymentAPI.createForLease(paymentData)    // Create lease-linked payment
paymentAPI.getByLease(leaseId)            // Get payments for lease
paymentAPI.getLeasePaymentSummary(leaseId) // Get comprehensive summary

// Enhanced lease endpoints
leaseAPI.getAll()                         // Get all leases with balance data
leaseAPI.getPaymentAnalytics()            // Get payment analytics
```

### Real-Time Data Updates
- **Automatic Refresh**: Data updates after successful operations
- **Optimistic Updates**: Immediate UI feedback before API confirmation
- **Error Handling**: Graceful degradation with user-friendly error messages
- **Loading States**: Visual feedback during API operations

## 📊 Payment Tracking Examples

### Example: Ramadhan's Lease Tracking
```
Lease Agreement: $30,000
Payments Made: $20,000
Balance Remaining: $10,000
Payment Progress: 66.7%
Status: Active (Not Fully Paid)
```

### Visual Indicators
- **Progress Bar**: 66.7% filled with blue color
- **Balance Display**: "$10,000 remaining" in red text
- **Payment Badge**: "Lease Payment" in blue badge
- **Status Indicator**: "Active" in green badge

## 🛠️ Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run eject      # Eject from Create React App
```

### Code Structure
- **Functional Components**: Modern React with hooks
- **Custom Hooks**: Reusable logic for data fetching
- **Context API**: Centralized authentication state
- **Responsive Design**: Mobile-first approach with Tailwind
- **Error Boundaries**: Graceful error handling
- **Performance Optimization**: Code splitting and lazy loading

## 🔧 Configuration

### Tailwind CSS Classes
The project uses custom Tailwind classes for consistency:
```css
.card                    # Standard card styling
.stat-card              # Statistics card styling  
.btn-primary            # Primary button styling
.btn-secondary          # Secondary button styling
.input-field            # Form input styling
```

### Component Props
Key components accept standardized props for consistency:
- **Payment Cards**: `payment`, `leaseInfo`, `onDelete`
- **Lease Cards**: `lease`, `payments`, `onUpdate`
- **Ticket Cards**: `ticket`, `onStatusUpdate`, `onAssign`

## 📈 Analytics & Metrics

### Dashboard Metrics
- **Total Collected**: Sum of all payments across leases
- **Total Payments**: Count of payment transactions
- **Active Leases**: Number of active lease agreements
- **Unpaid Tenants**: Count of tenants with no payment records

### Payment Analytics
- **Lease Performance**: Payment progress across all leases
- **Payment Trends**: Monthly payment tracking
- **Balance Overview**: Outstanding balances by tenant
- **Collection Rates**: Percentage of on-time payments

## 🚨 Error Handling

### Graceful Degradation
- **API Failures**: Fallback to cached data or empty states
- **Loading Timeouts**: Emergency logout after extended loading
- **Network Issues**: Retry mechanisms with user feedback
- **Invalid Data**: Input validation with helpful error messages

### User Feedback
- **Toast Notifications**: Success/error messages
- **Loading Spinners**: Visual feedback during operations
- **Empty States**: Helpful guidance when no data exists
- **Error Boundaries**: Prevent app crashes from component errors

## 🔒 Security Features

### Authentication
- **Role-based Access Control**: Different permissions for landlords/tenants
- **Session Management**: Secure token handling
- **Route Protection**: Authenticated routes with redirects
- **Input Validation**: Client-side validation for all forms

### Data Protection
- **Tenant Isolation**: Each tenant only sees their own data
- **Secure API Calls**: All requests include authentication headers
- **XSS Prevention**: Sanitized user inputs and outputs
- **CSRF Protection**: Token-based request validation

## 🎯 Future Enhancements

### Planned Features
- **Payment Reminders**: Automated notifications for overdue payments
- **Mobile App**: React Native version for mobile access
- **Advanced Analytics**: More detailed reporting and insights
- **Document Management**: Lease document upload and storage
- **Multi-Property Support**: Manage multiple properties
- **Integration APIs**: Connect with accounting software

### Performance Optimizations
- **Code Splitting**: Lazy load components for faster initial load
- **Caching Strategy**: Implement service worker for offline support
- **Image Optimization**: Compress and lazy load images
- **Bundle Analysis**: Optimize bundle size and dependencies

## 📞 Support & Maintenance

### Troubleshooting
1. **Frontend Not Loading**: Check if backend is running on port 8082
2. **Login Issues**: Verify credentials and role selection
3. **Payment Data Missing**: Ensure MongoDB connection is active
4. **Styling Issues**: Verify Tailwind CSS compilation

### Maintenance Tasks
- **Regular Updates**: Keep dependencies updated for security
- **Performance Monitoring**: Track load times and user interactions
- **Error Logging**: Monitor and fix runtime errors
- **User Feedback**: Collect and implement user suggestions

---

## 🎉 Project Status: Complete & Production Ready

This tenant management system now features **complete lease-based payment tracking** with real-time balance calculations, enhanced UI/UX, and comprehensive role-based access control. The system successfully demonstrates:

✅ **Dynamic Balance Tracking**: Ramadhan's $30K lease with $20K paid, $10K remaining  
✅ **Enhanced Dashboards**: Both landlord and tenant interfaces updated  
✅ **Real-time Updates**: Automatic balance calculation and progress tracking  
✅ **Professional UI**: Modern, responsive design with Tailwind CSS  
✅ **Complete Documentation**: Comprehensive API and frontend documentation  

**Ready for deployment and production use!** 🚀 