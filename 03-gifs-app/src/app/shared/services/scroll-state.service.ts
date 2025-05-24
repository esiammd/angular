import { Injectable, signal } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ScrollStateService {
  pagesScrollState = signal<Record<string, number>>({});
}
