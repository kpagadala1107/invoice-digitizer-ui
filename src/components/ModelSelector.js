import React, { useState, useRef, useEffect } from 'react';

const MODEL_OPTIONS = [
  {
    name: 'Invoice',
    description: 'Vendor, customer, totals, tax, line items, invoice ID, date, etc.'
  },
  {
    name: 'Receipt',
    description: 'Merchant name, transaction date/time, total, taxes, items purchased, etc.'
  },
  {
    name: 'Business Card',
    description: 'Contact info: name, company, email, phone, address, website, etc.'
  },
  {
    name: 'Identity Document',
    description: 'ID type, name, DOB, nationality, document number, expiration date. Works for passports, driver\'s licenses, etc.'
  },
  {
    name: 'Tax US W-2',
    description: 'Extracts US W-2 tax form fields (wages, employer, employee info).'
  },
  {
    name: 'Bank Statement',
    description: 'Account number, balance, transactions, bank name, etc.'
  },
  {
    name: 'Credit Card',
    description: 'Card type, number, expiry, cardholder name (masked for security).'
  },
  {
    name: 'Contract',
    description: 'Parties involved, dates, clauses, signatures, key terms.'
  },
  {
    name: 'Health Insurance Card',
    description: 'Member name, policy number, provider info, effective date, etc.'
  },
];

const ModelSelector = ({ selectedModel, onModelChange, onOpenChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Notify parent when dropdown open state changes
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);


  // Filter models based on search term
  const filteredModels = MODEL_OPTIONS.filter(model =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        setFocusedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex(prev => 
          prev < filteredModels.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < filteredModels.length) {
          handleSelectModel(filteredModels[focusedIndex]);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectModel = (model) => {
    onModelChange(model.name);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    if (filteredModels.length > 0) {
      setFocusedIndex(0);
    }
  };

  const selectedModelData = MODEL_OPTIONS.find(model => model.name === selectedModel);

  return (
   <div className={`bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 relative ${className}`} ref={dropdownRef}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Document Type</h2>
      
      <div className="space-y-6">
        {/* Input Field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            className={`w-full px-4 py-3 text-sm border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-300 transform ${
              isOpen 
                ? 'border-blue-500 bg-blue-50 scale-105' 
                : selectedModel
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            placeholder="Search and select a document type..."
            value={isOpen ? searchTerm : (selectedModel || '')}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
          />
          
          {/* Dropdown Arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                isOpen ? 'rotate-180 text-blue-500' : selectedModel ? 'text-green-500' : 'text-gray-400'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Selected Model Description */}
        {selectedModelData && !isOpen && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-800 mb-1">{selectedModelData.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedModelData.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white bg-opacity-100 border-2 border-blue-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
            {filteredModels.length > 0 ? (
              filteredModels.map((model, index) => (
                <div
                  key={model.name}
                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-200 ${
                    index === focusedIndex
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-900 transform scale-[1.02]'
                      : 'hover:bg-gray-50 hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => handleSelectModel(model)}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      index === focusedIndex 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gray-200'
                    }`}>
                      <svg className={`w-3 h-3 ${index === focusedIndex ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1 text-sm">
                        {model.name}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {model.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-gray-500 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">No models found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try searching for "{searchTerm}"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelector;