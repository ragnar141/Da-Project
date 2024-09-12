import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function App() {
    return (
      <Router>
        <div className="App">
          <nav className="navbar">
            <div className="logo">
              <Link to="/">UNI</Link> {/* Separate logo component */}
            </div>
            <ul className="nav-links">
              <li>
                <Link to="/library">Library</Link> {/* Link to the library page */}
              </li>
              <li>
                <Link to="/courses">Courses</Link> {/* Link to the courses page */}
              </li>
              <li>
                <Link to="/contact">Contact</Link> {/* Link to the contact page */}
              </li>
            </ul>
          </nav>

          {/* Define routes for each section */}
          <Routes>
            <Route path="/" element={
              <div className="home-container">
                <div className="title-section">
                  <div className="section welcome-section">
                    Welcome to
                  </div>
                  <div className="section uni-section">
                    UNI
                  </div>
                </div>
                <div className="section description-section">
                  Uni is an online platform dedicated to providing free self-education resources and courses. Our interdisciplinary approach fosters a holistic understanding of the world, helping learners connect ideas across fields.
                </div>
              </div>
            } />
            <Route path="/library" element={<Library />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    );
}

// Define the Library component to render TreeReferenceGraph
function Library() {
  return (
    <div className="library-section">
      <h1 className="library-title">Library</h1>
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

export default App;
