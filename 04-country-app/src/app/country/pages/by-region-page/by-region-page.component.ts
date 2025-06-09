import { Component, inject, resource, signal } from '@angular/core';
import { TableComponent } from "../../components/table/table.component";
import { CountryService } from '../../services/country.service';
import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-by-region-page',
  imports: [TableComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);
  query = signal<string>('');

  countryResource = rxResource({
    request: () =>({ query: this.query() }),
    loader: ({ request }) => {
      if (!request.query) return of([]);

      return this.countryService.searchByRegion(request.query);
    }
  });
}
