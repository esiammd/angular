import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';

import { of } from 'rxjs';

import { ListComponent } from '../../components/list/list.component';
import { CountryService } from '../../services/country.service';
import { Region } from '../../interfaces/region.type';

function validateQueryParam(queryParam: string | null): Region | null {
  if (!queryParam) return null;

  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    africa: 'Africa',
    americas: 'Americas',
    asia: 'Asia',
    europe: 'Europe',
    oceania: 'Oceania',
    antarctic: 'Antarctic',
  };

  return validRegions[queryParam] ?? null;
}

@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  imports: [ListComponent],
})
export class ByRegionPageComponent {
  countryService = inject(CountryService);
  activatedRouter = inject(ActivatedRoute);
  router = inject(Router);

  queryParam =
    this.activatedRouter.snapshot.queryParamMap.get('region') ?? null;
  selectedRegion = linkedSignal<Region | null>(() =>
    validateQueryParam(this.queryParam)
  );

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  countryResource = rxResource({
    request: () => ({ region: this.selectedRegion() }),
    loader: ({ request }) => {
      console.log({ region: request.region });
      if (!request.region) return of([]);

      this.router.navigate(['/country/by-region'], {
        queryParams: { region: request.region },
      });

      return this.countryService.searchByRegion(request.region);
    },
  });
}
