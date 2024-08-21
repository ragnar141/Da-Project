import React, { useState, useEffect } from 'react';
import { Element } from 'react-scroll';
import Home from './components logic/Home';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorListener = (event) => {
      setHasError(true);
      console.error('Caught an error:', event.error);
    };
    window.addEventListener('error', errorListener);

    return () => {
      window.removeEventListener('error', errorListener);
    };
  }, []);

  if (hasError) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return children;
}

function App() {
  const scrollToTreeReferenceGraph = () => {
    const element = document.getElementById('tree-reference-graph');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
      console.log("SCROLLED INTO VIEW");
    }
  };

  return (
    <div className="App">
      <Element name="home" id="home" className="section">
        <Home />
      </Element>
      <Element name="library" id="library" className="section">
        <ErrorBoundary>
          <TreeReferenceGraph onExpand={scrollToTreeReferenceGraph} />
        </ErrorBoundary>
      </Element>
    </div>
  );
}

export default App;
