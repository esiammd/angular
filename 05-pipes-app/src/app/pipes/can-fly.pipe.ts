import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'canFly',
})
export class CanFlyPipe implements PipeTransform {
  transform(value: boolean): 'Puede volvar' | 'No puede volar' {
    return value ? 'Puede volvar' : 'No puede volar';
  }
}
