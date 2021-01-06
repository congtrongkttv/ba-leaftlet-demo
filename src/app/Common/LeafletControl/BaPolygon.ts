import {
  LatLngExpression,
  PolylineOptions,
  Polygon,
  DrawOptions,
} from 'leaflet';

export class BaPolygon extends Polygon {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][],
    options?: PolylineOptions
  ) {
    super(latlngs, options);
  }
  public editing: any;
}
export interface PolylineDrawOptions extends DrawOptions.PolylineOptions {
  draggable?: boolean;
}
export interface PolygonDrawOptions extends DrawOptions.PolygonOptions {
  draggable?: boolean;
}
