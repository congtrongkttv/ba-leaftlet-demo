import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  constructor() {}
  getDirectionBetween2Point(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): number {
    const xDiff = toLat - fromLat;
    const yDiff = toLng - fromLng;
    return (Math.atan2(yDiff, xDiff) * 180.0) / Math.PI;
  }
}
