import React from 'react';

const FilePreview = ({ file, uploading }) => {
  if (!file) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">No file uploaded yet</p>
              <p className="text-sm text-gray-500">Upload a document to see preview</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (uploading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Processing file...</p>
              <p className="text-sm text-gray-500">Please wait while we upload your document</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isImage = file.type && file.type.startsWith('image/');
  
  // Simpler PDF detection - check MIME type and file extension
  const isPDF = (file.type === 'application/pdf') || 
                (file.name && file.name.toLowerCase().endsWith('.pdf'));

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-full">
      {/* File Info - Compact header */}
      <div className="border-b border-gray-100 p-2">
        <div className="text-xs text-gray-600 space-y-1">
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>Type:</strong> {file.type}</p>
        </div>
      </div>

      {/* Preview Area - Increased height */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-b-2xl" style={{ height: '800px' }}>
        {isImage && (
          <div className="w-full h-full overflow-hidden rounded-b-2xl">
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded file preview"
              className="w-full h-full object-contain"
              onLoad={(e) => URL.revokeObjectURL(e.target.src)}
            />
          </div>
        )}

        {isPDF && (
          <div className="w-full h-full rounded-b-2xl">
            <iframe
              src={URL.createObjectURL(file)}
              className="w-full h-full border-0 rounded-b-2xl"
              title="PDF Preview"
              type="application/pdf"
              style={{ minHeight: '800px', height: '100%' }}
            />
          </div>
        )}

        {!isImage && !isPDF && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">File uploaded</p>
                <p className="text-sm text-gray-500">Preview not available for this file type</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;