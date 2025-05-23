import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html'
})
export default class SearchPageComponent {
  gifService = inject(GifService);
  gifs = signal<Gif[]>([]);
  search = signal<string>('');

  onSearch(query: string) {
    this.gifService.searchGifs(query).subscribe((response) => {
      this.gifs.set(response);
      this.search.set('');
    });
  }
}
