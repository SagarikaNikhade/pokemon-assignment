'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';

interface Pokemon {
  name: string;
  url: string;
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=200');
        // console.log("response",response.data.results)
        setPokemons(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokemon:', error);
      }
    };

    fetchPokemons();
  }, []);

  // Filter Pokémons based on search input
  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray p-8">
      <h1 className="text-4xl font-bold text-center mb-6">Pokemon Explorer web app</h1>

      <input
        type="text"
        placeholder="Search Pokemon here..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-1/2 mx-auto p-2 mb-6 border rounded-lg"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPokemons.map((pokemon, index) => {
          const id = index + 1;
          return (
            <Link href={`/pokemon/${id}`} key={id}>
              <div className="bg-black rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 text-center">
                {/* <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                  className="w-24 h-24 mx-auto mb-2"
                /> */}
                <Image 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={pokemon.name} 
                width={150} 
                height={150}
                className="w-24 h-24 mx-auto mb-2"
                 />
                <h2 className="text-xl font-bold capitalize">{pokemon.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}