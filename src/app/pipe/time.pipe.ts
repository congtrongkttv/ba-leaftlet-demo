import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(date: string): string {
    const fullDate = new Date(date);
    const hourStr =
      fullDate.getHours() < 10
        ? '0' + fullDate.getHours()
        : fullDate.getHours().toString();
    const minutesStr =
      fullDate.getMinutes() < 10
        ? '0' + fullDate.getMinutes()
        : fullDate.getMinutes().toString();
    return hourStr + ':' + minutesStr;
  }
}
