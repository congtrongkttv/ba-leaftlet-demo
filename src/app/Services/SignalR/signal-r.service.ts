import { Injectable } from '@angular/core';
import { ObservationService } from '../ObservationService/observation.service';
import {
  HubConnectionBuilder,
  HttpTransportType,
  HubConnectionState,
} from '@aspnet/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  constructor(private observationService: ObservationService) {}
  hubConnection: signalR.HubConnection;
  public startConnection(userId, token): Promise<any> {
    let url =
      'http://192.168.1.48:211/onlineHub/' +
      '?PK_UserID=' +
      userId +
      '?token=' +
      token;
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(url, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection.on('SendCarSignalRByGroup', (vehicle) => {
      if (vehicle) {
        this.observationService.leftPanelSubject.next(vehicle);
      }
    });

    return this.hubConnection.start();
  }

  public joinGroup(vehicleIDs: string): Promise<any> {
    if (
      this.hubConnection &&
      this.hubConnection.state === HubConnectionState.Connected
    ) {
      return this.hubConnection.invoke('JoinGroupByVehicleId', vehicleIDs);
    }
  }
}
