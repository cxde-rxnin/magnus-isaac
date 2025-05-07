import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Welcome from './sections/Welcome';
import About from './sections/About';
import Projects from './sections/Projects';
import Blog from './sections/Blog';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import AdminDashboard from './AdminDashboard';
import ProjectDetail from './components/ProjectDetail'; 
import BlogDetail from './components/BlogDetail';

// Main layout component for the homepage
const MainLayout = () => (
  <>
    <Navbar />
    <MobileNav />
    <main className="flex-grow md:ml-[18%]">
      <Welcome />
      <About />
      <Projects />
      <Blog />
      <Contact />
    </main>
    <Footer />
  </>
);

// Project detail page layout with navigation
const ProjectLayout = () => (
  <>
    <Navbar />
    <MobileNav />
    <main className="flex-grow md:ml-[18%]">
      <ProjectDetail />
    </main>
    <Footer />
  </>
);

const BlogLayout = () => (
  <>
    <Navbar />
    <MobileNav />
    <main className="flex-grow md:ml-[18%]">
      <BlogDetail />
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
          
          {/* Project detail route */}
          <Route path="/project/:id" element={<ProjectLayout />} />

          {/* Blog detail route */}
          <Route path="/blog/:id" element={<BlogLayout />} />
          
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