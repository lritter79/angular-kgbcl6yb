import { Pipe, PipeTransform } from "@angular/core";
import { IPokemon } from "../types";

@Pipe({
  name: "orderBy",
  standalone: true,
})
export class OrderByPipe implements PipeTransform {
  transform(
    value: IPokemon[] | null,
    order: "asc" | "desc" | null,
    property: keyof Omit<IPokemon, "sprites"> | null
  ): IPokemon[] {
    if (value === null) return [];
    if (property === null || order === null) return value;

    return value.sort((a, b) => {
      let compareValueA = a[property];
      let compareValueB = b[property];
      if (order === "asc") {
        if (
          typeof compareValueA == "number" &&
          typeof compareValueB == "number"
        )
          return compareValueA - compareValueB;
        else {
          return compareValueA
            .toString()
            .localeCompare(compareValueB.toString());
        }
      } else if (order === "desc") {
        if (
          typeof compareValueA == "number" &&
          typeof compareValueB == "number"
        )
          return compareValueB - compareValueA;
        else {
          return compareValueB
            .toString()
            .localeCompare(compareValueA.toString());
        }
      }
      return 0;
    });
  }
}
