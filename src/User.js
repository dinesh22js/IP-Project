import './App.css';
import React, { useState } from 'react';

function User({ isHome }) {
  const [searchType, setSearchType] = useState('bid');
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  function handleSearchTypeChange(event) {
    setSearchType(event.target.value);
  }

  function handleSearchTermChange(event) {
    setSearchTerm(event.target.value);
  }

  function searchBooks() {
    setIsSearching(true);
    setError('');
  
    // Reset previous search result
    setSearchResult([]);
  
    // Check if searchTerm is empty
    if (searchTerm.trim() === '') {
      setError('Please enter a search term.');
      setIsSearching(false);
      return;
    }
  
    // Fetch books based on search criteria
    fetch(`http://localhost:5014/search?type=${searchType}&term=${searchTerm}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => res.json())
    .then((data) => {
      setSearchResult(data.results); // Update searchResult with the received data
      setIsSearching(false);
    })
    .catch(error => {
      console.error(error);
      setError('An error occurred while searching for books.');
      setIsSearching(false);
    });
  }

  function back() {
    isHome(false); // Call isHome function to navigate back to login
  }

  return (
    <div className="container">
      <div className="quiz-card">
        <h3 className="question">Search Books</h3>
        <select value={searchType} onChange={handleSearchTypeChange} className="option-button">
          <option value="bid">ID</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
          <option value="year_published">Year Published</option>
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className="option-button"
          placeholder={`Enter ${searchType}`}
        />
        <button onClick={searchBooks} className="submit-button" disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {error && <p className="error-message">{error}</p>}

    
      <div className="scrollable-section">
      {/* Book details section */}
      {searchResult.length > 0 && (
        <div className="book-details-container">
          {searchResult.map((book) => (
            <div key={book.bid} className="quiz-card">
              <h3 className="question">Book Details</h3>
              <div className="book-details">
                <p><b>ID</b>: {book.bid}</p>
                <p><b>Title</b>: {book.title}</p>
                <p><b>Author</b>: {book.author}</p>
                <p><b>Genre</b>: {book.genre}</p>
                <p><b>Year Published</b>: {book.year_published}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
      

      <button className="finish-button" onClick={back}>Log Out</button>
    </div>
  );
}

export default User;
