import { Component } from '@angular/core';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'country-top-menu',
  templateUrl: './top-menu.component.html',
  imports: [RouterLinkActive, RouterLinkWithHref],
})
export class TopMenuComponent {}
