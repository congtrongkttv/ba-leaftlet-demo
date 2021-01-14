import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { DrawTypes, Mapbase } from '../../Common/map-base';
import { LeftpanelComponent } from '../../leftpanel/leftpanel.component';
import { BaPolygon } from '../../Common/LeafletControl/BaPolygon';
import { BaMarker } from '../../Common/LeafletControl/BaMarker';
import { BaPolyline } from '../../Common/LeafletControl/BaPolyline';
import { Vehicle } from '../../entities/Vehicle';
@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css'],
})
export class OnlineComponent extends Mapbase implements OnInit, AfterViewInit {
  public map: L.Map;
  public ListMarker: L.Marker[];
  public CurrentMarker: L.Marker;
  public CurrentPolyline: BaPolyline;
  public CurrentPolygon: BaPolygon;
  public CurrentCircle: L.Circle;
  public IsShowMenuContext = false;
  public IsMarkerBusy: boolean;
  public MenuContext = { X: 0, Y: 0 };
  public NumberMarker = 1000;
  public NumberMarkerUpdate = 200;
  public intervalUpdateVehicle: any;
  public IsUseClusterMarker = true;

  @ViewChild(LeftpanelComponent) leftPanel: LeftpanelComponent;
  CThis = this;
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.ListMarker = [];
  }
  //#region Làm việc với bản đồ
  ngAfterViewInit(): void {
    // Khởi tạo bản đồ
    this.map = this.initMap('map', {});
    if (this.IsUseClusterMarker) {
      this.initClusterOptions();
      this.markersCluster = L.markerClusterGroup(this.markersClusterOptions);
    }
    this.map.addEventListener('click', (event) => {
      this.mapEventHandle(event);
    });
    this.map.addEventListener('contextmenu', (event) => {
      this.mapEventHandle(event);
    });
  }
  // Sự kiện click chuột lên bản đồ
  mapEventHandle(event: any): void {
    switch (event.type) {
      case 'click': // click
        this.IsShowMenuContext = false;
        break;
      case 'contextmenu': // chuột phải
        console.log(event);
        this.MenuContext = {
          X: event.containerPoint.x,
          Y: event.containerPoint.y,
        };
        this.IsShowMenuContext = true;
        break;
    }
  }
  //#endregion

  //#region Làm việc với marker

  public add1000Marker(): void {
    this.leftPanel.listVehicleOnlines = [];
    this.drawMarkerWithLargenumber(this.NumberMarker);
  }
  private drawMarkerWithLargenumber(numberMarker: number): void {
    let i = 0;
    // tạo random số lượng marker truyền vào
    while (i < numberMarker) {
      const vehicle = this.createRandomVehicle();
      this.addMarkerToMap(vehicle);
      this.leftPanel.listVehicleOnlines.push(vehicle);
      i++;
    }
    // Nếu sử dụng cluster => cho marker vào cluster
    if (this.IsUseClusterMarker) {
      this.ListMarker.forEach((element) => {
        this.markersCluster.addLayer(element);
      });
      // cho cluster  lên map
      this.map.addLayer(this.markersCluster);
      // Nếu không sử dụng lên cluster => cho marker thẳng lên map
    } else {
      this.ListMarker.forEach((element) => {
        this.map.addLayer(element);
      });
    }
    this.leftPanel.ListVehicleOnlinesTemp = this.leftPanel.listVehicleOnlines;
  }

  private createRandomVehicle(): Vehicle {
    const vehicle: Vehicle = new Vehicle('');
    vehicle.vehicleId = parseFloat((Math.random() * 10).toFixed(1));
    vehicle.vehiclePlate =
      this.generateRandomNumber(0, 100).toFixed(0) + 'M102243';
    vehicle.latitude = this.generateRandomNumber(
      8.610515235803474,
      23.346901192682896
    );
    vehicle.longitude = this.generateRandomNumber(
      102.17269363085188,
      109.42377919097898
    );
    vehicle.address = 'Marker ' + vehicle.vehicleId;
    vehicle.iconPath = 'assets/icons/Blue0.png';
    vehicle.velocity = parseInt(
      this.generateRandomNumber(0, 100).toFixed(0),
      0
    );
    return vehicle;
  }

  public addMarkerEvent(): void {
    this.addMarkerToMap(this.createRandomVehicle());
  }

  public updateMarkerEvent(): void {
    this.updateMarker(this.CurrentMarker, this.createRandomVehicle());
  }
  public updateMultiMarkerEvent(numberMarker?: number): void {
    numberMarker = this.NumberMarkerUpdate;
    // request caapj nhật dữ liệu mỗi 15s
    this.intervalUpdateVehicle = setInterval(() => {
      const i = 0;
      let isContinue = true;
      const arr = [];
      while (isContinue) {
        const indexN = Math.floor(
          Math.random() * Math.floor(this.NumberMarker)
        );

        if (!arr.includes(indexN) && arr.length < numberMarker) {
          arr.push(indexN);
        }
        if (arr.length === numberMarker) {
          isContinue = false;
        }
      }

      arr.forEach((element) => {
        this.updateMarker(this.ListMarker[element], this.createRandomVehicle());
      });
    }, 2 * 1000);
  }

  public removeMarkerEvent(): void {
    this.map.removeLayer(this.CurrentMarker);
    const indexN = this.ListMarker.findIndex((x) => x === this.CurrentMarker);
    this.ListMarker.splice(indexN, 1);
  }
  public removemultiMarkerEvent(): void {
    this.ListMarker.forEach((element) => {
      if (!this.IsUseClusterMarker) {
        this.map.removeLayer(element);
      } else {
        this.markersCluster.removeLayer(element);
        this.map.removeLayer(this.markersCluster);
      }
    });
    this.leftPanel.ListVehicleOnlinesTemp = [];
    this.leftPanel.listVehicleOnlines = [];
    if (this.intervalUpdateVehicle !== undefined) {
      clearInterval(this.intervalUpdateVehicle);
    }
    this.ListMarker = [];
  }

  private generateRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private addMarkerToMap(vehicle: Vehicle): void {
    // Nội dung content khi click vào marker
    let contenPopup =
      '<table class="tbl-popup-marker"><tr><td>BKS</td><td>' +
      vehicle.vehiclePlate +
      '</td></tr>';
    contenPopup += '<tr><td>Tinh trang may</td><td>Mở</td></tr>';
    contenPopup += '<tr><td>Nhiệt độ</td><td>35 C</td></tr>';
    contenPopup += '<tr><td>Cửa</td><td>Đóng</td></tr>';
    contenPopup += '</table>';
    // Vẽ marker
    const marker = this.createMarker(vehicle, contenPopup, true, true);

    // cho marker lên bản đồ
    // marker.addTo(this.map);
    // Add vào list để làm việc
    this.ListMarker.push(marker);
    this.CurrentMarker = marker;

    // Gán sự kiện cho marker
    this.CurrentMarker.addEventListener('dragstart', (event) => {
      this.IsMarkerBusy = true;
      this.CurrentMarker = event.target;
    });

    this.CurrentMarker.addEventListener('dragend', (event) => {
      this.IsMarkerBusy = false;
      this.CurrentMarker.setLatLng(
        new L.LatLng(event.target._latlng.lat, event.target._latlng.lng)
      );
    });
    this.CurrentMarker.addEventListener('click', (event) => {
      this.CurrentMarker = event.target;
    });
    this.CurrentMarker.addEventListener('mouseover', (event) => {
      // console.log('mouseover');
      // this.CurrentMarker = event.target;
      // if (!this.IsMarkerBusy) this.CurrentMarker.openPopup();
    });
    this.CurrentMarker.addEventListener('mouseout', (event) => {
      // console.log('mouseout');
      // this.CurrentMarker = event.target;
      // if (!this.IsMarkerBusy) this.CurrentMarker.closePopup();
    });
  }

  //#endregion

  //#region Làm việc với polyline, polygon

  private createRandomLatlng(numberPoint: number): any {
    const points = [];
    let i = 0;
    while (i < 10) {
      const point: L.LatLng = new L.LatLng(
        this.generateRandomNumber(16.23908402, 22.9832747),
        this.generateRandomNumber(103.09831239872, 106.98234982374)
      );
      points.push(point);
      i++;
    }
    return points;
  }

  public addPolylineEvent(): void {
    if (this.CurrentPolyline != null && this.CurrentPolyline !== undefined) {
      this.map.removeLayer(this.CurrentPolyline);
    }
    const polyline = this.createBaPolyline(this.createRandomLatlng(5));
    polyline.addTo(this.map);
    console.log(polyline);
    this.CurrentPolyline = polyline;
    let isEdit = false;
    polyline.addEventListener('dblclick', (e: L.LeafletMouseEvent) => {
      this.map.doubleClickZoom.disable();
      e.target.editing.enable();
      if (isEdit) {
        this.map.doubleClickZoom.enable();
        e.target.editing.disable();
        isEdit = false;
      } else {
        isEdit = true;
      }
    });
    polyline.addEventListener('click', (e: L.LeafletMouseEvent) => {
      this.CurrentPolyline = e.target;
    });
  }

  public addPolygonEvent(): void {
    if (this.CurrentPolygon != null && this.CurrentPolygon !== undefined) {
      this.map.removeLayer(this.CurrentPolygon);
    }
    const polygon = this.createPolygon(this.createRandomLatlng(5));
    polygon.addTo(this.map);
    let isEdit = false;
    // Sự kiện double click
    polygon.addEventListener('dblclick', (e: L.LeafletMouseEvent) => {
      this.map.doubleClickZoom.disable();
      e.target.editing.enable();
      if (isEdit) {
        this.map.doubleClickZoom.enable();
        e.target.editing.disable();
        isEdit = false;
      } else {
        isEdit = true;
      }
    });
    // Sự kiện click
    polygon.addEventListener('click', (e: L.LeafletMouseEvent) => {
      this.CurrentPolygon = e.target;
    });
    this.CurrentPolygon = polygon;
  }

  public removePolylineEvent(): void {
    this.map.removeLayer(this.CurrentPolyline);
    this.CurrentPolyline = null;
  }

  public removePolygonEvent(): void {
    this.map.removeLayer(this.CurrentPolygon);
    this.CurrentPolygon = null;
  }
  //#endregion END polyline

  //#region Circle
  AddCircle(center1?: L.LatLng): void {
    if (this.CurrentCircle != null && this.CurrentMarker !== undefined) {
      this.map.removeLayer(this.CurrentCircle);
      this.map.removeLayer(this.CurrentMarker);
    }
    const center: L.LatLng = center1 ?? this.map.getCenter();
    const options: any = {
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
      center: [center.lat, center.lng],
    };
    const circle = this.createCircle(center, options);
    this.map.addLayer(circle.circle);
    this.map.addLayer(circle.center);
    this.CurrentCircle = circle.circle;
  }

  DrawCicles(): void {
    if (this.drawTool !== undefined && this.drawTool != null) {
      this.drawTool.disable();
    }
    this.createDrawTool(DrawTypes.circle);
  }

  DrawPolygon(): void {
    if (this.drawTool !== undefined && this.drawTool != null) {
      this.drawTool.disable();
    }
    this.createDrawTool(DrawTypes.polygon);
  }

  DrawPolyline(): void {
    if (this.drawTool !== undefined && this.drawTool != null) {
      this.drawTool.disable();
    }
    this.createDrawTool(DrawTypes.polyline);
  }
  // Override lại aaction khi vẽ xong polygon | polyline | Circle
  DrawDoneAction(event: any): void {
    // Nếu là polygon
    if (event.layerType === 'polygon') {
      // ds tọa độ các đỉnh
      const latlng = event.layer._latlngs[0];
      const poly = event.layer;
      this.map.addLayer(event.layer);
      this.CurrentPolygon = poly;
      let a = 0;
      // dblclick để sửa
      poly.addEventListener('dblclick', (e: L.LeafletMouseEvent) => {
        this.map.doubleClickZoom.disable();
        this.CurrentPolygon.editing.enable();
        if (a > 0) {
          e.target.editing.disable();
          this.map.doubleClickZoom.enable();
          console.log('After: ' + this.CurrentPolygon.getLatLngs());
          a = 0;
        } else {
          console.log('Before: ' + this.CurrentPolygon.getLatLngs());
          a++;
        }
      });
      poly.addEventListener('contextmenu', (e) => {
        console.log('rightClick polygon');
        return false;
      });
      poly.addEventListener('click', (e: L.LeafletMouseEvent) => {
        this.CurrentPolygon = e.target;
      });
      // Nếu là polyline
    } else if (event.layerType === 'polyline') {
      const latlng = event.layer._latlngs;
      const polyline = this.createPolyline(latlng);
      this.map.addLayer(polyline);
      this.CurrentPolyline = polyline;
      let a = 0;
      console.log(polyline);
      // dblclick để sửa
      polyline.addEventListener('dblclick', (e: L.LeafletMouseEvent) => {
        this.map.doubleClickZoom.disable();
        e.target.editing.enable();
        if (a > 0) {
          e.target.editing.disable();
          this.map.doubleClickZoom.enable();
          a = 0;
        } else {
          a++;
        }
      });
      polyline.addEventListener('click', (e: L.LeafletMouseEvent) => {
        this.CurrentPolyline = e.target;
      });
      // Nếu là vẽ hình tròn
    } else if (event.layerType === 'circle') {
      const latlng = event.layer._latlng;
      const options: any = {
        color: 'red',
        weight: 3,
        opacity: 1,
        smoothFactor: 1,
        fillColor: 'red',
        fillOpacity: 0.3,
        fill: true,
        dragable: false,
        radius: event.layer._mRadius,
        iconPath: 'assets/icons/Blue0.png',
        center: [latlng.lat, latlng.lng],
      };
      const circle = this.createCircle(latlng, options);
      this.map.addLayer(circle.circle);
      // this.map.addLayer(circle.center);
      this.CurrentCircle = circle.circle;
      // this.CurrentMarker = circle.center;
      let a = 0;
      // dblclick để sửa
      circle.circle.addEventListener('dblclick', (e: L.LeafletMouseEvent) => {
        this.map.doubleClickZoom.disable();
        e.target.editing.enable();
        if (a > 0) {
          e.target.editing.disable();
          this.map.doubleClickZoom.enable();
          a = 0;
        } else {
          a++;
        }
      });
      circle.circle.addEventListener('click', (e: L.LeafletMouseEvent) => {
        this.CurrentCircle = e.target;
      });
    }
  }

  onSelectVehicle(event: any): void {}
}
