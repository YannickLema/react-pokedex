'use client';

import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import Filters from './components/Filters';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPokemons = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page,
        limit: limit,
      });

      if (nameFilter) {
        queryParams.append('name', nameFilter);
      }

      if (selectedTypes.length > 0) {
        selectedTypes.forEach(type => {
          queryParams.append('types', type);
        });
      }

      const response = await fetch(`https://nestjs-pokedex-api.vercel.app/pokemons?${queryParams}`);
      const data = await response.json();
      setPokemons(prev => [...prev, ...data]);
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop
      === document.documentElement.offsetHeight
    ) {
      if (!loading) {
        setPage(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

  const handleSearch = (name, types) => {
    setPokemons([]);
    setPage(1);
    setNameFilter(name);
    setSelectedTypes(types);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>
      
      <Filters onSearch={handleSearch} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      
      {loading && (
        <div className="text-center mt-4">
          Chargement...
        </div>
      )}
    </main>
  );
}
