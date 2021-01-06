import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../entities/Vehicle';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: Vehicle[], args?: any): any {
    return value.sort((a, b) => (a.vehiclePlate < b.vehiclePlate ? -1 : 1));
  }
}
