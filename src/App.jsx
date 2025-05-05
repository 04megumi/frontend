import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LogIn from './pages/LogIn';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ImageCarousel from './pages/ImageCarousel';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<LogIn />} /> {/* 默认路由指向登录页 */}
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/imageCarousel" element={<ImageCarousel />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
