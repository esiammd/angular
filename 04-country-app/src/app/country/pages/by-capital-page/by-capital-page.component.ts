import { Component, inject, linkedSignal, resource } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryService } from '../../services/country.service';
// import type { Country } from '../../interfaces/country.interface';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-capital-page',
  imports: [TableComponent, SearchInputComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam);

   countryResource = rxResource({
    request: () =>({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: {
          query: request.query,
        }
      });

      return this.countryService.searchByCapital(request.query);
    }
  });

  // countryResource = resource({
  //   request: () =>({ query: this.query() }),
  //   loader: async({ request }) => {
  //     if (!request.query) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   }
  // });

  // isLoading = signal(false);
  // hasError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query:string){
  //   if(this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.hasError.set(null);

  //   if (query.trim()) {
  //     this.countryService.searchByCapital(query).subscribe({
  //       next: (countries) => {
  //         this.isLoading.set(false);
  //         this.countries.set(countries);
  //       },
  //       error: (error) => {
  //         this.isLoading.set(false);
  //         this.hasError.set(error);
  //         this.countries.set([]);
  //       },
  //     });
  //   }
  // }
}
