import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://invoice-digitizer-service-production.up.railway.app/api/invoices");
      console.log("API Response:", response.data); // Debug log
      
      // Ensure we have an array
      const invoiceData = Array.isArray(response.data) ? response.data : [];
      setInvoices(invoiceData);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to fetch invoices. Please try again.");
      setInvoices([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post("https://invoice-digitizer-service-production.up.railway.app/api/invoices/upload", formData);
      
      console.log("Upload Response:", response.data); // Debug log
      
      // Add the new invoice to the list - ensure invoices is array
      if (response.data) {
        setInvoices(prev => Array.isArray(prev) ? [response.data, ...prev] : [response.data]);
      }
      
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const calculateItemTotal = (item) => {
    return (item.quantity || 0) * (item.unitPrice || 0);
  };

  // Ensure invoices is always an array
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Invoice Digitizer
              </h1>
              <p className="text-gray-600 mt-2">Upload and manage your invoices digitally</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Invoice</h2>
          
          <div className="space-y-6">
            {/* File Upload Zone */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 scale-105'
                  : file
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
              
              <div className="flex flex-col items-center space-y-4">
                {file ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-green-700">{file.name}</p>
                      <p className="text-sm text-green-600">Ready to upload</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your invoice here, or <span className="text-blue-600">browse</span>
                      </p>
                      <p className="text-sm text-gray-500">Supports PDF, PNG, JPG (max 10MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <div className="flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                  !file || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
              >
                {uploading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  'Upload & Process'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Invoice History</h2>
                <p className="text-gray-600 mt-1">All your processed invoices - click to view details</p>
              </div>
              <div className="bg-blue-100 px-4 py-2 rounded-full">
                <span className="text-blue-800 font-medium">{safeInvoices.length} invoices</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Loading invoices...</span>
            </div>
          ) : safeInvoices.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
              <p className="text-gray-500">Upload your first invoice to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {safeInvoices.map((invoice, index) => (
                    <tr 
                      key={invoice.id || index} 
                      className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => handleRowClick(invoice)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white uppercase">
                              {invoice.vendor ? invoice.vendor.charAt(0) : 'V'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900 capitalize">
                              {invoice.vendor || 'Unknown'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(invoice.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                        {formatCurrency(invoice.tax)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {invoice.items ? invoice.items.length : 0} items
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                          Processed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Invoice Detail Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Invoice Details</h2>
                  <p className="text-blue-100 mt-1">{selectedInvoice.invoiceNumber || 'N/A'}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              {/* Invoice Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Vendor</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                    {selectedInvoice.vendor || 'Unknown'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Date</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatDate(selectedInvoice.date)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tax</h3>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {formatCurrency(selectedInvoice.tax)}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border-2 border-blue-200">
                  <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider">Total Amount</h3>
                  <p className="text-xl font-bold text-blue-900 mt-1">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              {selectedInvoice.items && Array.isArray(selectedInvoice.items) && selectedInvoice.items.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Invoice Items</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <div className="max-w-xs">
                                {item.name || 'Unnamed item'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                              {item.quantity || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                              {formatCurrency(item.unitPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                              {formatCurrency(calculateItemTotal(item))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            Subtotal:
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            {formatCurrency(
                              selectedInvoice.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            Tax:
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                            {formatCurrency(selectedInvoice.tax)}
                          </td>
                        </tr>
                        <tr className="bg-blue-50">
                          <td colSpan="4" className="px-6 py-4 text-right text-lg font-bold text-blue-900">
                            Total Amount:
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-900 text-right">
                            {formatCurrency(selectedInvoice.totalAmount)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* No items message */}
              {(!selectedInvoice.items || !Array.isArray(selectedInvoice.items) || selectedInvoice.items.length === 0) && (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500">This invoice doesn't contain any itemized details.</p>
              </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}