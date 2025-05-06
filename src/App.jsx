import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Welcome from './sections/Welcome';
import About from './sections/About';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import AdminDashboard from './AdminDashboard'; // Import the AdminDashboard component

// Main layout component for the homepage
const MainLayout = () => (
  <>
    <Navbar />
    <MobileNav />
    <main className="flex-grow md:ml-[18%]">
      <Welcome />
      <About />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-black text-white">
        <Routes>
          {/* Main portfolio site route */}
          <Route path="/" element={<MainLayout />} />
          
          {/* Admin dashboard route */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* Redirect any other routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;