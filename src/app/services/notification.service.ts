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
    this.registerNetworkHandlers();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubConnStr, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();

    this.hubConnection.onreconnecting(err => console.warn('SignalR reconnecting: ', err));
    this.hubConnection.onreconnected(() => console.log('SignalR reconnected'));
    this.hubConnection.onclose(err => console.error('SignalR closed: ', err));

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

  private registerNetworkHandlers() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.reconnectIfDisconnected('tab became visible');
      }
    });

    window.addEventListener('online', () => {
      this.reconnectIfDisconnected('browser reported online');
    });
  }

  private reconnectIfDisconnected(reason: string) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Disconnected) {
      console.log('SignalR attempting reconnect: ', reason);
      this.hubConnection
        .start()
        .then(() => console.log('SignalR reconnected'))
        .catch(err => console.error('SignalR reconnect attempt failed: ', err));
    }
  }
}
