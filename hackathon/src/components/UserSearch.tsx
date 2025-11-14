// src/components/UserSearch.tsx
import React, { useState } from 'react';

interface UserSearchProps {
  onSearch: (userId: string) => void;
  currentUserId: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSearch, currentUserId }) => {
  const [searchValue, setSearchValue] = useState(currentUserId);
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setIsSearching(true);
      onSearch(searchValue.trim());
      // Reset searching state after a brief delay
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="user-search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="user-search-input"
          placeholder="Search user ID..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <button 
          type="submit" 
          className="user-search-button"
          disabled={isSearching}
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default UserSearch;

