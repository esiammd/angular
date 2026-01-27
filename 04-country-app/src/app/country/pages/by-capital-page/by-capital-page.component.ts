import {
  Component,
  inject,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { firstValueFrom, of } from 'rxjs';

import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { ListComponent } from '../../components/list/list.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-capital-page',
  templateUrl: './by-capital-page.component.html',
  imports: [SearchInputComponent, ListComponent],
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);
  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  queryParam = this.activatedRouter.snapshot.queryParamMap.get('query') ?? '';
  query = linkedSignal<string>(() => this.queryParam);

  countryResource = rxResource({
    request: () => ({ query: this.query() }),
    loader: ({ request }) => {
      console.log({ query: request.query });
      if (!request.query) return of([]);

      this.router.navigate(['/country/by-capital'], {
        queryParams: { query: request.query },
      });

      return this.countryService.searchByCapital(request.query);
    },
  });

  // countryResource = resource({
  //   request: () => ({ query: this.query() }),
  //   loader: async ({ request }) => {
  //     if (!request.query) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(request.query)
  //     );
  //   },
  // });

  // isLoading = signal<boolean>(false);
  // isError = signal<string | null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query).subscribe({
  //     next: (countries) => {
  //       this.isLoading.set(false);
  //       this.countries.set(countries);
  //     },
  //     error: (error) => {
  //       this.isLoading.set(false);
  //       this.countries.set([]);
  //       this.isError.set(error);
  //     },
  //   });
  // }
}
