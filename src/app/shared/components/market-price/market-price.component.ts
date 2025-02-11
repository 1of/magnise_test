import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {AuthService} from '../../services/auth.service';
import {PricesService} from '../../services/prices.service';
import {Instrument} from '../../interfaces/instruments.interfaces';
import {WebSocketService} from '../../services/web-socket.service';
import {Subscription} from 'rxjs';
import {CommonModule, DatePipe} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MarketHistoryPriceChartComponent} from '../market-history-price-chart/market-history-price-chart.component';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'market-price',
  imports: [MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatCardModule,
    DatePipe, CommonModule, MarketHistoryPriceChartComponent],
  templateUrl: './market-price.component.html',
  styleUrl: './market-price.component.scss'
})

export class MarketPriceComponent implements OnInit, OnDestroy{
  selected = '';
  chartData: any[] = [];
  instruments: Instrument[] = [{
    id: '',
    symbol: '',
    kind: '',
    description: '',
    tickSize: 0,
    currency: '',
    baseCurrency: '',
    mappings: '',
    profile: ''
  }];
  messages: any[] = [];
  message = {
    type: "l1-subscription",
    id: "1",
    instrumentId: "",
    provider: "simulation",
    subscribe: false,
    kinds: [
      "ask",
      "bid",
      "last"
    ]
  };
  price: number = 0;
  timestamp: Date|null = null;

  @ViewChild(MarketHistoryPriceChartComponent) marketHistoryChart:MarketHistoryPriceChartComponent;
  private messageSubscription$: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService,
              private pricesService: PricesService,
              private webSocketService: WebSocketService) {
  }
  ngOnInit() {
    this.authService.getToken().subscribe(token => {
      if(token) {
        this.fetchInstruments();
        this.initPriceSubscription();
      }
    }, error => {
      // error handlers
    });
  }

  fetchInstruments() {
    this.pricesService.listInstruments().subscribe((res: any) => {
      if(res.data) {
        this.instruments = res.data
      }
    }, error => {
      // error handlers
    });
  }

  initPriceSubscription() {
    this.messageSubscription$ = this.webSocketService.getMessages().subscribe(
      (message) => {
        console.log(message);
        this.messages.push(message);
        this.pushChartData(message);
      }
    );
  }

  getInstrumentByID(id: string) {
    if(this.instruments.length) {
      return this.instruments.find((i: Instrument) => i.id === id);
    } else {
      return {
        id: '',
        symbol: '',
        kind: '',
        description: '',
        tickSize: 0,
        currency: '',
        baseCurrency: '',
      }
    }
  }

  getLastChartItem() {
    return this.chartData.length ? this.chartData[this.chartData.length - 1] : null
  }


  selectionChange(e: MatSelectChange) {
    this.message.instrumentId = e.value;
    this.message.subscribe = false;
    this.pricesService.countBack(e.value).subscribe((res: any) => {
      console.log(res);
      if(res.data && res.data.length) {
        this.price = res.data[0].c;
        this.timestamp = new Date(res.data[0].t);
      }
      this.sendMessage();
    }, error => {
      // error handlers
    })
  }

  sendMessage() {
    this.webSocketService.sendMessage(this.message);
  }
  subscribe() {
    this.message.subscribe = !this.message.subscribe;
  }

  pushChartData(m: any) {
    if(m && m.type && m.type === 'l1-update') {
      if(m.hasOwnProperty('ask')) {
        this.marketHistoryChart.addItem(m.ask);
      }
    }
  }


  ngOnDestroy() {
    this.messageSubscription$.unsubscribe();
    this.webSocketService.closeConnection();
  }
}
