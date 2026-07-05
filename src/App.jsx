import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home.jsx';
import About from '@/pages/About.jsx';
import Services from '@/pages/Services.jsx';
import Industries from '@/pages/Industries.jsx';
import Contact from '@/pages/Contact.jsx';
import Terms from '@/pages/Terms.jsx';
import Team from '@/pages/Team.jsx';

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
            <Route path="/industri" element={<Industries />} />
            <Route path="/tim-kami" element={<Team />} />
            <Route path="/kontak" element={<Contact />} />
            <Route path="/syarat-ketentuan" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;