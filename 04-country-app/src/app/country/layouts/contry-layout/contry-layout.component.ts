import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopMenuComponent } from "../../components/top-menu/top-menu.component";

@Component({
  selector: 'app-contry-layout',
  imports: [RouterOutlet, TopMenuComponent],
  templateUrl: './contry-layout.component.html',
})
export class ContryLayoutComponent { }
