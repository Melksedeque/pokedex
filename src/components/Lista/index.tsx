import { useState } from "react";

export default function ListaPokedex() {
  // Componente para listar os pokemons buscando na API
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
}
