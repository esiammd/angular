import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, delay, map, Observable, of, tap, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string, Country[]>();
  private queryCacheCountry = new Map<string, Country[]>();
  private queryCacheRegion = new Map<Region, Country[]>();
  private queryCacheAlphaCode = new Map<string, Country>();

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      console.log('By Capital: Llegando al servidor por cache');
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    console.log(`By Capital: Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        tap((countries) => this.queryCacheCapital.set(query, countries)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países con la capital: ${query}`));
        })
      )
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    if (this.queryCacheCountry.has(query)) {
      console.log('By Country: Llegando al servidor por cache');
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    console.log(`By Country: Llegando al servidor por ${query}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        tap((countries) => this.queryCacheCountry.set(query, countries)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países con el nombre: ${query}`));
        })
      )
  }

  searchByRegion(region: Region): Observable<Country[]> {
    if (this.queryCacheRegion.has(region)) {
      console.log('By Region: Llegando al servidor por cache');
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    console.log(`By Region: Llegando al servidor por ${region}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${region}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        tap((countries) => this.queryCacheRegion.set(region, countries)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países para la región: ${region}`));
        })
      )
  }

  searchByAlphaCode(code: string): Observable<Country> {
    code = code.toLowerCase();

    if (this.queryCacheAlphaCode.has(code)) {
      console.log('By AlphaCode: Llegando al servidor por cache');
      return of(this.queryCacheAlphaCode.get(code)!);
    }

    console.log(`By AlphaCode: Llegando al servidor por ${code}`);

    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        map((countries) => countries[0]),
        tap((country) => this.queryCacheAlphaCode.set(code, country)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró un país para el code: ${code}`));
        })
      )
  }
}
