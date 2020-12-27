import {
  Polyline,
  LatLngExpression,
  PolylineOptions,
  Polygon,
  Marker,
  MarkerOptions,
  DrawOptions,
} from 'leaflet';

export class BaPolygon extends Polygon {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][],
    options?: PolyOptions
  ) {
    super(latlngs, options);
  }
  public editing: any;
}

export class BaPolyline extends Polyline {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: PolyOptions
  ) {
    super(latlngs, options);
  }
  public editing: any;
}

export class BaMarker extends Marker {
  constructor(latlng: LatLngExpression, options?: MarkerOptions) {
    super(latlng, options);
  }
  id: number;
  data: any;
}

export interface PolylineDrawOptions extends DrawOptions.PolylineOptions {
  draggable?: boolean;
}
export interface PolygonDrawOptions extends DrawOptions.PolygonOptions {
  draggable?: boolean;
}
export interface PolyOptions extends PolylineOptions {
  draggable?: boolean;
}
