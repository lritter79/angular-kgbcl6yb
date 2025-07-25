export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export interface IPokemon {
  base_experience: number;
  name: string;
  sprites: {
    //img url
    front_default: string;
  };
}

export type SortProps = keyof Omit<IPokemon, "sprites">;
