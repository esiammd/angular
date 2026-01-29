import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  templateUrl: './country-page.component.html',
  imports: [JsonPipe, ReactiveFormsModule],
})
export class CountryPageComponent {
  private fb = inject(FormBuilder);
  private countryService = inject(CountryService);

  regions = this.countryService.regions;

  countriesByRegion = signal<Country[]>([]);
  bordersByCountry = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanUp) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();

    onCleanUp(() => {
      regionSubscription?.unsubscribe();
      countrySubscription?.unsubscribe();
      console.log('onCleanUp effect');
    });
  });

  onRegionChanged() {
    return this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap(() => this.myForm.get('country')?.setValue('')),
        tap(() => this.myForm.get('border')?.setValue('')),
        tap(() => {
          this.countriesByRegion.set([]);
          this.bordersByCountry.set([]);
        }),
        switchMap((region) =>
          this.countryService.getCountriesByRegion(region ?? ''),
        ),
      )
      .subscribe((countries) => this.countriesByRegion.set(countries));
  }

  onCountryChanged() {
    return this.myForm
      .get('country')
      ?.valueChanges.pipe(
        tap(() => {
          this.myForm.get('border')?.setValue('');
          this.bordersByCountry.set([]);
        }),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) =>
          this.countryService.getCountryByAlphaCode(alphaCode ?? ''),
        ),
        switchMap((country) =>
          this.countryService.getCountryNamesByCodeArray(country.borders),
        ),
      )
      .subscribe((borders) => this.bordersByCountry.set(borders));
  }
}
