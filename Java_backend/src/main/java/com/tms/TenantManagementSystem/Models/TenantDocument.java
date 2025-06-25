package com.tms.TenantManagementSystem.Models;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "documents")
public class TenantDocument {
    @Id
    private String id;
    private String fileName;
    private String documentType;
    private String description;
    private Date uploadDate;
    private String fileUrl;
    private int tenantId;
    private String status; // "pending", "approved", "rejected"

    public TenantDocument() {}

    public TenantDocument(String fileName, String documentType, String description, int tenantId) {
        this.fileName = fileName;
        this.documentType = documentType;
        this.description = description;
        this.tenantId = tenantId;
        this.uploadDate = new Date();
        this.status = "pending";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getUploadDate() { return uploadDate; }
    public void setUploadDate(Date uploadDate) { this.uploadDate = uploadDate; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public int getTenantId() { return tenantId; }
    public void setTenantId(int tenantId) { this.tenantId = tenantId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
} 