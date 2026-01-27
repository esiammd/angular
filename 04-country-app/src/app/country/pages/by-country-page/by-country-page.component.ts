import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { of } from 'rxjs';

import { ListComponent } from '../../components/list/list.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  imports: [ListComponent, SearchInputComponent],
})
export class ByCountryPageComponent {
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

      this.router.navigate(['/country/by-country'], {
        queryParams: { query: request.query },
      });

      return this.countryService.searchByCountry(request.query);
    },
  });
}
