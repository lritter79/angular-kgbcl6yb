import {
  Component,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-sort-arrow",
  templateUrl: "./sort-arrow.component.html",
  styleUrls: ["./sort-arrow.component.css"],
  standalone: true,
})
export class SortArrowComponent {
  @Input() sortState: "asc" | "desc" | null = null;
  @Output() sortChange = new EventEmitter<"asc" | "desc" | null>();

  cycleSort() {
    const nextState =
      this.sortState === null
        ? "desc"
        : this.sortState === "desc"
        ? "asc"
        : null;
    this.sortChange.emit(nextState);
  }
}
