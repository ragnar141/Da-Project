import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import Courses from './components logic/Courses';
import Contact from './components logic/Contact.js';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />              
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">UNI</Link>
      </div>
      <ul className="nav-links">
      <li className={location.pathname === '/courses' ? 'active' : ''}>
          <Link to="/courses">Courses</Link>
        </li>
        <li className={location.pathname === '/library' ? 'active' : ''}>
          <Link to="/library">Library</Link>
        </li>
       <li className={location.pathname === '/contact' ? 'active' : ''}>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
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
        This is a demo version of an online platform dedicated to providing free self-education resources and courses. Our interdisciplinary approach fosters a holistic understanding of the world, helping learners connect ideas across fields.
      </div>
      <MailingListForm /> {/* Add Mailing List Form at the bottom */}
    </div>
  );
}

function Library() {
  return (
    <div className="library-section">
      <TreeReferenceGraph />
    </div>
  );
}


// Mailing List Form Component
function MailingListForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you can add logic to send the email to your backend or a mailing service
  };

  return (
    <div className="mailing-list-section">
      <h2>Join the mailing list</h2>
      <p>
        Be among the first to hear about new courses and upcoming developments of UNI. 
        Sign up now and join our growing community of learners!
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="mailing-list-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p className="submitted-message">Your email was submitted!</p>
      )}
    </div>
  );
}

export default App;
