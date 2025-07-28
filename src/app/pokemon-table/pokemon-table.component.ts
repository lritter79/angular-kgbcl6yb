import { Component, OnInit } from "@angular/core";
import { IPokemon, SortProps } from "../../types";
import { NgFor } from "@angular/common";
import { OrderByPipe } from "../order-by.pipe";
import { FormsModule } from "@angular/forms";
import { SortArrowComponent } from "./sort-arrow/sort-arrow.component";
import { FilterPipe } from "../filter.pipe";
import { PokemonService } from "../pokemon.service";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

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

  // Subject to emit new page offset values when the user navigates
  private pageChange$ = new Subject<number>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    // Subscribe to pageChange$ and wait 200ms after the last emission before calling loadPokemon
    // This prevents rapid clicking from triggering too many API calls
    this.pageChange$.pipe(debounceTime(200)).subscribe((offset) => {
      this.pageOffset = offset;
      this.loadPokemon();
    });

    // Trigger initial load of Pokémon data
    this.pageChange$.next(this.pageOffset);
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
    this.updateSort(null, null);
  }

  updateSort(
    field: SortProps | null,
    direction: "asc" | "desc" | null
  ) {
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
        this.resetFilters(); // Reset filters when new data is loaded
      },
      error: (err) => {
        console.error("Failed to fetch pokemon:", err);
      },
    });
  }

  nextPage() {
    // Reset filters and emit the new offset
    // loadPokemon will only be called 200ms after the last pageChange$.next()
    this.pageChange$.next(this.pageOffset + 10);
  }

  prevPage() {
    if (this.pageOffset >= 10) {
      // Same debounce behavior for going to the previous page
      this.pageChange$.next(this.pageOffset - 10);
    }
  }
}
