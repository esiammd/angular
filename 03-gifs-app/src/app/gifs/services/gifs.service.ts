import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY_LOCAL_STORAGE =  'history_gifs';

const loadGifsFromLocalStorage = (): Record<string, Gif[]> => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY_LOCAL_STORAGE) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  searchHistory = signal<Record<string, Gif[]>>(loadGifsFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY_LOCAL_STORAGE, historyString);
  });

    constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs(): void {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      },
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        q: query,
      }
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap((items) => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: items,
        }));
      })
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
