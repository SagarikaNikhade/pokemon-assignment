"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy"
  | "default";

interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  abilities: { ability: { name: string } }[];
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  moves: { move: { name: string } }[];
  height: number;
  weight: number;
}

// Type color mapping
const typeColors: Record<PokemonType, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  default: "#68A090",
};

export default function PokemonDetailPage() {
  const params = useParams();
  const id: any = params.id;
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showStats, setShowStats] = useState(false);

  // Get details for the Pokémon
  const fetchPokemonDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      setPokemon(res.data);
    } catch (err) {
      setError("Failed to load Pokémon data. Please try again.");
      console.error("Error fetching Pokémon:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPokemonDetails();
    }
  }, [id]);

  // Get background gradient based on Pokémon type
  const getTypeGradient = () => {
    if (!pokemon || !pokemon.types || pokemon.types.length === 0) {
      return `linear-gradient(to bottom right, ${typeColors.default}, white)`;
    }

    const primaryType = pokemon.types[0].type.name;
    // const primaryColor = typeColors[primaryType] || typeColors.default;
    const primaryColor =
      typeColors[primaryType as PokemonType] || typeColors.default;

    if (pokemon.types.length === 1) {
      return `linear-gradient(to bottom right, ${primaryColor}, white)`;
    }

    const secondaryType = pokemon.types[1].type.name;
    // const secondaryColor = typeColors[secondaryType] || typeColors.default;
    const secondaryColor = isPokemonType(secondaryType)
      ? typeColors[secondaryType]
      : typeColors.default;

    return `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`;
  };

  // Format stats name for better display
  const formatStatName = (statName: string) => {
    switch (statName) {
      case "hp":
        return "HP";
      case "attack":
        return "Attack";
      case "defense":
        return "Defense";
      case "special-attack":
        return "Sp. Atk";
      case "special-defense":
        return "Sp. Def";
      case "speed":
        return "Speed";
      default:
        return statName.replace("-", " ");
    }
  };

  const isPokemonType = (type: string): type is PokemonType => {
    return type in typeColors;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Pokémon data...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error || !pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <p className="text-red-500 text-xl mb-4">
            {error || "Pokémon not found"}
          </p>
          <Link href="/">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate stat percentage for progress bars (max stat is generally 255)
  const getStatPercentage = (value: number) => {
    return Math.min(Math.max((value / 255) * 100, 5), 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black p-4 flex justify-between items-center">
        <Link href="/">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
            onClick={() => setShowStats(!showStats)}
          >
            <span>←</span> {showStats ? "Show Stats" : "Back"}
          </button>
        </Link>
        <div className="w-24"></div>
      </div>

      <div
        className="w-full h-64 flex items-center justify-center relative overflow-hidden"
        style={{ background: getTypeGradient() }}
      >
        <div className="absolute w-full h-full bg-black bg-opacity-10"></div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold capitalize text-white drop-shadow-lg mb-2">
            {pokemon.name}
          </h1>
        </div>
      </div>

      <div className="w-full px-4 pb-16">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - Pokemon image */}
          <div className="col-span-12 lg:col-span-3 -mt-20">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6 flex flex-col items-center">
              {/* <img
                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-48 h-48 -mt-24 mb-4 z-20 drop-shadow-lg"
              /> */}
              <Image
                src={
                  pokemon.sprites.other?.["official-artwork"]?.front_default ||
                  pokemon.sprites.front_default
                }
                alt={pokemon.name}
                className="w-48 h-48 -mt-24 mb-4 z-20 drop-shadow-lg"
                width={192}
                height={192}
              />
              {/* Type badges */}
              <div className="flex gap-2 mt-2 mb-4 flex-wrap justify-center">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className="capitalize px-4 py-1 rounded-full text-white font-medium"
                    // style={{ backgroundColor: typeColors[type.type.name] || typeColors.default }}
                    style={{
                      backgroundColor: isPokemonType(type.type.name)
                        ? typeColors[type.type.name]
                        : typeColors.default,
                    }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              {/* Physical attributes */}
              <div className="grid grid-cols-2 w-full gap-4 mt-2">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="text-lg font-semibold">
                    {(pokemon.height / 10).toFixed(1)}m
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg font-semibold">
                    {(pokemon.weight / 10).toFixed(1)}kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right content area */}
          <div className="col-span-12 lg:col-span-9">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Abilities section */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Abilities
                  </h2>
                  <ul className="space-y-2">
                    {pokemon.abilities.map((ability, index) => (
                      <li
                        key={index}
                        className="capitalize font-medium text-gray-700 flex items-center"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                        {ability.ability.name.replace("-", " ")}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats section */}
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                    Stats
                  </h2>
                  <div className="space-y-3">
                    {pokemon.stats.map((stat, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {formatStatName(stat.stat.name)}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {stat.base_stat}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            // style={{
                            //   width: `${getStatPercentage(stat.base_stat)}%`,
                            //   backgroundColor: typeColors[pokemon.types[0].type.name] || typeColors.default
                            // }}
                            style={{
                              width: `${getStatPercentage(stat.base_stat)}%`,
                              backgroundColor: isPokemonType(
                                pokemon.types[0].type.name
                              )
                                ? typeColors[pokemon.types[0].type.name]
                                : typeColors.default,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Moves section - full width */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Moves
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {pokemon.moves.map((move, index) => (
                    <div
                      key={index}
                      className="capitalize bg-gray-100 rounded p-2 text-gray-700 text-sm font-medium text-center hover:bg-gray-200 transition"
                    >
                      {move.move.name.replace("-", " ")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
