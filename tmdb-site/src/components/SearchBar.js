import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <input
                type="text"
                placeholder="Buscar filmes..."
                value={query}
                onChange={handleChange}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                }}
            />
        </div>
    );
};

export default SearchBar;
