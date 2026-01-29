import {
  afterNextRender,
  afterRender,
  Component,
  effect,
  OnChanges,
  OnInit,
  signal,
} from '@angular/core';
import { TitleComponent } from '../../components/title/title.component';

const log = (...messages: string[]) => {
  console.log(
    `${messages[0]} %c${messages.slice(1).join(', ')}`,
    'color: #bada55',
  );
};

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  imports: [TitleComponent],
})
export class HomePageComponent implements OnInit, OnChanges {
  traditionalProperty = 'Maíse';
  signalProperty = signal('Maíse');

  constructor() {
    log('contructor llamado');
  }

  changeTraditional() {
    this.traditionalProperty = 'Maíse Mendes';
  }

  changeSignal() {
    this.signalProperty.set('Maíse Mendes');
  }

  basicEffect = effect((onCleanUp) => {
    log('effect =>', 'Disparar efectos secundarios.');

    onCleanUp(() => {
      log('onCleanUp', 'Se ejecuta cuando el efecto se va a destruir.');
    });
  });

  ngOnInit() {
    log(
      'ngOnInit =>',
      'Se ejecuta una vez después de que Angular haya inicializado todas las entradas del componente.',
    );
  }

  ngOnChanges() {
    log(
      'ngOnChanges =>',
      'Se ejecuta cada vez que cambian las entradas del componente.',
    );
  }

  ngDoCheck() {
    log(
      'ngDoCheck =>',
      'Se ejecuta cada vez que se comprueba si hay cambios en este componente.',
    );
  }

  ngAfterContentInit() {
    log(
      'ngAfterContentInit =>',
      'Se ejecuta una vez después de que se haya inicializado el contenido del componente.',
    );
  }

  ngAfterContentChecked() {
    log(
      'ngAfterContentChecked =>',
      'Se ejecuta cada vez que se verifica si se han producido cambios en el contenido de este componente.',
    );
  }

  ngAfterViewInit() {
    log(
      'ngAfterViewInit =>',
      'Se ejecuta una vez después de que se haya inicializado la vista del componente.',
    );
  }

  ngAfterViewChecked() {
    log(
      'ngAfterViewChecked =>',
      'Se ejecuta cada vez que se verifica si hay cambios en la vista del componente.',
    );
  }

  ngOnDestroy() {
    log(
      'ngOnDestroy =>',
      'Se ejecuta una vez antes de que se destruya el componente.',
    );
  }

  afterNextRender = afterNextRender(() => {
    log(
      'afterNextRender =>',
      'Se ejecuta una vez la próxima vez que todos los componentes se hayan renderizado en el DOM.',
    );
  });

  afterRender = afterRender(() => {
    log(
      'afterRender	=>',
      'Se ejecuta cada vez que todos los componentes se hayan renderizado en el DOM.',
    );
  });
}
