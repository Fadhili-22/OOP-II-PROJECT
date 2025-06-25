import api from './api';

export const documentService = {
  // Get all documents
  getAllDocuments: async () => {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  // Get document by ID
  getDocumentById: async (id) => {
    try {
      const response = await api.get(`/documents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Get documents by tenant ID
  getDocumentsByTenant: async (tenantId) => {
    try {
      const response = await api.get(`/documents/tenant/${tenantId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents for tenant:', error);
      throw error;
    }
  },

  // Create new document (metadata only)
  createDocument: async (documentData) => {
    try {
      const response = await api.post('/documents', documentData);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  // Upload document with file
  uploadDocument: async (file, documentType, description, tenantId) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);
      formData.append('description', description || '');
      formData.append('tenantId', tenantId);

      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Update document
  updateDocument: async (id, documentData) => {
    try {
      const response = await api.put(`/documents/${id}`, documentData);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id) => {
    try {
      await api.delete(`/documents/${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
}; 