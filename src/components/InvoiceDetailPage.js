import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { formatDate, formatCurrency, calculateItemTotal } from '../utils/formatters';

const API_BASE_URL = "https://invoice-digitizer-service-production.up.railway.app/api";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/invoices/${id}`);
      setInvoice(response.data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setError("Failed to fetch invoice details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

//   const handleDeleteClick = () => {
//     setShowDeleteConfirm(true);
//   };

  const handleDeleteConfirm = async () => {
    if (!invoice) return;
    
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/invoices/${invoice.id}`);
      
      // Navigate back to main page with success message
      navigate('/', { 
        state: { 
          message: 'Invoice deleted successfully!', 
          type: 'success' 
        } 
      });
      
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete invoice. Please try again.");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
          <p className="text-gray-600 mb-8 text-lg">{error || "The requested invoice could not be found."}</p>
          <button
            onClick={handleBackClick}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Navigation and Invoice Number Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* <button
              onClick={handleBackClick}
              className="p-3 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
            >
              <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button> */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Invoice#
              </h1>
              <p className="text-2xl text-gray-700 mt-2 font-semibold">
                {invoice.invoiceNumber || 'N/A'}
              </p>
            </div>
          </div>
          {/* <button
            onClick={handleDeleteClick}
            className="px-6 py-3 bg-red-600 text-black rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button> */}
        </div>
      </div>


      {/* Invoice Summary Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Invoice Summary</h2>
          <p className="text-gray-600 mt-1">Overview of invoice details</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Invoice#</h3>
              <p className="text-lg font-semibold text-gray-900">
                {invoice.invoiceNumber || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Vendor</h3>
              <p className="text-lg font-semibold text-gray-900 capitalize">
                {invoice.vendor || 'Unknown'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Date</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(invoice.date)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Tax</h3>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(invoice.tax)}
              </p>
            </div>
          </div>
          
          {/* Total Amount - Special Card */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Total Amount</h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>
        </div>
      </div>


      {/* Invoice Items Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800">Invoice Items</h3>
          <p className="text-gray-600 mt-1">Detailed breakdown of all items</p>
        </div>

        <div className="p-8">
          {invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Mobile horizontal scroll wrapper */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">#</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[200px]">Item Name</th>
                      <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Unit Price</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="font-medium min-w-[180px]">
                            {item.name || 'Unnamed item'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
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
                      <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">
                        Subtotal:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(
                          invoice.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-right text-sm font-medium text-gray-900 whitespace-nowrap">
                        Tax:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">
                        {formatCurrency(invoice.tax)}
                      </td>
                    </tr>
                    <tr className="bg-blue-50">
                      <td colSpan="4" className="px-6 py-4 text-right text-lg font-bold text-blue-900 whitespace-nowrap">
                        Total Amount:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-blue-900 text-right">
                        {formatCurrency(invoice.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {/* Mobile scroll indicator */}
              <div className="sm:hidden bg-gray-50 px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200">
                ← Scroll horizontally to view all columns →
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500 text-lg">This invoice doesn't contain any itemized details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Delete Invoice</h3>
              </div>
              <p className="text-gray-600 mb-8 text-lg">
                Are you sure you want to delete invoice <span className="font-semibold">"{invoice.invoiceNumber || 'N/A'}"</span>? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteCancel}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-semibold"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                >
                  {deleting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default InvoiceDetailPage;