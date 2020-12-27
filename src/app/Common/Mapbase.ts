import * as L from 'leaflet';
import { VehicleEntity } from '../entities/VehicleEntity';
import 'leaflet.markercluster';
import 'leaflet-draw';
import 'leaflet-editable';
import {
  BaPolygon,
  BaPolyline,
  BaMarker,
  PolygonDrawOptions,
} from './BaControlLeaflet';

export class Mapbase {
  public map: L.Map;
  public markersCluster = L.markerClusterGroup();
  public markersClusterOptions: L.MarkerClusterGroupOptions;
  public drawTool: L.Draw.Feature;
  public editableLayers = new L.FeatureGroup();

  private POLYLINE_OPTIONS: object = {
    color: 'red',
    weight: 3,
    opacity: 1,
    smoothFactor: 1,
  };

  private POLYGON_OPTIONS: object = {
    color: 'red',
    weight: 3,
    opacity: 1,
    fillColor: 'red',
    fillOpacity: 0.3,
    fill: true,
  };

  private CIRCLE_OPTIONS: object = {
    color: 'red',
    weight: 3,
    opacity: 1,
    smoothFactor: 1,
    fillColor: 'red',
    fillOpacity: 0.3,
    fill: true,
    dragable: true,
    radius: 50 * 1000,
    iconPath: 'assets/icons/Blue0.png',
  };
  private lstLayersDefault: L.TileLayer[];

  public customControl = L.Control.extend({
    options: {
      position: 'topright',
    },

    onAdd(map): HTMLElement {
      const container = L.DomUtil.create(
        'div',
        'leaflet-bar leaflet-control leaflet-control-custom'
      );
      container.style.backgroundColor = 'white';
      container.style.backgroundImage =
        'url(https://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)';
      container.style.backgroundSize = '30px 30px';
      container.style.width = '30px';
      container.style.height = '30px';
      container.onclick = function () {};
      return container;
    },
  });

