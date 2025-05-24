import { ScrollStateService } from './../../../shared/services/scroll-state.service';
import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
// import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';

const PAGE_NAME = 'trending';

@Component({
  selector: 'gifs-trending-page',
  // imports: [GifListComponent],
  templateUrl: './trending-page.component.html'
})
export default class TrendingPageComponent implements AfterViewInit {
  gifService = inject(GifService);
  scrollStateService = inject(ScrollStateService);

  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.pagesScrollState()[PAGE_NAME];
  }

  onScroll() {
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    if(!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;

    this.scrollStateService.pagesScrollState.update(current => ({
      ...current,
      [PAGE_NAME]: scrollTop,
    }));

    const isAtBottom = scrollTop + clientHeight + 300 >= scrollHeight;
    if (isAtBottom) {
      this.gifService.loadTrendingGifs();
    }
  }
}
