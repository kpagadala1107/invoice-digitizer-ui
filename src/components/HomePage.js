import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorDisplay from './ErrorDisplay';
import FileUpload from './FileUpload';
import DisplayDocFields from './DisplayDocFields';
import FilePreview from './FilePreview';
import { useInvoices } from '../hooks/useInvoices';

const HomePage = () => {
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jsonZoom, setJsonZoom] = useState(1);
  const [previewZoom, setPreviewZoom] = useState(1);

  const { error, uploadInvoice } = useInvoices();

  // Handle success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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
      const response = await uploadInvoice(file);
      setUploadResponse(response);
      setUploadedFile(file); // Store the uploaded file for preview
      setFile(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-600 p-1.5 hover:bg-green-100"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <ErrorDisplay error={error} />

      <FileUpload
        file={file}
        dragActive={dragActive}
        uploading={uploading}
        onFileChange={handleFileChange}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onUpload={handleUpload}
      />

       {/* Document Fields and Preview Section - Side by Side */}
      <div className="mt-8 flex flex-col xl:flex-row xl:space-x-8 space-y-8 xl:space-y-0">
        {/* Document Fields Section - Fixed 50% width */}
        <div className="xl:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Extracted Document Fields</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setJsonZoom(prev => Math.max(0.5, prev - 0.1))}
                className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                disabled={uploading}
              >
                -
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(jsonZoom * 100)}%
              </span>
              <button
                onClick={() => setJsonZoom(prev => Math.min(2, prev + 0.1))}
                className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                disabled={uploading}
              >
                +
              </button>
            </div>
          </div>
          <div 
            className="overflow-x-auto overflow-y-auto max-h-96"
            style={{ transform: `scale(${jsonZoom})`, transformOrigin: 'top left' }}
          >
            <DisplayDocFields
              data={uploadResponse}
              loading={uploading}
            />
          </div>
        </div>

        {/* File Preview Section - Remaining 50% width */}
        <div className="xl:w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Document Preview</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPreviewZoom(prev => Math.max(0.5, prev - 0.1))}
                className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                disabled={!uploadedFile}
              >
                -
              </button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(previewZoom * 100)}%
              </span>
              <button
                onClick={() => setPreviewZoom(prev => Math.min(2, prev + 0.1))}
                className="px-2 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                disabled={!uploadedFile}
              >
                +
              </button>
            </div>
          </div>
          <div 
            className="overflow-auto max-h-96"
            style={{ transform: `scale(${previewZoom})`, transformOrigin: 'top left' }}
          >
            <FilePreview file={uploadedFile} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;