import React from 'react';

const FilePreview = ({ file, uploading }) => {
  if (!file) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
        <div className="mb-6">
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>File Name:</strong> {file.name}</p>
            <p><strong>File Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p><strong>File Type:</strong> {file.type}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 border border-gray-100 max-h-96 overflow-auto">
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
      </div>
    );
  }

  const isImage = file.type && file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
      <div className="mb-6">
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>File Name:</strong> {file.name}</p>
          <p><strong>File Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
          <p><strong>File Type:</strong> {file.type}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 border border-gray-100 max-h-96 overflow-auto">
        <div className="flex items-start justify-start min-h-full">
          {isImage && (
            <div className="text-left overflow-x-auto overflow-y-auto w-full">
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded file preview"
                className="max-h-56 rounded-lg shadow-sm object-contain min-w-0"
                style={{ transform: 'scale(0.7)' }}
                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
              />
            </div>
          )}

          {isPDF && (
            <div className="text-left space-y-4 w-full">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">PDF file uploaded</p>
                <p className="text-sm text-gray-500">Preview not available for PDF files</p>
              </div>
            </div>
          )}

          {!isImage && !isPDF && (
            <div className="text-left space-y-4 w-full">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700">File uploaded</p>
                <p className="text-sm text-gray-500">Preview not available for this file type</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;