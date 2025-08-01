import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IPokemon, PokemonListResponse } from "../types";
import { forkJoin, map, Observable, switchMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PokemonService {
  limit: number = 10;
  private url = "https://pokeapi.co/api/v2/pokemon";
  constructor(private httpClient: HttpClient) {}

  getPokemon(offset: number): Observable<IPokemon[]> {
    return this.httpClient
      .get<PokemonListResponse>(
        `${this.url}?limit=${this.limit}&offset=${offset}`
      )
      .pipe(
        // take the list of URLs and fetch each individual pokemon
        switchMap((listResponse: PokemonListResponse) => {
          const requests: Observable<IPokemon>[] =
            listResponse.results.map((pokemon) =>
              this.httpClient.get<IPokemon>(pokemon.url)
            );
          return forkJoin(requests); // wait for all requests to complete
        })
      );
  }
}
