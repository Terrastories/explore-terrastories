import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from 'pages/home';
import Community from 'pages/community';

import Layout from 'components/Layout';
import NotFound from 'components/NotFound';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="community/:slug" element={<Community />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
