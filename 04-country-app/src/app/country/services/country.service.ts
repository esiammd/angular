import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { RESTCountry } from '../interfaces/rest-countries.interface';
import { CountryMapper } from '../mappers/country.mapper';
import { catchError, delay, map, Observable, throwError } from 'rxjs';
import type { Country } from '../interfaces/country.interface';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países con la capital: ${query}`));
        })
      )
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        delay(2000),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países con el nombre: ${query}`));
        })
      )
  }

  searchByRegion(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/region/${query}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró países para la región: ${query}`));
        })
      )
  }

  searchByAlphaCode(code: string): Observable<Country> {
    code = code.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/alpha/${code}`)
      .pipe(
        map((response) => CountryMapper.mapRestCountryToCountryArray(response)),
        map((countries) => countries[0]),
        catchError((error) => {
          console.error('error', error);
          return throwError(() => new Error(`No se encontró un país para el code: ${code}`));
        })
      )
  }
}
