// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function Dashboard() {
//   const [invoices, setInvoices] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await axios.get("http://localhost:8080/api/invoices");
//         setInvoices(response.data);
//       } catch (err) {
//         setError("Failed to fetch invoices");
//         console.error("Error fetching invoices:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInvoices();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-96">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="px-4 py-6 sm:px-0">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6">
//           <div className="flex">
//             <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error</h3>
//               <p className="mt-1 text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="px-4 py-6 sm:px-0">
//       <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//         <div className="px-6 py-8">
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Invoices Dashboard</h1>
//               <p className="mt-2 text-sm text-gray-600">
//                 Manage and view all your processed invoices
//               </p>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="bg-blue-100 rounded-lg p-3">
//                 <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {invoices.length === 0 ? (
//             <div className="text-center py-12">
//               <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//               <h3 className="mt-4 text-lg font-medium text-gray-900">No invoices found</h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 Start by uploading your first invoice document.
//               </p>
//             </div>
//           ) : (
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//               <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     All Invoices ({invoices.length})
//                   </h3>
//                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     {invoices.length} total
//                   </span>
//                 </div>
//               </div>
              
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
//                       <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
//                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {invoices.map((invoice, index) => (
//                       <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
//                               <span className="text-xs font-medium text-white uppercase">
//                                 {invoice.vendor ? invoice.vendor.charAt(0) : 'V'}
//                               </span>
//                             </div>
//                             <div className="ml-3">
//                               <div className="text-sm font-medium text-gray-900 capitalize">{invoice.vendor}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {invoice.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
//                           ${(invoice.tax || 0).toFixed(2)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right">
//                           <div className="text-sm font-medium text-gray-900">
//                             ${(invoice.totalAmount || 0).toFixed(2)}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-center">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                             Processed
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }