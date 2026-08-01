import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentang-kami" element={<About />} />
            <Route path="/layanan" element={<Services />} />
            <Route path="/wawasan" element={<Insight />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/syarat-ketentuan" element={<Terms />} />
            <Route path="/artikel" element={<Articles />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;