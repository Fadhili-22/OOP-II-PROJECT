package com.tms.TenantManagementSystem.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "paymentHistories")
public class paymentHistory {

    @Id
    public int tenantID;
    private List<Payment> payments;

    

    public paymentHistory(int tenantID, List<Payment> payments) {
        this.tenantID = tenantID;
        this.payments = payments;
    }
    public paymentHistory() {}

    public void getPaymentHistory() {
        for (Payment p : payments) {
            System.out.println(p);
        }
    }
}
