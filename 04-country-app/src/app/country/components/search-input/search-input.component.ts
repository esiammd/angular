import { Component, effect, input, linkedSignal, output } from '@angular/core';

@Component({
  selector: 'country-search-input',
  templateUrl: './search-input.component.html',
  imports: [],
})
export class SearchInputComponent {
  placeholder = input<string>('Buscar');
  debounceTime = input<number>(300);
  initialValue = input<string>();
  search = output<string>();

  inputValue = linkedSignal<string>(() => this.initialValue() ?? '');

  debaounceEffect = effect((onCleanup) => {
    const value = this.inputValue();

    const timeout = setTimeout(() => {
      this.search.emit(value);
    }, this.debounceTime());

    onCleanup(() => {
      clearTimeout(timeout);
    });
  });
}
