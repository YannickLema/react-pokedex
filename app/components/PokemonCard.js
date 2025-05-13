import Image from 'next/image';

const PokemonCard = ({ pokemon }) => {
  const getTypeColor = (type) => {
    const colors = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300'
    };
    
    // Vérification du type et conversion en chaîne de caractères si nécessaire
    const typeString = typeof type === 'object' ? type.name : type;
    return colors[typeString.toLowerCase()] || 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
      <div className="relative w-full h-48 mb-4">
        <Image
          src={pokemon.image}
          alt={pokemon.name}
          fill
          className="object-contain"
        />
      </div>
      
      <div className="text-center">
        <p className="text-gray-500 mb-1">#{pokemon.id.toString().padStart(3, '0')}</p>
        <h2 className="text-xl font-bold mb-2 capitalize">{pokemon.name}</h2>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {pokemon.types.map((type) => (
            <span
              key={typeof type === 'object' ? type.name : type}
              className={`${getTypeColor(type)} text-white px-3 py-1 rounded-full text-sm`}
            >
              {typeof type === 'object' ? type.name : type}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard; 