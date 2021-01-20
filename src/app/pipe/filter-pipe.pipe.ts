import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cusfilter',
})
export class FilterPipePipe implements PipeTransform {
  transform(arr: any[], term: string): any {
    // I am unsure what id is here. did you mean title?
    return arr.filter((item) => item.feild === term);
  }
}
