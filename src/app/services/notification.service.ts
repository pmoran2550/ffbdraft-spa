import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BASE_API_URL } from '../constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection | undefined;
  private playersUpdatedSource = new BehaviorSubject<{user: string, message: string} | null>(null);
  playersUdated$ = this.playersUpdatedSource.asObservable();
  private hubConnStr = BASE_API_URL + '/notificationHub';

  constructor() {
    this.startConnection();
    this.registerOnServerEvents();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubConnStr, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }) 
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Connection Error: ', err));
  }

  private registerOnServerEvents() {
    this.hubConnection?.on('PlayersUpdated', (user: string, message: string) => {
      this.playersUpdatedSource.next({user, message});
    });
  }
}
