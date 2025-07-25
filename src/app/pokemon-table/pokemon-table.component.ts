import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import {
  IPokemon,
  PokemonListResponse,
  SortProps,
} from "../../types";
import { AsyncPipe, NgFor } from "@angular/common";
import { OrderByPipe } from "../order-by.pipe";
import { FormsModule } from "@angular/forms";
import { SortArrowComponent } from "./sort-arrow/sort-arrow.component";
import { FilterPipe } from "../filter.pipe";
@Component({
  selector: "pokemon-table",
  standalone: true,
  imports: [
    NgFor,
    AsyncPipe,
    OrderByPipe,
    FormsModule,
    SortArrowComponent,
    FilterPipe,
  ],
  templateUrl: "./pokemon-table.component.html",
  styleUrl: "./pokemon-table.component.css",
})
export class PokemonTableComponent implements OnInit {
  pageOffset = 0;
  pokemonObservable$: Observable<IPokemon[]> = new Observable();
  orderBy: "asc" | "desc" | null = null;
  orderByArr = ["", "asc", "desc"];
  sortBy: SortProps | null = null;
  sortByArr = ["", "base_experience", "name"];
  filterName: string | null = null;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    //load pokemon 1st page
    console.log("init");

    this.loadPokemon(this.pageOffset);
  }

  updateFilter(target: EventTarget | null) {
    if (target) {
      const input = target as HTMLInputElement;
      const value = input.value;
      this.filterName = value;
    }
  }

  updateSort(
    field: SortProps | null,
    direction: "asc" | "desc" | null
  ) {
    console.log(field);
    if (direction === null) {
      this.sortBy = null;
      this.orderBy = null;
    } else {
      this.sortBy = field;
      this.orderBy = direction;
    }
  }
  loadPokemon(offset: number = 0) {
    this.httpClient
      .get<PokemonListResponse>(
        `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${offset}`
      )
      .pipe(
        // take the list of URLs and fetch each individual pokemon
        map((listResponse: PokemonListResponse) => {
          const requests = listResponse.results.map((pokemon) =>
            this.httpClient.get<IPokemon>(pokemon.url)
          );
          return forkJoin(requests); // wait for all requests to complete
        })
      )
      .subscribe((pokemonDetails) => {
        this.pokemonObservable$ = pokemonDetails;
      });
  }
}