  private async getBaseLayers() {
    const urlGoogleRoad =
      'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en';
    const urlGoogleSatelite =
      'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&hl=en';
    const urlBaRoad =
      'https://map.binhanh.vn/titservice.ashx?typ=ba&lvl={z}&top={y}&left={x}';
    const urlBaSatelite =
      'https://map.binhanh.vn/titservice.ashx?typ=hb&lvl={z}&top={y}&left={x}';

    const googleRoad = new L.TileLayer(urlGoogleRoad, {
      detectRetina: true,
      attribution: '0',
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    const googleSatelite = new L.TileLayer(urlGoogleSatelite, {
      detectRetina: true,
      attribution: '1',
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    const baRoad = new L.TileLayer(urlBaRoad, {
      detectRetina: true,
      attribution: '2',
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    const baSatelite = new L.TileLayer(urlBaSatelite, {
      detectRetina: true,
      attribution: '3',
      maxZoom: 19,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });
    this.lstLayersDefault = [baRoad, baSatelite, googleRoad, googleSatelite];
    const baseLayers = {};
    baseLayers['Bản đồ Bình Anh'] = this.lstLayersDefault[0];
    baseLayers['Vệ tinh Bình Anh'] = this.lstLayersDefault[1];
    baseLayers['Bản đồ'] = this.lstLayersDefault[2];
    baseLayers['Vệ tinh'] = this.lstLayersDefault[3];
    return baseLayers;
  }
  // Khởi tạo bản đồ
  public initMap(mapId: string, options: object): L.Map {
    this.map = L.map(mapId, {
      center: [18.123, 106.2312],
      zoom: 6,
      zoomControl: false,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );
    tiles.addTo(this.map);
    L.Icon.Default.imagePath =
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.4.0/images'; // missing setup
    this.map.whenReady(() => {
      this.getBaseLayers().then((baseLayers) => {
        // control chọn bản đổ
        this.map.addControl(L.control.layers(baseLayers));
        // this.map.addControl(new this.customControl());
        // control phóng to thu nhỏ
        this.map.addControl(L.control.zoom({ position: 'topright' }));
        this.map.addControl(L.control.scale({ position: 'bottomleft' }));
      });
      this.initEventDraw();
    });
    this.map.addLayer(this.editableLayers);
    return this.map;
  }

  // Tùy chọn Cluster
  public initClusterOptions(): void {
    this.markersClusterOptions = {
      iconCreateFunction(cluster): L.DivIcon {
        let spancss = '';
        if (cluster.getChildCount() < 10) {
          spancss = 'cluster-group-span';
        } else if (cluster.getChildCount() < 100) {
          spancss = 'cluster-group-large-span';
        } else if (cluster.getChildCount() < 1000) {
          spancss = 'cluster-group-superlarge-span';
        } else if (cluster.getChildCount() < 10000) {
          spancss = 'cluster-group-ssuperlarge-span';
        }
        if (cluster.getChildCount() < 10) {
          return L.divIcon({
            html:
              '<div class="cluster-group"><span class="' +
              spancss +
              '">' +
              cluster.getChildCount() +
              '</span></div>',
            className: 'hidden',
          });
        } else if (cluster.getChildCount() < 100) {
          return L.divIcon({
            html:
              '<div class="cluster-group-large"><span class="' +
              spancss +
              '">' +
              cluster.getChildCount() +
              '</span></div>',
            className: 'hidden',
          });
        } else {
          return L.divIcon({
            html:
              '<div class="cluster-group-super-large"><span class="' +
              spancss +
              '">' +
              cluster.getChildCount() +
              '</span></div>',
            className: 'hidden',
          });
        }
      },
      maxClusterRadius: 80,
      animate: true,
      showCoverageOnHover: true,
      spiderfyOnMaxZoom: true,
      spiderfyDistanceMultiplier: 3,
    };
  }

  // tạo marker
  public createMarker(
    vehicle: VehicleEntity,
    contentPopup: string,
    isDraggable: boolean,
    isShowLabel?: boolean
  ): BaMarker {
    const customMarkerIcon = this.createDivIcon(
      [30, 30],
      [15, 15],
      vehicle.IconPath,
      '',
      vehicle.VehiclePlate,
      isShowLabel,
      0
    );
    const marker = new BaMarker([vehicle.Latitude, vehicle.Longitude], {
      icon: customMarkerIcon,
      draggable: isDraggable,
    });
    marker.bindPopup(contentPopup);
    return marker;
  }

  // update vị trí mới cho marker
  public updateMarker(marker: L.Marker, vehicle: VehicleEntity): void {
    const latlng = new L.LatLng(vehicle.Latitude, vehicle.Longitude);
    marker.setLatLng(latlng);
    const customMarkerIcon = this.createDivIcon(
      [30, 30],
      [14, 25],
      vehicle.IconPath,
      '',
      vehicle.VehiclePlate,
      true,
      0
    );
    marker.setIcon(customMarkerIcon);
  }
  // Tạo icon cho markker
  private createDivIcon(
    iSize: any,
    aSize: any,
    iUrl: string,
    cssClass: string,
    labelContent: string,
    labelVisible: boolean,
    rotation: number
  ): L.DivIcon {
    let htmlIcon = '';
    if (labelVisible) {
      htmlIcon += `<label style="position:absolute;bottom:100%;
      display:inline-table;margin-left:-50%;
      padding:4px;white-space:nowrap; background-color: wheat;
      border-radius: 3px; border: 1px solid lightgray;">`;
      htmlIcon += labelContent + '</label>';
    }

    // tslint:disable-next-line: max-line-length
    htmlIcon +=
      '<img src="' +
      iUrl +
      '" style="max-width:' +
      iSize[0] +
      'px !important;max-height:' +
      iSize[1] +
      'px !important;transform: rotate(' +
      rotation +
      'deg);">';
    return new L.DivIcon({
      iconSize: iSize,
      iconAnchor: aSize,
      html: htmlIcon,
      className: cssClass,
      popupAnchor: [0, -25],
    });
  }
  // Vẽ poly line
  public createPolyline(points: L.LatLng[], option?: object): BaPolyline {
    if (option === undefined || option == null || option === {}) {
      option = this.POLYLINE_OPTIONS;
    }
    const polyline = new BaPolyline(points, option);
    return polyline;
  }

  // ve ba polyline
  public createBaPolyline(points: L.LatLng[], option?: object): BaPolyline {
    if (option === undefined || option == null || option === {}) {
      option = this.POLYLINE_OPTIONS;
    }
    const polyline = new BaPolyline(points, option);
    return polyline;
  }

  // vẽ polygon
  public createPolygon(points: L.LatLng[], option?: object): BaPolygon {
    if (option === undefined || option == null || option === {}) {
      option = this.POLYGON_OPTIONS;
    }
    const polygon = new BaPolygon(points, option);
    return polygon;
  }
  // tạo hình tròn
  public createCircle(
    center: L.LatLng,
    option?: any
  ): { circle: L.Circle; center: L.Marker } {
    if (option === undefined || option == null || option === {}) {
      option = this.CIRCLE_OPTIONS;
    }
    const c = L.circle(center, option);
    const v = new VehicleEntity();
    v.Latitude = option.center[0];
    v.Longitude = option.center[1];
    v.IconPath = option.iconPath;
    const marker = this.createMarker(v, '', option.dragable, false);
    marker.addEventListener('drag', (e: L.LeafletMouseEvent) => {
      c.setLatLng(e.latlng);
    });
    return { circle: c, center: marker };
  }

  // Tạo công cụ vẽ
  public createDrawTool(type?: DrawTypes, option?: object): L.Draw.Feature {
    if (this.drawTool !== undefined) {
      this.drawTool.disable();
    }
    const drawMap: L.DrawMap = this.map as any;
    switch (type) {
      case DrawTypes.polyline:
        L.drawLocal.draw.handlers.polyline.tooltip.start =
          'Chọn 1 điểm trên bản đồ để bắt đầu vẽ';
        L.drawLocal.draw.handlers.polyline.tooltip.cont = '';
        L.drawLocal.draw.handlers.polyline.tooltip.end =
          'dbclick vào điểm bất kỳ trên bản đồ để kết thúc';
        if (option === undefined || option == null || option === {}) {
          option = this.POLYLINE_OPTIONS;
        }
        const polygonOptions: PolygonDrawOptions = {
          showArea: false,
          allowIntersection: false,
          shapeOptions: option,
          draggable: true,
        };
        this.drawTool = new L.Draw.Polyline(drawMap, polygonOptions);
        break;
      case DrawTypes.polygon:
        L.drawLocal.draw.handlers.polygon.tooltip.start =
          '<div class="drawTooltip">Chọn 1 điểm trên bản đồ để bắt đầu vẽ</div>';
        L.drawLocal.draw.handlers.polygon.tooltip.cont = '';
        L.drawLocal.draw.handlers.polygon.tooltip.end =
          'Ấn vào đỉnh bắt đầu để kết thúc';
        if (option === undefined || option == null || option === {}) {
          option = this.POLYLINE_OPTIONS;
        }
        const polygonOptions1: L.DrawOptions.PolygonOptions = {
          showArea: false,
          allowIntersection: false,
          shapeOptions: option,
        };
        this.drawTool = new L.Draw.Polygon(drawMap, polygonOptions1);
        break;
      case DrawTypes.circle:
        if (option === undefined || option == null || option === {}) {
          option = this.POLYLINE_OPTIONS;
        }
        this.drawTool = new L.Draw.Circle(drawMap, option);
        break;
      default:
        if (option === undefined || option == null || option === {}) {
          option = this.POLYLINE_OPTIONS;
        }
        const polygonOptions2: L.DrawOptions.PolygonOptions = {
          showArea: false,
          allowIntersection: false,
          repeatMode: true,
          shapeOptions: option,
        };
        this.drawTool = new L.Draw.Polyline(drawMap, polygonOptions2);
        break;
    }
    this.drawTool.enable();
    return this.drawTool;
  }
  //#endregion end circle
  initEventDraw(): void {
    const that = this;
    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      that.DrawDoneAction(e);
      console.log('L.Draw.Event.CREATED');
    });
    this.map.on(L.Draw.Event.EDITSTART, (e: any) => {
      console.log('L.Draw.Event.EDITSTART');
    });
    this.map.on(L.Draw.Event.EDITSTOP, (e: any) => {
      console.log('L.Draw.Event.EDITSTOP');
    });
    this.map.on(L.Draw.Event.EDITED, (e: any) => {
      console.log('L.Draw.Event.EDITED');
    });
    this.map.on(L.Draw.Event.EDITVERTEX, (e: any) => {
      console.log('L.Draw.Event.EDITVERTEX');
    });
  }

  panTo(latlng: L.LatLng, zoomLevel: number): void {
    this.map.setView(latlng, zoomLevel);
  }

  DrawDoneAction(event: L.LeafletDrawEvent): void {}
}

export enum DrawTypes {
  polygon = 1,
  polyline = 2,
  circle = 3,
}
