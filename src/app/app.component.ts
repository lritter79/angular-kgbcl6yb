import { Component } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { PokemonTableComponent } from "./pokemon-table/pokemon-table.component";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [HttpClientModule, PokemonTableComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
