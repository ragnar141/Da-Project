import React from 'react';
import '../components css/SearchBar.css'; // Import the CSS file for styling

const SearchBar = ({ query, results, onQueryChange, onResultClick }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search library"
        value={query}
        onChange={onQueryChange}
        className="search-bar-input"
      />
      {results.length > 0 && (
        <div className="search-results-container">
          <ul className="search-results-list">
            {results.map((result) => (
              <li key={result.id} onClick={() => onResultClick(result)} className="search-result-item">
                {result.title} by {result.author}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;