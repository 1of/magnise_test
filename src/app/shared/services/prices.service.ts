import { Injectable } from '@angular/core';
import {environment} from '../../enviroments/environment';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PricesService {
  url = environment.URL;
  constructor(private http: HttpClient,
              private _cookieService: CookieService) { }

  listInstruments() {
    return this.http.get(this.url + '/api/instruments/v1/instruments?provider=oanda&kind=forex');
  }

  countBack(instrumentId: string) {
    return this.http.get(this.url + `/api/bars/v1/bars/count-back?instrumentId=${instrumentId}&provider=oanda&interval=1&periodicity=minute&barsCount=1`);
  }
}
