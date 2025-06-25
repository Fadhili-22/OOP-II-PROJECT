package com.tms.TenantManagementSystem.Models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
public class Payment {
    private static int count = 1;
    @Id
    private int id;
    private int paymentID;
    private double amount;
    private Date date;
    private int tenantId;

    public Payment() {}

    public Payment(double amount) {
        this.paymentID = count++;
        this.amount = amount;
        this.date = new Date(); // current date
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(int paymentID) {
        this.paymentID = paymentID;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getTenantId() {
        return tenantId;
    }

    public void setTenantId(int tenantId) {
        this.tenantId = tenantId;
    }

    @Override
    public String toString() {
        return "PaymentID: " + paymentID + ", Amount: " + amount + ", Date: " + date;
    }
}

