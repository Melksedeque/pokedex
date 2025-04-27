import pokeball from "@/src/assets/images/Pokéball.svg";

export default function Header() {
  return (
    <h1 className="flex flex-row">
      <img src={pokeball} alt="Pokéball" />
      Pokédex
    </h1>
  );
}
