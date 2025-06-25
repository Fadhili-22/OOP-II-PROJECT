const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8082/api',
  appName: process.env.REACT_APP_NAME || 'Tenant Management System',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // Authentication settings
  auth: {
    tokenKey: 'authToken',
    userIdKey: 'userId',
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  
  // API timeout settings
  api: {
    timeout: 10000, // 10 seconds
    retries: 3,
  },
  
  // Pagination settings
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // File upload settings
  uploads: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  },
  
  // Date/Time formats
  dateFormats: {
    display: 'MMM dd, yyyy',
    input: 'yyyy-MM-dd',
    datetime: 'MMM dd, yyyy HH:mm',
  },
  
  // Currency formatting
  currency: {
    locale: 'en-KE',
    currency: 'KES',
  },
};

export default config; 