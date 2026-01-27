import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, Footer],
})
export class AppComponent {
  title = 'country-app';
}
