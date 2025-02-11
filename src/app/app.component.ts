import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MarketPriceComponent } from './shared/components/market-price/market-price.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MarketPriceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test';
}
