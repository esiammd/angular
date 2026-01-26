import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  trendingScrollState = signal<number>(0);

  updateTrendingScrollState(scrollState: number): void {
    this.trendingScrollState.set(scrollState);
  }
}
