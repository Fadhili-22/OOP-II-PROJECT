// MongoDB script to add test data
// Run with: mongosh tenantdb add_test_data.js

use tenantdb;

// Clear existing collections
db.tenants.deleteMany({});
db.payments.deleteMany({});
db.tickets.deleteMany({});

// Add test tenant
db.tenants.insertOne({
  _id: 1,
  name: "John Doe",
  email: "john.doe@gmail.com",
  password: "password123",
  phoneNumber: "+254712345678",
  role: "tenant",
  payments: [],
  tickets: []
});

// Add test payments
db.payments.insertMany([
  {
    _id: 1,
    paymentID: 1,
    amount: 1200,
    date: new Date("2024-11-01"),
    tenantId: 1
  },
  {
    _id: 2,
    paymentID: 2,
    amount: 1200,
    date: new Date("2024-10-01"),
    tenantId: 1
  },
  {
    _id: 3,
    paymentID: 3,
    amount: 1200,
    date: new Date("2024-09-01"),
    tenantId: 1
  }
]);

// Add test tickets
db.tickets.insertMany([
  {
    _id: 1,
    title: "Leaky Faucet in Kitchen",
    description: "The kitchen faucet has been dripping constantly for 3 days",
    status: "In Progress",
    urgency: "Medium",
    category: "Plumbing",
    date: new Date("2024-11-20"),
    tenantId: 1
  },
  {
    _id: 2,
    title: "Broken Light Fixture",
    description: "Ceiling light in living room stopped working",
    status: "Completed",
    urgency: "Low",
    category: "Electrical",
    date: new Date("2024-11-15"),
    tenantId: 1
  }
]);

print("Test data added successfully!");
print("Tenant: " + db.tenants.countDocuments());
print("Payments: " + db.payments.countDocuments());
print("Tickets: " + db.tickets.countDocuments()); 