import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = "https://invoice-digitizer-service-production.up.railway.app/api";
// const API_BASE_URL = "http://localhost:8081/api";

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices`);
      console.log("API Response:", response.data);
      
      const invoiceData = Array.isArray(response.data) ? response.data : [];
      setInvoices(invoiceData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices. Please try again.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadInvoice = async (file, model = 'prebuilt-invoice') => {
    if (!file) return null;
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("model", model);
      const response = await axios.post(`${API_BASE_URL}/invoices/upload`, formData);
      
      console.log("Upload Response:", response.data);
      
      if (response.data) {
        setInvoices(prev => Array.isArray(prev) ? [response.data, ...prev] : [response.data]);
      }
      
      return response.data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Upload failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return {
    invoices,
    loading,
    error,
    fetchInvoices,
    uploadInvoice
  };
};