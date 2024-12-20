import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import QuotesPage from './Components/QuotesPage';
import CreateQuotePage from './Components/CreateQuotePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/create-quote" element={<CreateQuotePage />} />
      </Routes>
    </Router>
  );
}

export default App;
