import React from 'react';
import { Element } from 'react-scroll';
import Home from './components logic/Home';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

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
        <TreeReferenceGraph onExpand={scrollToTreeReferenceGraph} />
      </Element>
    </div>
  );
}

export default App;
