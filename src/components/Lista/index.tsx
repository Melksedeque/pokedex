import { useEffect, useState } from "react";

export default function ListaPokedex() {
  // Componente para listar os pokemons buscando na API
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://pokeapi.co/v2/pokemon?offset=20&limit=20")
      .then((res) => res.json())
      .then((res) => {
        setPokemon(res.results);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ul>
          {pokemon.map((pokemon, index) => (
            <li key={index}>{pokemon}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
