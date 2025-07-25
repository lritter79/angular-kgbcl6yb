import { Pipe, PipeTransform } from "@angular/core";
import { IPokemon } from "../types";

@Pipe({
  name: "filter",
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(
    value: IPokemon[] | null,
    filter: string | null = null
  ): IPokemon[] {
    if (!filter) return value ?? [];
    return value?.filter((p) => p.name.includes(filter)) ?? [];
  }
}
