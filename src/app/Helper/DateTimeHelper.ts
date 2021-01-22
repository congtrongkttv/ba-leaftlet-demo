export class DateTime extends Date {
  toString(): any {
    const dateStr =
      this.getDate() < 10 ? '0' + this.getDate() : this.getDate().toString();
    const monthStr =
      this.getMonth() + 1 < 10
        ? '0' + (this.getMonth() + 1)
        : (this.getMonth() + 1).toString();
    const yearStr = this.getFullYear();
    const hourStr =
      this.getHours() < 10 ? '0' + this.getHours() : this.getHours().toString();
    const minutesStr =
      this.getMinutes() < 10
        ? '0' + this.getMinutes()
        : this.getMinutes().toString();
    const secondsStr =
      this.getSeconds() < 10
        ? '0' + this.getSeconds()
        : this.getSeconds().toString();
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

  toFormat(format?: string): string {
    const dateStr =
      this.getDate() < 10 ? '0' + this.getDate() : this.getDate().toString();
    const monthStr =
      this.getMonth() + 1 < 10
        ? '0' + (this.getMonth() + 1)
        : (this.getMonth() + 1).toString();
    const yearStr = this.getFullYear();
    const hourStr =
      this.getHours() < 10 ? '0' + this.getHours() : this.getHours().toString();
    const minutesStr =
      this.getMinutes() < 10
        ? '0' + this.getMinutes()
        : this.getMinutes().toString();
    const secondsStr =
      this.getSeconds() < 10
        ? '0' + this.getSeconds()
        : this.getSeconds().toString();
    let retValue = '';
    switch (format) {
      case 'dd/MM/yyyy HH:mm:ss':
        retValue =
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
          secondsStr;
        break;
      case 'yyyy/MM/dd HH:mm:ss':
        retValue =
          yearStr +
          '/' +
          monthStr +
          '/' +
          dateStr +
          ' ' +
          hourStr +
          ':' +
          minutesStr +
          ':' +
          secondsStr;
        break;
      case 'dd/MM/yyyy':
        retValue = dateStr + '/' + monthStr + '/' + yearStr;
        break;
      case 'HH:mm dd/MM/yyyy':
        retValue =
          hourStr +
          ':' +
          minutesStr +
          ' ' +
          dateStr +
          '/' +
          monthStr +
          '/' +
          yearStr;
        break;
      case 'yyyy/MM/dd':
        retValue = dateStr + '/' + monthStr + '/' + yearStr;
        break;
      case 'dd_MM_yyyy_HH_mm_ss':
        retValue =
          dateStr +
          '_' +
          monthStr +
          '_' +
          yearStr +
          '_' +
          hourStr +
          '_' +
          minutesStr +
          '_' +
          secondsStr;
        break;

      default:
        retValue =
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
          secondsStr;
        break;
    }
    return retValue;
  }
}
