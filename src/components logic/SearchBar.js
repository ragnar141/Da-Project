import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../components css/SearchBar.css'; // Import the CSS file for styling

const SearchBar = ({ query, results, onQueryChange, onResultClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchResultsRef = useRef(null);

  const handleKeyDown = useCallback((event) => {
    if (results.length > 0) {
      switch (event.key) {
        case 'ArrowDown':
          setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, results.length - 1));
          break;
        case 'ArrowUp':
          setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            onResultClick(results[selectedIndex]);
          }
          break;
        default:
          break;
      }
    }
  }, [results, selectedIndex, onResultClick]);

  const preventScroll = useCallback((event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    const searchBarInput = searchResultsRef.current;
    if (searchBarInput) {
      searchBarInput.addEventListener('keydown', handleKeyDown);
      searchBarInput.addEventListener('wheel', preventScroll);
    }
    return () => {
      if (searchBarInput) {
        searchBarInput.removeEventListener('keydown', handleKeyDown);
        searchBarInput.removeEventListener('wheel', preventScroll);
      }
    };
  }, [handleKeyDown, preventScroll]);

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search library"
        value={query}
        onChange={onQueryChange}
        className="search-bar-input"
        ref={searchResultsRef}
      />
      {results.length > 0 && (
        <div className="search-results-container">
          <ul className="search-results-list">
            {results.map((result, index) => (
              <li
                key={result.id}
                onClick={() => onResultClick(result)}
                className={`search-result-item ${index === selectedIndex ? 'active' : ''}`}
              >
                {result.title}{result.author !== "-" && ` by ${result.author}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
