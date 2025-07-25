export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: { name: string; url: string }[];
};

export interface IPokemon {
  base_experience: string;
  name: string;
  sprites: {
    //img url
    front_default: string;
  };
}
