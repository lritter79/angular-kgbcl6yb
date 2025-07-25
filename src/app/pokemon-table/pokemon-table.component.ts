import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { forkJoin, map, observable, Observable, of } from "rxjs";
import { IPokemon, PokemonListResponse } from "../../types";
import { AsyncPipe, NgFor } from "@angular/common";

@Component({
  selector: "pokemon-table",
  standalone: true,
  imports: [NgFor, AsyncPipe],
  templateUrl: "./pokemon-table.component.html",
  styleUrl: "./pokemon-table.component.css",
})
export class PokemonTableComponent implements OnInit {
  pageOffset = 0;
  pokemonObservable$: Observable<IPokemon[]> = new Observable();
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    //load pokemon 1st page
    console.log("init");
    this.pokemonObservable$.subscribe(function logMessage(
      message: any
    ) {
      console.log("text");
    });
    this.loadPokemon(this.pageOffset);
  }

  loadPokemon(offset: number = 0) {
    this.httpClient
      .get<PokemonListResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
      )
      .pipe(
        // take the list of URLs and fetch each individual pokemon
        map((listResponse: PokemonListResponse) => {
          console.log(1);
          const requests = listResponse.results.map((pokemon) =>
            this.httpClient.get<IPokemon>(pokemon.url)
          );
          return forkJoin(requests); // wait for all requests to complete
        })
      )
      .subscribe((pokemonDetails) => {
        console.log(pokemonDetails);
        // do something with the full list of IPokemon
        this.pokemonObservable$ = pokemonDetails;
      });
  }
}
