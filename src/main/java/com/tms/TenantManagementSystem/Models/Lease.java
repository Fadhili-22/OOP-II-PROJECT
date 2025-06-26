package com.tms.TenantManagementSystem.Models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leases")
public class Lease {
    @Id
    private String leaseId;
    private String tenantId;
    private String landlordId;
    private Date startDate;
    private Date endDate;
    private double rentAmount;
    private boolean isActive;
    private boolean renewed;
    private String status;

    public Lease() {}

    public Lease(String tenantId, String landlordId, Date startDate, Date endDate, double rentAmount) {
        this.tenantId = tenantId;
        this.landlordId = landlordId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.rentAmount = rentAmount;
        this.isActive = true;
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

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public String getLandlordId() {
        return landlordId;
    }

    public void setLandlordId(String landlordId) {
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