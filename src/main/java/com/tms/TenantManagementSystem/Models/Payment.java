package com.tms.TenantManagementSystem.Models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payments")
public class Payment {
    private static int count = 1;
    @Id
    private int paymentID;
    private double amount;
    private Date date;

    public Payment() {}

    public Payment(double amount) {
        this.paymentID = count++;
        this.amount = amount;
        this.date = new Date(); // current date
    }

    public double getAmount() {
        return amount;
    }

    @Override
    public String toString() {
        return "PaymentID: " + paymentID + ", Amount: " + amount + ", Date: " + date;
    }
}

