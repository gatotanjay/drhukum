import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home.jsx';
import About from '@/pages/About.jsx';
import Services from '@/pages/Services.jsx';
import Insight from '@/pages/Insight.jsx';
import Contact from '@/pages/Contact.jsx';
import Terms from '@/pages/Terms.jsx';
import Articles from '@/pages/Articles.jsx';
import ArticleDetail from '@/pages/ArticleDetail.jsx';
import AdminLogin from '@/pages/admin/AdminLogin.jsx';
import AdminDashboard from '@/pages/admin/AdminDashboard.jsx';
import AdminPostForm from '@/pages/admin/AdminPostForm.jsx';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute.jsx';

// Layout untuk halaman publik (pakai Navbar & Footer situs)
const PublicLayout = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman publik */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<About />} />
          <Route path="/layanan" element={<Services />} />
          <Route path="/wawasan" element={<Insight />} />
          <Route path="/kontak" element={<Contact />} />
          <Route path="/syarat-ketentuan" element={<Terms />} />
          <Route path="/artikel" element={<Articles />} />
          <Route path="/artikel/:id" element={<ArticleDetail />} />
        </Route>

        {/* Halaman admin (layout terpisah, tanpa Navbar/Footer situs) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/posts/new" element={<AdminProtectedRoute><AdminPostForm /></AdminProtectedRoute>} />
        <Route path="/admin/posts/:id/edit" element={<AdminProtectedRoute><AdminPostForm /></AdminProtectedRoute>} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
