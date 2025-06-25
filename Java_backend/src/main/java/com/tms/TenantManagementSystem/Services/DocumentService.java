package com.tms.TenantManagementSystem.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tms.TenantManagementSystem.Models.TenantDocument;
import com.tms.TenantManagementSystem.Repositories.DocumentRepository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    public List<TenantDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public TenantDocument getDocumentById(String id) {
        return documentRepository.findById(id).orElse(null);
    }

    public TenantDocument createDocument(TenantDocument document) {
        // Ensure uploadDate and status are set if not provided
        if (document.getUploadDate() == null) {
            document.setUploadDate(new Date());
        }
        if (document.getStatus() == null) {
            document.setStatus("pending");
        }
        return documentRepository.save(document);
    }

    public TenantDocument updateDocument(String id, TenantDocument document) {
        document.setId(id);
        return documentRepository.save(document);
    }

    public void deleteDocument(String id) {
        documentRepository.deleteById(id);
    }

    public List<TenantDocument> getDocumentsByTenantId(int tenantId) {
        return documentRepository.findAll()
                .stream()
                .filter(document -> document.getTenantId() == tenantId)
                .collect(Collectors.toList());
    }
} 