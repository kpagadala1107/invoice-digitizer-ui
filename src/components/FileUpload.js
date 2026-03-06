import React from 'react';

const FileUpload = ({ 
  file, 
  dragActive, 
  uploading, 
  onFileChange, 
  onDrag, 
  onDrop, 
  onUpload 
}) => {
  return (
    <div className={`bg-white rounded-2xl p-8 mb-8 border transition-all duration-500 ${
      uploading 
        ? 'shadow-2xl border-violet-200' 
        : 'shadow-xl border-gray-100'
    }`} 
    style={uploading ? {
      boxShadow: '0 25px 50px -12px rgba(139, 69, 19, 0.2), 0 20px 40px -10px rgba(236, 72, 153, 0.25), 0 15px 30px -8px rgba(147, 51, 234, 0.3), 0 10px 20px -5px rgba(59, 130, 246, 0.25), 0 5px 15px rgba(34, 211, 238, 0.2), 0 0 25px rgba(236, 72, 153, 0.15)'
    } : {}}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Document</h2>
      
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
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
          />
          
          <div className="flex flex-col items-center space-y-4">
            {file ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <img src="/icons/document-green.svg" alt="document" className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">Ready to upload</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <img src="/icons/document-blue.svg" alt="document" className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-700">
                    Drop your document here, or <span className="text-blue-600">browse</span>
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
            onClick={onUpload}
            disabled={!file || uploading}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              uploading
                ? 'bg-gradient-to-r from-violet-600 via-pink-600 to-red-500 animate-pulse cursor-not-allowed shadow-lg'
                : !file
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse'
            }`}
            style={file && !uploading ? {
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), 0 0 60px rgba(147, 51, 234, 0.2)',
            } : {}}
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
  );
};

export default FileUpload;