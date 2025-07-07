package com.tms.TenantManagementSystem.Models;

import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
public class Payment {
    private static AtomicInteger paymentCounter = new AtomicInteger(1);
    
    @Id
    private String mongoId; // MongoDB's auto-generated ID
    private int paymentID;
    private int tenantId; // Link to specific tenant
    private String leaseId; // Link to specific lease agreement
    private double amount;
    private Date date;
    private String description;

    public Payment() {
        this.paymentID = paymentCounter.getAndIncrement();
        this.date = new Date(); // current date
    }

    public Payment(int tenantId, double amount) {
        this();
        this.tenantId = tenantId;
        this.amount = amount;
    }

    public Payment(int tenantId, String leaseId, double amount) {
        this();
        this.tenantId = tenantId;
        this.leaseId = leaseId;
        this.amount = amount;
    }

    public Payment(int tenantId, String leaseId, double amount, String description) {
        this(tenantId, leaseId, amount);
        this.description = description;
    }

    // Static method to initialize counter
    public static void initializeCounter(int maxExistingId) {
        paymentCounter.set(maxExistingId + 1);
    }

    // Getters and Setters
    public int getPaymentID() { return paymentID; }
    public void setPaymentID(int paymentID) { this.paymentID = paymentID; }

    public int getTenantId() { return tenantId; }
    public void setTenantId(int tenantId) { this.tenantId = tenantId; }

    public String getLeaseId() { return leaseId; }
    public void setLeaseId(String leaseId) { this.leaseId = leaseId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    @Override
    public String toString() {
        return "PaymentID: " + paymentID + ", TenantID: " + tenantId + ", LeaseID: " + leaseId + 
               ", Amount: " + amount + ", Date: " + date;
    }
}

