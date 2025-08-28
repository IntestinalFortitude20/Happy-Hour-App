import { useState } from 'react';
import './SearchBar.css';

const eventTypes = ['Happy Hour', 'Bingo', 'Trivia', 'Live Music', 'Jam Session', 'Other'];
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function SearchBar({ onSearch }) {
  const [searchField, setSearchField] = useState('name');
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    onSearch(searchField, searchValue);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getSearchOptions = () => {
    switch (searchField) {
      case 'eventType':
        return eventTypes;
      case 'dayOfWeek':
        return daysOfWeek;
      default:
        return null;
    }
  };

  const searchOptions = getSearchOptions();

  return (
    <div className="search-bar">
      <div className="search-controls">
        <select 
          value={searchField} 
          onChange={(e) => {
            setSearchField(e.target.value);
            setSearchValue('');
          }}
          className="search-field-select"
        >
          <option value="name">Name</option>
          <option value="address">Address</option>
          <option value="eventType">Event Type</option>
          <option value="dayOfWeek">Day of Week</option>
          <option value="specials">Specials</option>
        </select>

        {searchOptions ? (
          <select 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          >
            <option value="">Select {searchField}</option>
            {searchOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Search by ${searchField}...`}
            className="search-input"
          />
        )}

        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;