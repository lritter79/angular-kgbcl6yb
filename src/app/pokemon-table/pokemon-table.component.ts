import { Component, OnInit } from "@angular/core";
import { IPokemon, SortProps } from "../../types";
import { NgFor } from "@angular/common";
import { OrderByPipe } from "../order-by.pipe";
import { FormsModule } from "@angular/forms";
import { SortArrowComponent } from "./sort-arrow/sort-arrow.component";
import { FilterPipe } from "../filter.pipe";
import { PokemonService } from "../pokemon.service";
@Component({
  selector: "pokemon-table",
  standalone: true,
  imports: [
    NgFor,
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
  pokemonList: IPokemon[] = [];
  orderBy: "asc" | "desc" | null = null;
  orderByArr = ["", "asc", "desc"];
  sortBy: SortProps | null = null;
  sortByArr = ["", "base_experience", "name"];
  filterName: string | null = null;
  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    //load pokemon 1st page
    console.log("init");

    this.loadPokemon();
  }

  updateFilter(target: EventTarget | null) {
    if (target) {
      const input = target as HTMLInputElement;
      const value = input.value;
      this.filterName = value;
    }
  }

  resetFilters() {
    this.filterName = null;
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
  loadPokemon() {
    this.pokemonService.getPokemon(this.pageOffset).subscribe({
      next: (data) => {
        this.pokemonList = data;
      },
      error: (err) => {
        console.error("Failed to fetch pokemon:", err);
      },
    });
  }

  nextPage() {
    this.pageOffset += 10;
    this.resetFilters();
    this.loadPokemon();
  }

  prevPage() {
    if (this.pageOffset >= 10) {
      this.pageOffset -= 10;
      this.resetFilters();
      this.loadPokemon();
    }
  }
}
