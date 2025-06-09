import { Component, inject, resource, signal } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, TableComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  countryService = inject(CountryService);
  query = signal<string>('');

  countryResource = rxResource({
    request: () =>({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      return this.countryService.searchByCountry(request.query);
    }
  });
}
