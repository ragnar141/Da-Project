import React, { useState, useRef, useEffect, useCallback } from 'react'; // Import React and necessary hooks
import '../components css/SearchBar.css'; // Import the CSS file for styling

// Define the SearchBar component
const SearchBar = ({ query, setQuery, results, onQueryChange, onResultClick }) => {
  // State to track if the search bar is focused
  const [isFocused, setIsFocused] = useState(false);
  // State to track the currently active search result index
  const [activeIndex, setActiveIndex] = useState(-1);
  // Reference to the search bar container DOM element
  const searchContainerRef = useRef(null);

  // Function to set focus state to true when the search bar gains focus
  const handleFocus = () => setIsFocused(true);

  // Function to handle blur (loss of focus) event
  // Uses useCallback to memoize the function
  const handleBlur = useCallback((event) => {
    // Check if the blur event is not related to any element within the search container
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.relatedTarget)
    ) {
      // Set focus state to false if the blur event is outside the container
      setTimeout(() => {
        setIsFocused(false); // Set focus state to false after a small delay
        setQuery(''); // Reset the query state to an empty string
      }, 100); // Delay in milliseconds
    }
  }, [setQuery]);

  // Function to handle keydown events for navigation and selection
  // Uses useCallback to memoize the function
  const handleKeyDown = useCallback(
    (event) => {
      // If the search bar is not focused, do nothing
      if (!isFocused) return;
      // If there are search results
      if (results.length > 0) {
        if (event.key === 'ArrowDown') {
          // Handle ArrowDown key: Move active index down the list
          setActiveIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % results.length;
            console.log(`ArrowDown pressed, new active index: ${newIndex}`);
            return newIndex;
          });
          event.preventDefault(); // Prevent default scroll behavior
        } else if (event.key === 'ArrowUp') {
          // Handle ArrowUp key: Move active index up the list
          setActiveIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? results.length - 1 : prevIndex - 1;
            console.log(`ArrowUp pressed, new active index: ${newIndex}`);
            return newIndex;
          });
          event.preventDefault(); // Prevent default scroll behavior
        } else if (event.key === 'Enter') {
          // Handle Enter key: Select the active search result
          if (activeIndex >= 0 && activeIndex < results.length) {
            console.log(`Enter pressed, selected index: ${activeIndex}`);
            onResultClick(results[activeIndex]); // Call the onResultClick function
            setQuery(results[activeIndex].title); // Update the query with the selected title
            setIsFocused(false); // Set focus state to false
          }
        }
      }
    },
    [activeIndex, results, isFocused, onResultClick, setQuery] // Dependencies for the useCallback hook
  );

  // Function to handle clicks outside the search container
  // Uses useCallback to memoize the function
  const handleClickOutside = useCallback((event) => {
    // Check if the click event occurred outside the search container
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      // Set focus state to false if the click is outside the container
      setIsFocused(false);
      setQuery(''); // Reset the query state to an empty string
    }
  }, [setQuery]);

  // useEffect to add and remove the mousedown event listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener on mount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Remove event listener on unmount
    };
  }, [handleClickOutside]); // Dependency for the useEffect hook

  // useEffect to add and remove the keydown event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown); // Add event listener on mount
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Remove event listener on unmount
    };
  }, [handleKeyDown]); // Dependency for the useEffect hook

  // Return the JSX for rendering the SearchBar component
  return (
    <div
      className="search-bar-container"
      ref={searchContainerRef} // Reference to the search container
      onFocus={handleFocus} // Event handler for focus
      onBlur={handleBlur} // Event handler for blur
    >
      <input
        type="text"
        placeholder="Search library"
        value={query} // Controlled input value
        onChange={onQueryChange} // Event handler for input change
        className="search-bar-input"
      />
      {isFocused && results.length > 0 && (
        <div className="search-results-container">
          <ul className="search-results-list">
            {results.map((result, index) => (
              <li
                key={result.id} // Unique key for each result item
                onClick={() => {
                  onResultClick(result); // Call the onResultClick function
                  setQuery(result.title); // Update the query with the selected title
                }} // Event handler for click
                className={`search-result-item ${index === activeIndex ? 'active' : ''}`} // Conditional class for active item
              >
                {result.title} 
                {result.author !== '-' && ` by ${result.author}`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Export the SearchBar component as the default export
export default SearchBar;
