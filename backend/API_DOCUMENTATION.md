# Tenant Management System - API Documentation

## Base URL
```
http://localhost:8082/api
```

## Authentication

### Login
- **POST** `/auth/login`
- **Description**: Authenticate user and return user details
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string",
    "role": "landlord" | "tenant"
  }
  ```
- **Response**:
  ```json
  {
    "id": "number",
    "name": "string",
    "email": "string",
    "role": "string"
  }
  ```

## Tenants

### Get All Tenants
- **GET** `/tenants`
- **Description**: Retrieve all tenants (landlord access)
- **Response**: Array of tenant objects

### Get Tenant by ID
- **GET** `/tenants/{id}`
- **Description**: Retrieve specific tenant by ID
- **Parameters**: `id` (integer) - Tenant ID
- **Response**: Tenant object

### Create Tenant
- **POST** `/tenants`
- **Description**: Create a new tenant
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "role": "tenant"
  }
  ```

### Update Tenant
- **PUT** `/tenants/{id}`
- **Description**: Update tenant information
- **Parameters**: `id` (integer) - Tenant ID
- **Request Body**: Tenant object with updated fields

### Delete Tenant
- **DELETE** `/tenants/{id}`
- **Description**: Delete a tenant
- **Parameters**: `id` (integer) - Tenant ID

### Get Unpaid Tenants
- **GET** `/tenants/unpaid`
- **Description**: Get tenants with no payment records
- **Response**: Array of tenant objects

## Landlords

### Get All Landlords
- **GET** `/landlords`
- **Description**: Retrieve all landlords
- **Response**: Array of landlord objects

### Get Landlord by ID
- **GET** `/landlords/{id}`
- **Description**: Retrieve specific landlord by ID
- **Parameters**: `id` (integer) - Landlord ID

