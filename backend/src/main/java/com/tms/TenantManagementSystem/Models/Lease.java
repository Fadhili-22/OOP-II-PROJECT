package com.tms.TenantManagementSystem.Models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leases")
public class Lease {
    @Id
    private String leaseId;
    private int tenantId;
    private int landlordId;
    private Date startDate;
    private Date endDate;
    private double rentAmount;
    private double totalPaid;
    private boolean isActive;
    private boolean renewed;
    private String status;

    public Lease() {}

    public Lease(int tenantId, int landlordId, Date startDate, Date endDate, double rentAmount) {
        this.tenantId = tenantId;
        this.landlordId = landlordId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rentAmount = rentAmount;
        this.totalPaid = 0.0;
        this.isActive = true;
        this.status = "Active";
    }

    public double getBalance() {
        return rentAmount - totalPaid;
    }

    public boolean isFullyPaid() {
        return totalPaid >= rentAmount;
    }

    public boolean isOverdue() {
        return new Date().after(endDate) && !isFullyPaid();
    }

    public void addPayment(double amount) {
        this.totalPaid += amount;
        if (isFullyPaid()) {
            this.status = "Paid";
        }
    }

    public double getPaymentProgress() {
        if (rentAmount == 0) return 0;
        return Math.min((totalPaid / rentAmount) * 100, 100);
    }

    public boolean isRenewed() {
        return renewed;
    }

    public void setRenewed(boolean renewed) {
        this.renewed = renewed;
    }

    public String getLeaseId() {
        return leaseId;
    }

    public void setLeaseId(String id) {
        this.leaseId = id;
    }

    public int getTenantId() {
        return tenantId;
    }

    public void setTenantId(int tenantId) {
        this.tenantId = tenantId;
    }

    public int getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(int landlordId) {
        this.landlordId = landlordId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public double getTotalPaid() {
        return totalPaid;
    }

    public void setTotalPaid(double totalPaid) {
        this.totalPaid = totalPaid;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}