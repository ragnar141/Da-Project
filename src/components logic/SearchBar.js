import React, { useState, useRef } from 'react';
import '../components css/SearchBar.css'; // Import the CSS file for styling

const SearchBar = ({ query, results, onQueryChange, onResultClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchResultsRef = useRef(null);
  const searchBarRef = useRef(null); // Reference to the search bar container
  const isClickingResult = useRef(false); // Flag to track if a click on a search result is in progress

  // Function to handle key down events
  const handleKeyDown = (event) => {
    if (results.length > 0) {
      let newIndex = selectedIndex;
      switch (event.key) {
        case 'ArrowDown':
          newIndex = Math.min(selectedIndex + 1, results.length - 1);
          setSelectedIndex(newIndex);
          event.preventDefault(); // Prevent default scrolling behavior
          break;
        case 'ArrowUp':
          newIndex = Math.max(selectedIndex - 1, 0);
          setSelectedIndex(newIndex);
          event.preventDefault(); // Prevent default scrolling behavior
          break;
        case 'Enter':
          if (selectedIndex >= 0) {
            onResultClick(results[selectedIndex]);
          }
          break;
        default:
          break;
      }

      // Scroll into view if the newIndex changes
      if (newIndex !== selectedIndex) {
        const listItem = searchResultsRef.current?.querySelectorAll('li')[newIndex];
        if (listItem) {
          listItem.scrollIntoView({
            block: 'nearest',
            behavior: 'auto',
          });
        }
      }
    }
  };

  // Function to handle blur events
  const handleBlur = () => {
    if (!isClickingResult.current) {
      onQueryChange({ target: { value: '' } }); // Clear the search query
    }
  };

  // Function to handle clicks on search results
  const handleResultMouseDown = () => {
    isClickingResult.current = true;
  };

  const handleResultClick = (result) => {
    onResultClick(result);
    isClickingResult.current = false;
  };

  return (
    <div className="search-bar-container" ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search library"
        value={query}
        onChange={onQueryChange}
        onKeyDown={handleKeyDown} // Attach handleKeyDown directly to onKeyDown
        onBlur={handleBlur} // Attach handleBlur to onBlur
        className="search-bar-input"
        ref={searchResultsRef}
      />
      {results.length > 0 && (
        <div className="search-results-container" ref={searchResultsRef}>
          <ul className="search-results-list">
            {results.map((result, index) => (
              <li
                key={result.id}
                onMouseDown={handleResultMouseDown} // Set the flag on mouse down
                onClick={() => handleResultClick(result)} // Call handleResultClick on click
                onMouseEnter={() => setSelectedIndex(index)} // Update selectedIndex on mouse enter
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