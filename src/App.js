import React, { useState, useEffect } from 'react';
import { Element, scroller } from 'react-scroll';
import Home from './components logic/Home';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function App() {
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

  // Function to handle expansion state from TreeReferenceGraph
  const handleExpand = (expanded) => {
    setIsLibraryExpanded(expanded); // Update the state when the graph expands or collapses
  
    if (expanded) {
      // Delay the scroll to allow expansion to complete
      setTimeout(() => {
        const element = document.getElementById('tree-reference-graph');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500); // Adjust the delay to match the transition duration
    }
  };

  // Scroll to top on initial render or refresh and prevent the browser from restoring scroll position
  useEffect(() => {
    window.history.scrollRestoration = 'manual'; // Disable automatic scroll restoration
    window.scrollTo(0, 0);  // Scroll to top manually on page load
  }, []);

  return (
    <div className="App">
      {/* Conditionally hide the navbar if the library is expanded */}
      <nav className={`navbar ${isLibraryExpanded ? 'hidden' : ''}`}>
        <ul className="nav-links">
          <li onClick={() => scroller.scrollTo('home', { smooth: true })}>UNI</li>
          <li onClick={() => scroller.scrollTo('library', { smooth: true })}>library</li>
          <li onClick={() => scroller.scrollTo('courses', { smooth: true })}>courses</li>
          <li onClick={() => scroller.scrollTo('contact', { smooth: true })}>contact</li>
        </ul>
      </nav>

      <Element name="home" id="home" className="section">
        <Home />
      </Element>

      <Element name="library" id="library" className="section">
        <TreeReferenceGraph onExpand={handleExpand} />
      </Element>

      {/* Placeholder elements */}
      <Element name="courses" id="courses" className="section">
        <div>Courses Section (To Be Developed)</div>
      </Element>

      <Element name="contact" id="contact" className="section">
        <div>Contact Section (To Be Developed)</div>
      </Element>
    </div>
  );
}

export default App;
