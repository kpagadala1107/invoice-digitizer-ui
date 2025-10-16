// import React, { useState } from "react";
// import axios from "axios";

// export default function UploadPage() {
//   const [file, setFile] = useState(null);
//   const [invoice, setInvoice] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!file) return;
    
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const response = await axios.post("http://localhost:8080/api/invoices/upload", formData);
//       setInvoice(response.data);
//     } catch (error) {
//       console.error("Upload failed:", error);
//       alert("Upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setLoading(true);
//     try {
//       await axios.post("http://localhost:8080/api/invoices/save", invoice);
//       alert("Invoice saved successfully!");
//     } catch (error) {
//       console.error("Save failed:", error);
//       alert("Save failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (field, value) => {
//     setInvoice({ ...invoice, [field]: value });
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...invoice.items];
//     updatedItems[index] = { ...updatedItems[index], [field]: value };
//     setInvoice({ ...invoice, items: updatedItems });
//   };

//   return (
//     <div className="px-4 py-6 sm:px-0">
//       <div className="bg-white shadow-xl rounded-lg overflow-hidden">
//         <div className="px-6 py-8">
//           <div className="flex items-center justify-between mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">Upload Invoice</h1>
//             <div className="flex items-center space-x-2">
//               <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//               </svg>
//             </div>
//           </div>

//           {/* File Upload Section */}
//           <div className="mb-8">
//             <div className="flex items-center justify-center w-full">
//               <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
//                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                   <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                   </svg>
//                   <p className="mb-2 text-sm text-gray-500">
//                     <span className="font-semibold">Click to upload</span> or drag and drop
//                   </p>
//                   <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 10MB)</p>
//                 </div>
//                 <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg" />
//               </label>
//             </div>
//             {file && (
//               <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                 <p className="text-sm text-blue-700">Selected: {file.name}</p>
//               </div>
//             )}
//             <button
//               onClick={handleUpload}
//               disabled={!file || loading}
//               className="mt-4 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//             >
//               {loading ? (
//                 <div className="flex items-center">
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </div>
//               ) : (
//                 "Upload & Process"
//               )}
//             </button>
//           </div>

//           {/* Invoice Details */}
//           {invoice && (
//             <div className="space-y-8">
//               <div className="border-t border-gray-200 pt-8">
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-6">Invoice Details</h2>
                
//                 {/* Invoice Header Information */}
//                 <div className="bg-gray-50 rounded-lg p-6 mb-8">
//                   <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         value={invoice.invoiceNumber || ""}
//                         onChange={(e) => handleChange("invoiceNumber", e.target.value)}
//                         placeholder="Enter invoice number"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         value={invoice.vendor || ""}
//                         onChange={(e) => handleChange("vendor", e.target.value)}
//                         placeholder="Enter vendor name"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
//                       <input
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                         type="date"
//                         value={invoice.date || ""}
//                         onChange={(e) => handleChange("date", e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Tax</label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-2 text-gray-500">$</span>
//                         <input
//                           className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           type="number"
//                           step="0.01"
//                           value={invoice.tax || 0}
//                           onChange={(e) => handleChange("tax", parseFloat(e.target.value))}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount</label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-2 text-gray-500">$</span>
//                         <input
//                           className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           type="number"
//                           step="0.01"
//                           value={invoice.totalAmount || 0}
//                           onChange={(e) => handleChange("totalAmount", parseFloat(e.target.value))}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Invoice Items Table */}
//                 {invoice.items && invoice.items.length > 0 && (
//                   <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
//                     <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//                       <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
//                     </div>
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                           <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
//                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
//                             <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                           </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                           {invoice.items.map((item, index) => (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
//                               <td className="px-6 py-4">
//                                 <textarea
//                                   className="w-full border-0 p-0 resize-none focus:ring-0 text-sm text-gray-900 bg-transparent"
//                                   rows="2"
//                                   value={item.name || ""}
//                                   onChange={(e) => handleItemChange(index, "name", e.target.value)}
//                                   placeholder="Item name"
//                                 />
//                               </td>
//                               <td className="px-6 py-4 text-center">
//                                 <input
//                                   className="w-20 text-center border-0 p-0 focus:ring-0 text-sm text-gray-900 bg-transparent"
//                                   type="number"
//                                   value={item.quantity || 0}
//                                   onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
//                                   placeholder="0"
//                                 />
//                               </td>
//                               <td className="px-6 py-4 text-right">
//                                 <div className="flex items-center justify-end">
//                                   <span className="text-gray-500 mr-1">$</span>
//                                   <input
//                                     className="w-24 text-right border-0 p-0 focus:ring-0 text-sm text-gray-900 bg-transparent"
//                                     type="number"
//                                     step="0.01"
//                                     value={item.unitPrice || 0}
//                                     onChange={(e) => handleItemChange(index, "unitPrice", parseFloat(e.target.value))}
//                                     placeholder="0.00"
//                                   />
//                                 </div>
//                               </td>
//                               <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
//                                 ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}

//                 <div className="flex justify-end pt-6">
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg shadow-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//                   >
//                     {loading ? "Saving..." : "Save Invoice"}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }