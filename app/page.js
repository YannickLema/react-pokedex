'use client';

import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import Filters from './components/Filters';

export default function Home() {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [nameFilter, setNameFilter] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemons = async (isNewSearch = false) => {
    try {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      let pokemonList = [];

      if (selectedTypes.length > 0) {
        // Récupérer les Pokémon pour chaque type sélectionné
        const typePromises = selectedTypes.map(async (type) => {
          const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
          const data = await response.json();
          return data.pokemon.map(p => p.pokemon);
        });

        const typeResults = await Promise.all(typePromises);
        
        // Trouver les Pokémon qui ont tous les types sélectionnés
        let commonPokemons = typeResults[0];
        for (let i = 1; i < typeResults.length; i++) {
          commonPokemons = commonPokemons.filter(pokemon =>
            typeResults[i].some(p => p.url === pokemon.url)
          );
        }

        // Récupérer les détails de chaque Pokémon
        const pokemonPromises = commonPokemons.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          return response.json();
        });

        pokemonList = await Promise.all(pokemonPromises);
      } else {
        // Si pas de type sélectionné, utiliser la pagination normale
        const offset = (currentPage - 1) * limit;
        let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
        
        if (nameFilter.trim()) {
          // Si on a un filtre de nom, chercher un Pokémon spécifique
          url = `https://pokeapi.co/api/v2/pokemon/${nameFilter.trim().toLowerCase()}`;
          const response = await fetch(url);
          if (response.ok) {
            const data = await response.json();
            pokemonList = [data];
          }
        } else {
          // Sinon, récupérer la liste paginée
          const response = await fetch(url);
          const data = await response.json();
          const fetchPromises = data.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            return pokemonResponse.json();
          });
          pokemonList = await Promise.all(fetchPromises);
        }
      }

      // Filtrer par nom si nécessaire
      if (nameFilter.trim() && selectedTypes.length > 0) {
        pokemonList = pokemonList.filter(pokemon =>
          pokemon.name.toLowerCase().includes(nameFilter.trim().toLowerCase())
        );
      }

      setHasMore(!nameFilter && selectedTypes.length === 0 && pokemonList.length === limit);

      if (isNewSearch || currentPage === 1) {
        setPokemons(pokemonList);
        setPage(1);
      } else {
        setPokemons(prev => [...prev, ...pokemonList]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des Pokémon:', error);
      setPokemons([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons(true);
  }, []);

  useEffect(() => {
    if (page > 1 && !nameFilter && selectedTypes.length === 0) {
      fetchPokemons(false);
    }
  }, [page]);

  const handleScroll = () => {
    if (
      !loading &&
      hasMore &&
      window.innerHeight + document.documentElement.scrollTop + 100 >= document.documentElement.offsetHeight
    ) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleSearch = (name, types) => {
    setNameFilter(name);
    setSelectedTypes(types);
    fetchPokemons(true);
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2">Chargement des Pokémon...</p>
        </div>
      )}
      
      {!loading && !hasMore && pokemons.length > 0 && (
        <div className="text-center mt-4 text-gray-600">
          Plus de Pokémon à charger
        </div>
      )}
      
      {!loading && pokemons.length === 0 && (
        <div className="text-center mt-4 text-gray-600">
          Aucun Pokémon trouvé
        </div>
      )}
    </main>
  );
}
