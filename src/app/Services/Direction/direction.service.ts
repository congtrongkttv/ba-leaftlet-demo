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

  getDistance(origin, destination): number {
    // return distance in meters
    const lon1 = this.toRadian(origin[1]);
    const lat1 = this.toRadian(origin[0]);
    const lon2 = this.toRadian(destination[1]);
    const lat2 = this.toRadian(destination[0]);

    const deltaLat = lat2 - lat1;
    const deltaLon = lon2 - lon1;

    const a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    const c = 2 * Math.asin(Math.sqrt(a));
    const EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  }
  toRadian(degree): number {
    return (degree * Math.PI) / 180;
  }
}
