import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-gif-list-item',
  templateUrl: './gif-list-item.component.html',
  imports: [],
})
export class GifListItemComponent {
  imageUrl = input.required<string>();
}
