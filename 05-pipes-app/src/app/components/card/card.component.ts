import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  imports: [],
})
export class CardComponent {
  title = input.required<string>();
}
