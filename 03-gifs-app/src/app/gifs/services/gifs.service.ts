import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, Observable, tap } from 'rxjs';

const GIF_KEY_LOCAL_STORAGE =  'history_gifs';
const GIPHY_LIMIT = 20;

const loadGifsFromLocalStorage = (): Record<string, Gif[]> => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY_LOCAL_STORAGE) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage);
  return gifs;
}

@Injectable({providedIn: 'root'})
export class GifService {
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(false);
  private trendingPage = signal<number>(0);

  trendingGifsGroup = computed<Gif[][]>(() => {
    const groups = [];

    for(let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }
    return groups;
  });

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
    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: GIPHY_LIMIT,
        offset: this.trendingPage() * GIPHY_LIMIT,
      },
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(response.data);
      this.trendingGifs.update((currentGifs) => [...currentGifs, ...gifs]);
      this.trendingPage.update((currentPage) => currentPage + 1);
      this.trendingGifsLoading.set(false);
    });
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: GIPHY_LIMIT,
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
