'use client';

import { useState, useEffect } from 'react';

const Filters = ({ onSearch }) => {
  const [name, setName] = useState('');
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        setTypes(data.results);
      } catch (error) {
        console.error('Erreur lors de la récupération des types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTypes();
  }, []);

  const handleTypeToggle = (typeName) => {
    setSelectedTypes(prev => {
      const isSelected = prev.includes(typeName);
      if (isSelected) {
        return prev.filter(t => t !== typeName);
      } else {
        return [...prev, typeName];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(name, selectedTypes);
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des filtres...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rechercher un Pokémon..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Rechercher
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type.name}
            type="button"
            onClick={() => handleTypeToggle(type.name)}
            className={`px-4 py-2 rounded-full border transition-colors ${
              selectedTypes.includes(type.name)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>
    </form>
  );
};

export default Filters; 