package com.tms.TenantManagementSystem.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tms.TenantManagementSystem.Models.TenantDocument;
import com.tms.TenantManagementSystem.Services.DocumentService;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Value("${file.upload.dir:uploads/documents/}")
    private String uploadDir;

    @GetMapping
    public List<TenantDocument> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    @GetMapping("/{id}")
    public TenantDocument getDocumentById(@PathVariable String id) {
        return documentService.getDocumentById(id);
    }

    @PostMapping
    public TenantDocument createDocument(@RequestBody TenantDocument document) {
        // Ensure required fields are set for documents created via API
        if (document.getUploadDate() == null) {
            document.setUploadDate(new Date());
        }
        if (document.getStatus() == null) {
            document.setStatus("pending");
        }
        return documentService.createDocument(document);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam("tenantId") int tenantId) {
        
        try {
            System.out.println("Upload request received:");
            System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
            System.out.println("DocumentType: " + documentType);
            System.out.println("Description: " + description);
            System.out.println("TenantId: " + tenantId);
            
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty or null");
            }

            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            System.out.println("Upload path: " + uploadPath.toAbsolutePath());
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("Created upload directory");
            }

            // Generate unique filename with safe extension handling
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                originalFilename = "document";
            }
            
            String fileExtension = "";
            int lastDotIndex = originalFilename.lastIndexOf(".");
            if (lastDotIndex > 0 && lastDotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(lastDotIndex);
            }
            
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
            System.out.println("Generated filename: " + uniqueFilename);
            
            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("File saved to: " + filePath.toAbsolutePath());

            // Create document record
            TenantDocument document = new TenantDocument(originalFilename, documentType, description, tenantId);
            document.setFileUrl("/uploads/documents/" + uniqueFilename);
            
            System.out.println("Creating document record...");
            TenantDocument savedDocument = documentService.createDocument(document);
            System.out.println("Document saved with ID: " + savedDocument.getId());
            
            return ResponseEntity.ok(savedDocument);
            
        } catch (Exception e) {
            System.err.println("File upload error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public TenantDocument updateDocument(@PathVariable String id, @RequestBody TenantDocument document) {
        return documentService.updateDocument(id, document);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable String id) {
        documentService.deleteDocument(id);
    }

    @GetMapping("/tenant/{tenantId}")
    public List<TenantDocument> getDocumentsByTenant(@PathVariable int tenantId) {
        return documentService.getDocumentsByTenantId(tenantId);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Document controller is working!");
    }
}