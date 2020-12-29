import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time',
})
export class DatetimePipe implements PipeTransform {
  transform(date: string): string {
    const fullDate = new Date(date);
    const hourStr =
      fullDate.getUTCHours() < 10
        ? '0' + fullDate.getUTCHours()
        : fullDate.getUTCHours().toString();
    const minutesStr =
      fullDate.getUTCMinutes() < 10
        ? '0' + fullDate.getUTCMinutes()
        : fullDate.getUTCMinutes().toString();
    return hourStr + ':' + minutesStr;
  }
}
