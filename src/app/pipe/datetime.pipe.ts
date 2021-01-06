import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datetime',
})
export class DatetimePipe implements PipeTransform {
  transform(date: string | Date, args?: any): any {
    const fullDate = new Date(date);
    const dateStr =
      fullDate.getDate() < 10
        ? '0' + fullDate.getDate()
        : fullDate.getDate().toString();
    const monthStr =
      fullDate.getMonth() + 1 < 10
        ? '0' + (fullDate.getMonth() + 1)
        : (fullDate.getMonth() + 1).toString();
    const yearStr = fullDate.getFullYear();
    const hourStr =
      fullDate.getHours() < 10
        ? '0' + fullDate.getHours()
        : fullDate.getHours().toString();
    const minutesStr =
      fullDate.getMinutes() < 10
        ? '0' + fullDate.getMinutes()
        : fullDate.getMinutes().toString();
    const secondsStr =
      fullDate.getSeconds() < 10
        ? '0' + fullDate.getSeconds()
        : fullDate.getSeconds().toString();
    return (
      dateStr +
      '/' +
      monthStr +
      '/' +
      yearStr +
      ' ' +
      hourStr +
      ':' +
      minutesStr +
      ':' +
      secondsStr
    );
  }
}
