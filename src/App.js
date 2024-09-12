import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function App() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          {/* Define routes for each section */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    );
}

function Navbar() {
  const location = useLocation(); // Get current location

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">UNI</Link>
      </div>

      <div className="current-page-container">
        {location.pathname === '/library' && <span className="current-page">Library</span>}
        {location.pathname === '/courses' && <span className="current-page">Courses</span>}
        {location.pathname === '/contact' && <span className="current-page">Contact</span>}
      </div>

      <ul className="nav-links">
        {location.pathname !== '/library' && (
          <li>
            <Link to="/library">Library</Link>
          </li>
        )}
        {location.pathname !== '/courses' && (
          <li>
            <Link to="/courses">Courses</Link>
          </li>
        )}
        {location.pathname !== '/contact' && (
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

// Define the Library component to render TreeReferenceGraph
function Library() {
  return (
    <div className="library-section">
      <TreeReferenceGraph />
    </div>
  );
}

// Placeholder components for future sections
function Courses() {
  return <div>Courses Section (To Be Developed)</div>;
}

function Contact() {
  return <div>Contact Section (To Be Developed)</div>;
}

function Home() {
  return (
    <div className="home-container">
      <div className="welcome_statement">
        <div className="welcome_to">
          Welcome to
        </div>
        <div className="big_UNI">
          UNI
        </div>
      </div>
      <div className="description">
        Uni is an online platform dedicated to providing free self-education resources and courses. Our interdisciplinary approach fosters a holistic understanding of the world, helping learners connect ideas across fields.
      </div>
    </div>
  );
}

export default App;
