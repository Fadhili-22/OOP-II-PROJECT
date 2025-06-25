# Tenant Management System (TMS)

A full-stack web application for managing tenants, payments, support tickets, and property management operations.

## Architecture

- **Frontend**: React 19 with Material-UI
- **Backend**: Java Spring Boot with MongoDB
- **API**: RESTful services
- **Database**: MongoDB

## Project Structure

```
Tenant/
├── react_frontend/           # React.js frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API service layer
│   │   ├── contexts/         # React contexts (user management)
│   │   └── config/           # Configuration files
│   └── package.json
├── Java_backend/            # Spring Boot backend application
│   ├── src/main/java/com/tms/TenantManagementSystem/
│   │   ├── Controllers/      # REST controllers
│   │   ├── Models/          # Data models
│   │   ├── Services/        # Business logic
│   │   ├── Repositories/    # Data access layer
│   │   └── Utils/           # Utility classes (CORS config)
│   └── pom.xml
└── README.md
```

## Features

### Tenant Dashboard
- Personalized welcome with tenant name
- Quick access to all major functions
- Modern Material-UI interface

### Payment Management
- View payment history
- Track outstanding balances
- Payment summaries and analytics
- Currency formatting (KES)

### Support Tickets
- Create new support tickets
- Track ticket status
- Categorize issues (Maintenance, Electrical, Plumbing, etc.)
- Priority levels (Low, Medium, High, Critical)

### Authentication
- User context management
- Token-based authentication
- Persistent login sessions

## API Endpoints

### Tenants
- `GET /api/tenants` - Get all tenants
- `GET /api/tenants/{id}` - Get tenant by ID
- `POST /api/tenants` - Create new tenant
- `PUT /api/tenants/{id}` - Update tenant
- `DELETE /api/tenants/{id}` - Delete tenant
- `POST /api/tenants/{id}/pay` - Process rent payment
- `GET /api/tenants/{id}/payments` - Get tenant payments

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `POST /api/payments` - Create payment
- `DELETE /api/payments/{id}` - Delete payment

### Support Tickets
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/{id}` - Get ticket by ID
- `POST /api/tickets` - Create new ticket
- `POST /api/tickets/upload` - Upload ticket with image
- `PUT /api/tickets/{id}/status` - Update ticket status
- `PUT /api/tickets/{id}/assign` - Assign staff to ticket

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 11 or higher
- Maven
- MongoDB

### Backend Setup

1. Navigate to the Java backend directory:
   ```bash
   cd Java_backend
   ```

2. Install dependencies:
   ```bash
   mvn clean install
   ```

3. Configure MongoDB connection in `application.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/tenantdb
   spring.data.mongodb.database=tenantdb
   server.port=8082
   ```

4. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8082`

### Frontend Setup

1. Navigate to the React frontend directory:
   ```bash
   cd react_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## Configuration

### Frontend Configuration
Update `src/config/config.js` to modify:
- API URL
- Authentication settings
- Currency formatting
- File upload limits

### Backend Configuration
Update `application.properties` to modify:
- Database connection
- Server port
- Other Spring Boot settings

## Integration Features

### CORS Configuration
- Configured to allow React frontend (`localhost:3000`) to communicate with backend
- Supports all HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
- Credentials support enabled

### Error Handling
- Centralized error handling in API services
- User-friendly error messages
- Loading states and error boundaries

### Data Flow
1. User interactions trigger React components
2. Components call service layer functions
3. Services make HTTP requests to Spring Boot APIs
4. Backend processes requests and returns JSON responses
5. Frontend updates UI with real data

## Recent Changes

### Removed Dummy Data
- ✅ Dashboard now uses real tenant data
- ✅ Payment overview fetches actual payment history
- ✅ Support tickets connect to backend APIs
- ✅ Real-time data loading with proper error handling

### Added API Integration
- ✅ Centralized API service layer
- ✅ Authentication context management
- ✅ Service classes for tenants, payments, and tickets
- ✅ CORS configuration for cross-origin requests

### Enhanced User Experience
- ✅ Loading states for async operations
- ✅ Error handling with user feedback
- ✅ Form validation and submission states
- ✅ Responsive design maintained

## Development Notes

### Authentication
Currently using mock authentication with tenant ID = 1. In production:
- Implement proper login/logout endpoints
- Add JWT token validation
- Include role-based access control

### Error Handling
- All API calls include try-catch blocks
- Users receive meaningful error messages
- Console logging for debugging

### Performance
- API calls are optimized with proper loading states
- Data is cached where appropriate
- Minimal re-renders with React best practices

## Next Steps

1. **Authentication System**: Implement proper login/logout functionality
2. **Document Management**: Add file upload and document viewing features
3. **Payment Processing**: Integrate with payment gateways
4. **Notifications**: Add real-time notifications for ticket updates
5. **Admin Panel**: Create landlord/admin interface
6. **Mobile Responsiveness**: Enhance mobile experience
7. **Testing**: Add unit and integration tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## License

This project is licensed under the MIT License. 