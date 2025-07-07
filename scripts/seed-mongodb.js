// MongoDB seeding script for Tenant Management System
// Run this script with: mongo tenantdb seed-mongodb.js

print("🚀 Starting TMS Database Seeding...");

// Switch to the tenant management database
db = db.getSiblingDB('tenantdb');

// Check if landlords collection exists and has data
const existingLandlords = db.landlords.count();

if (existingLandlords > 0) {
    print("⚠️  Landlords already exist in database. Skipping seeding.");
    print("📊 Existing landlords count:", existingLandlords);
} else {
    print("📝 Creating default landlord user...");
    
    // Create the default landlord user
    const landlord = {
        "_id": NumberInt(1),
        "name": "Admin Landlord",
        "ID": NumberInt(1),
        "email": "admin@gmail.com",
        "password": "admin123",
        "role": "landlord",
        "_class": "com.tms.TenantManagementSystem.Models.Landlord"
    };

    // Insert the landlord
    try {
        const result = db.landlords.insertOne(landlord);
        
        if (result.acknowledged) {
            print("✅ Landlord user created successfully!");
            print("📧 Email: admin@gmail.com");
            print("🔒 Password: admin123");
            print("👤 Role: landlord");
            print("🆔 ID: 1");
            print("📄 Document ID:", result.insertedId);
        } else {
            print("❌ Failed to create landlord user");
        }
    } catch (error) {
        print("❌ Error creating landlord user:", error.message);
    }
}

// Display collection statistics
print("\n📊 Database Statistics:");
print("👥 Landlords:", db.landlords.count());
print("🏠 Tenants:", db.tenants.count());
print("📄 Leases:", db.leases.count());
print("💰 Payments:", db.payments.count());
print("🎫 Tickets:", db.tickets.count());

print("\n🎉 Seeding script completed!"); 