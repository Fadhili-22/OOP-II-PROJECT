// components/DocumentCenter.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  FormControl,
  InputLabel
} from '@mui/material';
import { Description, ArrowBack, Add, CloudUpload, AttachFile } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { documentService } from '../services/documentService';

const DocumentCenter = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newDocument, setNewDocument] = useState({
    documentType: '',
    description: ''
  });

  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await documentService.getDocumentsByTenant(user.id);
      setDocuments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, Word documents, and images are allowed');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUploadDocument = async () => {
    if (!user?.id || !newDocument.documentType) {
      setError('Please enter a document type');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      
      if (selectedFile) {
        // Try file upload first
        await documentService.uploadDocument(
          selectedFile,
          newDocument.documentType,
          newDocument.description,
          user.id
        );
      } else {
        // Create metadata-only document
        const documentData = {
          fileName: `${newDocument.documentType}_${Date.now()}`,
          documentType: newDocument.documentType,
          description: newDocument.description,
          tenantId: user.id
        };
        await documentService.createDocument(documentData);
      }
      
      setOpenDialog(false);
      setSelectedFile(null);
      setNewDocument({ documentType: '', description: '' });
      fetchDocuments(); // Refresh the list
      
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
        <Typography ml={2}>Loading documents...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Document Center</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Upload Document
        </Button>
      </Box>
      
      <Typography variant="body1" mb={3}>
        Upload and manage your documents. You can upload files or create document records. Accepted formats: PDF, Word, Images (Max 10MB)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {documents.length === 0 ? (
        <Box textAlign="center" py={4}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={1}>
            No documents uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Upload your first document to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Upload Document
          </Button>
        </Box>
      ) : (
      <List>
          {documents.map((doc) => (
            <ListItem key={doc.id} divider>
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">
                      {doc.fileName}
                    </Typography>
                    <Chip 
                      label={doc.status || 'pending'} 
                      size="small"
                      color={getStatusColor(doc.status)}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Type: {doc.documentType}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded on {formatDate(doc.uploadDate)}
                    </Typography>
                    {doc.description && (
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                    )}
                  </>
                }
              />
              {doc.fileUrl && (
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => window.open(`http://localhost:8082${doc.fileUrl}`, '_blank')}
                >
                  Download
                </Button>
              )}
          </ListItem>
        ))}
      </List>
      )}

      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ mt: 4 }}
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>

      {/* Upload Document Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel shrink>Select File</InputLabel>
              <Input
                type="file"
                onChange={handleFileSelect}
                inputProps={{
                  accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png'
                }}
                startAdornment={<AttachFile sx={{ mr: 1 }} />}
              />
              {selectedFile && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                </Typography>
              )}
            </FormControl>
            
            <TextField
              margin="dense"
              label="Document Type"
              fullWidth
              variant="outlined"
              required
              value={newDocument.documentType}
              onChange={(e) => setNewDocument({...newDocument, documentType: e.target.value})}
              placeholder="e.g., Lease Agreement, ID Copy, Utility Bill"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newDocument.description}
              onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
              placeholder="Optional description"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            setSelectedFile(null);
            setNewDocument({ documentType: '', description: '' });
          }}>
            Cancel
          </Button>
          <Button 
            onClick={handleUploadDocument}
            variant="contained"
            disabled={!newDocument.documentType || uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
          >
            {uploading ? 'Uploading...' : (selectedFile ? 'Upload File' : 'Create Document')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentCenter;
