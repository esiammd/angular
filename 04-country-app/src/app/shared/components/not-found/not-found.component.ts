import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [],
})
export class NotFoundComponent {
  location = inject(Location);

  goBack() {
    this.location.back();
  }
}
