import React from 'react';

const DisplayDocFields = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <img src="/icons/document-blue.svg" alt="document" className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">Processing document...</p>
              <p className="text-sm text-gray-500">Extracting fields from your document</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <img src="/icons/document-blue.svg" alt="document" className="w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">No JSON available</p>
              <p className="text-sm text-gray-500">Upload a document to see extracted fields</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-6 border border-gray-100 max-h-96 overflow-auto">
        <div className="overflow-x-auto overflow-y-auto">
          <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre font-mono min-w-max">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DisplayDocFields;