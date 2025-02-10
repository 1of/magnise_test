import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {environment} from '../../enviroments/environment';
import {map, of} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  url = environment.URL;
  constructor(private http: HttpClient,
              private _cookieService: CookieService
  ) {}
  public getToken() {

    const access_token = this._cookieService.get('access_token')
    if(access_token) {
      return of(access_token);
    } else {

      let body = new URLSearchParams();
      body.set('grant_type', 'password');
      body.set('client_id', 'app-cli');
      body.set('username', environment.USERNAME);
      body.set('password', environment.PASSWORD);
      return this.http.post(this.url + '/identity/realms/fintatech/protocol/openid-connect/token',
        body,
        { headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded'})
        }).pipe(
        map(
          (response: any) => {
            if(response.access_token && response.refresh_token) {
              this.storeTokens(response.access_token, response.refresh_token);
            }
            return response.access_token ? response.access_token : null;
          }
        ));
    }

  }

  public storeTokens(access_token: string, refresh_token: string, access_tokenExpire: number = 1800, refresh_tokenTokenExpire: number = 3600) {
    const access_token_CookieExpDate = new Date();
    const refresh_token_CookieExpDate = new Date();
    access_token_CookieExpDate.setSeconds(access_token_CookieExpDate.getSeconds() + access_tokenExpire);
    refresh_token_CookieExpDate.setSeconds(refresh_token_CookieExpDate.getSeconds() + refresh_tokenTokenExpire);
    this._cookieService.set('access_token', access_token, {
      expires: access_token_CookieExpDate,
      path: '/',
      secure: true,
    });
    this._cookieService.set('refresh_token', refresh_token, {
      expires: refresh_token_CookieExpDate,
      path: '/',
      secure: true,
    });
  }
}
