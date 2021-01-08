import { LatLngExpression, Marker, MarkerOptions, Util } from 'leaflet';
import * as L from 'leaflet';

export class BaMarker extends Marker {
  constructor(latlng: LatLngExpression, options?: MarkerOptions) {
    super(latlng, options);
  }
  id: number;
  data: any;

  private slideToUntil = 0;
  private slideToDuration = 1000;
  private slideToLatLng: LatLngExpression = [0, 0];
  private slideFromLatLng: LatLngExpression = [0, 0];
  private slideKeepAtCenter = false;
  private slideDraggingWasAllowed = false;
  private slideFrame = 0;

  addInitHook(): void {
    this.on('move', this.slideCancel, this);
  }
  slideTo = (latlng: LatLngExpression, options: SlideOptions) => {
    if (!this._map) {
      return;
    }

    this.slideToDuration = options.duration;
    this.slideToUntil = performance.now() + options.duration;
    this.slideFromLatLng = this.getLatLng();
    this.slideToLatLng = latlng;
    this.slideKeepAtCenter = !!options.keepAtCenter;
    this.slideDraggingWasAllowed =
      this.slideDraggingWasAllowed !== undefined
        ? this.slideDraggingWasAllowed
        : this._map.dragging.enabled();

    if (this.slideKeepAtCenter) {
      this._map.dragging.disable();
      this._map.doubleClickZoom.disable();
      this._map.options.touchZoom = 'center';
      this._map.options.scrollWheelZoom = 'center';
    }

    this.fire('movestart');
    this._slideTo();

    return this;
  };

  slideCancel(): void {
    L.Util.cancelAnimFrame(this.slideFrame);
  }

  private _slideTo() {
    if (!this._map) {
      return;
    }

    const remaining = this.slideToUntil - performance.now();

    if (remaining < 0) {
      this.setLatLng(this.slideToLatLng);
      this.fire('moveend');
      if (this.slideDraggingWasAllowed) {
        this._map.dragging.enable();
        this._map.doubleClickZoom.enable();
        this._map.options.touchZoom = true;
        this._map.options.scrollWheelZoom = true;
      }
      this.slideDraggingWasAllowed = false;
      return this;
    }

    const startPoint = this._map.latLngToContainerPoint(this.slideFromLatLng);
    const endPoint = this._map.latLngToContainerPoint(this.slideToLatLng);
    const percentDone =
      (this.slideToDuration - remaining) / this.slideToDuration;

    const currPoint = endPoint
      .multiplyBy(percentDone)
      .add(startPoint.multiplyBy(1 - percentDone));
    const currLatLng = this._map.containerPointToLatLng(currPoint);
    this.setLatLng(currLatLng);

    if (this.slideKeepAtCenter) {
      this._map.panTo(currLatLng, { animate: false });
    }

    this.slideFrame = Util.requestAnimFrame(this._slideTo, this);
  }
}

interface SlideOptions {
  duration: number;
  keepAtCenter?: boolean;
}
