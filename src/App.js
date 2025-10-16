import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import HomePage from './components/HomePage';
import InvoiceDetailPage from './components/InvoiceDetailPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}