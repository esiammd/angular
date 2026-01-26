import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  imports: [GifListComponent],
})
export default class SearchPage {
  gifService = inject(GifService);

  gifs = signal<Gif[]>([]);

  onSearch(query: string) {
    if (!query) return;

    this.gifService
      .searchGifs(query)
      .subscribe((response) => this.gifs.set(response));
  }
}
