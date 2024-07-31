import React from 'react';
import { Element, scroller } from 'react-scroll';
import Home from './components logic/Home';
import TreeReferenceGraph from './components logic/TreeReferenceGraph';
import './App.css';

function App() {
  const handleScroll = (event) => {
    const direction = event.deltaY > 0 ? 'down' : 'up';
    const sections = ['home', 'library'];

    const currentSection = sections.find((section) => {
      const element = document.getElementById(section);
      if (!element) {
        console.error(`Element with id '${section}' not found.`);
        return false;
      }
      const rect = element.getBoundingClientRect();
      return rect.top === 0;
    });

    if (!currentSection) {
      console.error('Current section not found.');
      return;
    }

    const currentIndex = sections.indexOf(currentSection);
    let nextIndex = direction === 'down' ? currentIndex + 1 : currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < sections.length) {
      scroller.scrollTo(sections[nextIndex], {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      });
    }
  };

  return (
    <div className="App" onWheel={handleScroll}>
      <Element name="home" id="home" className="section">
        <Home />
      </Element>
      <Element name="library" id="library" className="section">
        <TreeReferenceGraph />
      </Element>
    </div>
  );
}

export default App;
