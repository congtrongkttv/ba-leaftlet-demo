import { Polyline, LatLngExpression, PolylineOptions } from 'leaflet';

export class BaPolyline extends Polyline {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: PolylineOptions
  ) {
    super(latlngs, options);
  }
  public editing: any;
}
