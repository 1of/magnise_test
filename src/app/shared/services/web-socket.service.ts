import { Injectable } from '@angular/core';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  wss_url = environment.URI_WSS;
  private socket$: WebSocketSubject<any> = webSocket('');

  constructor(private _cookieService: CookieService) {
    this.initConnection();
  }

  initConnection() {
    const access_token = this._cookieService.get('access_token');
    if(access_token) {
      this.socket$ = webSocket(this.wss_url + '/api/streaming/ws/v1/realtime?token='+access_token);
    }
  }

  // Send a message to the server
  sendMessage(message: any) {
    this.socket$.next(message);
  }

  // Receive messages from the server
  getMessages(): Observable<any> {
    return this.socket$.asObservable();
  }

  // Close the WebSocket connection
  closeConnection() {
    this.socket$.complete();
  }
}