### Create Landlord
- **POST** `/landlords`
- **Description**: Create a new landlord
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "role": "landlord"
  }
  ```

### Update Landlord
- **PUT** `/landlords/{id}`
- **Description**: Update landlord information
- **Parameters**: `id` (integer) - Landlord ID

### Delete Landlord
- **DELETE** `/landlords/{id}`
- **Description**: Delete a landlord
- **Parameters**: `id` (integer) - Landlord ID

## Payments

### Get All Payments
- **GET** `/payments`
- **Description**: Retrieve all payments (landlord access)
- **Response**: Array of payment objects

### Get Payment by ID
- **GET** `/payments/{id}`
- **Description**: Retrieve specific payment by ID
- **Parameters**: `id` (integer) - Payment ID

### Get Payments by Tenant
- **GET** `/payments/tenant/{tenantId}`
- **Description**: Retrieve all payments for a specific tenant
- **Parameters**: `tenantId` (integer) - Tenant ID
- **Response**: Array of payment objects

### Create Payment
- **POST** `/payments`
- **Description**: Create a new general payment
- **Request Body**:
  ```json
  {
    "tenantId": "integer",
    "amount": "number",
    "date": "string (ISO 8601)",
    "description": "string"
  }
  ```

### Delete Payment
- **DELETE** `/payments/{id}`
- **Description**: Delete a payment
- **Parameters**: `id` (integer) - Payment ID

## Lease-Based Payments (NEW)

### Get Payments by Lease
- **GET** `/payments/lease/{leaseId}`
- **Description**: Retrieve all payments for a specific lease
- **Parameters**: `leaseId` (string) - Lease ID
- **Response**: Array of payment objects linked to the lease

### Get Lease Payment Summary
- **GET** `/payments/lease/{leaseId}/summary`
- **Description**: Get comprehensive payment summary for a lease
- **Parameters**: `leaseId` (string) - Lease ID
- **Response**:
  ```json
  {
    "leaseId": "string",
    "totalAmount": "number",
    "totalPaid": "number",
    "balance": "number",
    "paymentProgress": "number",
    "fullyPaid": "boolean",
    "overdue": "boolean",
    "payments": [
      {
        "paymentID": "integer",
        "tenantId": "integer",
        "leaseId": "string",
        "amount": "number",
        "date": "string",
        "description": "string"
      }
    ]
  }
  ```

### Create Lease Payment
- **POST** `/payments/lease`
- **Description**: Create a payment linked to a specific lease (automatically updates lease balance)
- **Request Body**:
  ```json
  {
    "tenantId": "integer",
    "leaseId": "string",
    "amount": "number",
    "description": "string"
  }
  ```
- **Response**: Payment object with lease linkage

## Leases

### Get All Leases
- **GET** `/leases`
- **Description**: Retrieve all leases
- **Response**: Array of lease objects with payment tracking

### Get Lease by ID
- **GET** `/leases/{id}`
- **Description**: Retrieve specific lease by ID
- **Parameters**: `id` (string) - Lease ID
- **Response**: 
  ```json
  {
    "leaseId": "string",
    "tenantId": "integer",
    "landlordId": "integer",
    "startDate": "string",
    "endDate": "string",
    "rentAmount": "number",
    "totalPaid": "number",
    "balance": "number",
    "paymentProgress": "number",
    "fullyPaid": "boolean",
    "overdue": "boolean",
    "status": "string",
    "active": "boolean"
  }
  ```

### Create Lease
- **POST** `/leases`
- **Description**: Create a new lease agreement
- **Request Body**:
  ```json
  {
    "tenantId": "integer",
    "landlordId": "integer",
    "startDate": "string",
    "endDate": "string",
    "rentAmount": "number",
    "status": "string"
  }
  ```

### Update Lease
- **PUT** `/leases/{id}`
- **Description**: Update lease information
- **Parameters**: `id` (string) - Lease ID

### Delete Lease
- **DELETE** `/leases/{id}`
- **Description**: Delete a lease
- **Parameters**: `id` (string) - Lease ID

### Get Lease Analytics
- **GET** `/leases/analytics`
- **Description**: Get lease analytics and statistics

### Get Payment Analytics
- **GET** `/leases/payment-analytics`
- **Description**: Get payment analytics across all leases

## Tickets

### Get All Tickets
- **GET** `/tickets`
- **Description**: Retrieve all tickets (landlord access)
- **Response**: Array of ticket objects

### Get Ticket by ID
- **GET** `/tickets/{id}`
- **Description**: Retrieve specific ticket by ID
- **Parameters**: `id` (integer) - Ticket ID

### Get Tickets by Tenant
- **GET** `/tickets/tenant/{tenantId}`
- **Description**: Retrieve all tickets for a specific tenant
- **Parameters**: `tenantId` (integer) - Tenant ID
- **Response**: Array of ticket objects

### Create Ticket
- **POST** `/tickets`
- **Description**: Create a new support ticket
- **Request Body**:
  ```json
  {
    "tenantId": "integer",
    "description": "string",
    "urgency": "Low" | "Medium" | "High",
    "category": "string",
    "status": "Open"
  }
  ```

### Delete Ticket
- **DELETE** `/tickets/{id}`
- **Description**: Delete a ticket
- **Parameters**: `id` (integer) - Ticket ID

### Assign Staff to Ticket
- **PUT** `/tickets/{id}/assign`
- **Description**: Assign staff member to a ticket
- **Parameters**: 
  - `id` (integer) - Ticket ID
  - `staff` (query parameter) - Staff member name

### Update Ticket Status
- **PUT** `/tickets/{id}/status`
- **Description**: Update ticket status
- **Parameters**: 
  - `id` (integer) - Ticket ID
  - `status` (query parameter) - New status

### Add Resolution to Ticket
- **PUT** `/tickets/{id}/resolution`
- **Description**: Add resolution notes to a ticket
- **Parameters**: 
  - `id` (integer) - Ticket ID
  - `notes` (query parameter) - Resolution notes

## Payment History

### Get All Payment Histories
- **GET** `/paymentHistories`
- **Description**: Retrieve all payment histories
- **Response**: Array of payment history objects

### Get Payment History by Tenant
- **GET** `/paymentHistories/{tenantId}`
- **Description**: Retrieve payment history for specific tenant
- **Parameters**: `tenantId` (integer) - Tenant ID

### Create Payment History
- **POST** `/paymentHistories`
- **Description**: Create payment history record
- **Request Body**: Payment history object

### Delete Payment History
- **DELETE** `/paymentHistories/{tenantId}`
- **Description**: Delete payment history for tenant
- **Parameters**: `tenantId` (integer) - Tenant ID

## Response Codes

- **200 OK**: Successful GET, PUT requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

## Data Models

### User (Base Class)
```json
{
  "id": "integer",
  "name": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "role": "string"
}
```

### Payment
```json
{
  "paymentID": "integer",
  "tenantId": "integer",
  "leaseId": "string (optional)",
  "amount": "number",
  "date": "string",
  "description": "string"
}
```

### Lease
```json
{
  "leaseId": "string",
  "tenantId": "integer",
  "landlordId": "integer",
  "startDate": "string",
  "endDate": "string",
  "rentAmount": "number",
  "totalPaid": "number",
  "balance": "number",
  "paymentProgress": "number",
  "fullyPaid": "boolean",
  "overdue": "boolean",
  "status": "string",
  "active": "boolean"
}
```

### Ticket
```json
{
  "ticketID": "integer",
  "tenantId": "integer",
  "description": "string",
  "urgency": "string",
  "category": "string",
  "status": "string",
  "assignedStaff": "string",
  "resolutionNotes": "string",
  "createdDate": "string",
  "resolvedDate": "string"
}
```

## Key Features

### 🆕 Dynamic Lease Balance Tracking
- Payments can be linked to specific leases
- Automatic balance calculation: `balance = rentAmount - totalPaid`
- Real-time payment progress: `paymentProgress = (totalPaid / rentAmount) * 100`
- Overdue detection and fully paid status

### 🔐 Authentication System
- Role-based access (landlord/tenant)
- Secure password handling
- Session management

### 🏠 Multi-Tenancy Support
- Complete data isolation between tenants
- Tenant-specific API endpoints
- Secure data access controls

### 📊 Analytics & Reporting
- Payment analytics across leases
- Unpaid tenant identification
- Lease performance tracking

## Default Credentials

### Landlord Account
- **Email**: `admin@gmail.com`
- **Password**: `admin123`
- **Role**: `landlord`

### Tenant Accounts
- **Ramadhan**: `ramadhan@gmail.com` / `Ramadhan123`
- **Onyi**: `onyi@gmail.com` / `Onyi123`
- **Role**: `tenant`

## Database
- **Technology**: MongoDB
- **Database Name**: `tenantdb`
- **Collections**: `users`, `payments`, `leases`, `tickets`, `paymentHistories` 