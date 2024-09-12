import React, { useState } from 'react';
import { Element, scroller } from 'react-scroll';
import Home from './components logic/Home';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function App() {
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(false);

  // Function to handle expansion state from TreeReferenceGraph
  const handleExpand = (expanded) => {
    setIsLibraryExpanded(expanded);

    if (expanded) {
      // Delay the scroll to allow expansion to complete
      setTimeout(() => {
        const element = document.getElementById('tree-reference-graph');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  };

  return (
    <div className="App">
      <nav className={`navbar ${isLibraryExpanded ? 'hidden' : ''}`}>
        <ul className="nav-links">
          <li onClick={() => scroller.scrollTo('home', { smooth: true })}>UNI</li>
          <li onClick={() => scroller.scrollTo('library', { smooth: true })}>Library</li>
          <li onClick={() => scroller.scrollTo('courses', { smooth: true })}>Courses</li>
          <li onClick={() => scroller.scrollTo('contact', { smooth: true })}>Contact</li>
        </ul>
      </nav>

      <Element name="home" id="home" className="section">
        <Home />
      </Element>

      <Element name="library" id="library" className={`section ${isLibraryExpanded ? 'library-expanded' : ''}`}>
        <div className="library-section">
          <h1 className={`library-title ${isLibraryExpanded ? 'expanded' : ''}`}>Library</h1>
          <div className="library-info">
            <p>Hover over the graph to enter the library. To exit - move your cursor all the way to the left.</p>
            <p>Use the search bar to find texts by author or title.</p>
            <p>Customize the displayed texts by selecting or deselecting tags in the sidebar on the right.</p>
            <p>Zoom in and out while hovering over the graph's empty spaces.</p>
            <p>Hover over a circle to see detailed information about the text.</p>
          </div>
          <TreeReferenceGraph onExpand={handleExpand} />
        </div>
      </Element>

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
