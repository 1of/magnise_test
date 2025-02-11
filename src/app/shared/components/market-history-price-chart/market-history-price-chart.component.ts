import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {
  ChartAllModule,
  ChartComponent,
  ILoadedEventArgs, Series, ZoomService
} from '@syncfusion/ej2-angular-charts';
import {ChartItem} from '../../interfaces/instruments.interfaces';


@Component({
  selector: 'market-history-price-chart',
  imports: [ChartAllModule],
  standalone: true,
  providers: [ZoomService],
  templateUrl: './market-history-price-chart.component.html',
  styleUrl: './market-history-price-chart.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MarketHistoryPriceChartComponent {
  @ViewChild('chartcontainer') public chart?: ChartComponent;
  @Input() public data: ChartItem[];

  // Chart Config
  // Initializing Primary X Axis
  public primaryXAxis: Object = {
    valueType: 'DateTime',
    labelFormat: 'y/M/d h:mm:ss',
    edgeLabelPlacement: 'Shift',
  };
  // Initializing Primary Y Axis
  public primaryYAxis: Object = {
    title: 'Price',
    // interval: 0.0001,
    labelFormat: 'N4', // Forces 4 decimal places
  };
  public chartArea: Object = {
    border: {
      width: 0
    }
  };
  public width: string = '100%';
  public diamondMarker: Object = { visible: true, height: 5, width: 5 , shape: 'Diamond' , isFilled: true };
  public tooltip: Object = {
    enable: true,
    enableHighlight: true
  };
  public legend: Object = {
    visible: true,
    enableHighlight: true
  }
  public zoom?: Object = {
    enablePinchZooming: true,
    enableSelectionZooming: true
  };
  public load(args: ILoadedEventArgs): void {
    // any chart init things
  };

  maxVisiblePoints: number = 30;

  addItem(item: ChartItem) {
    if (this.chart instanceof ChartComponent) {
      this.chart?.series[0].addPoint?.(item, 500);

      if((this.chart?.series[0] as Series)?.points?.length > this.maxVisiblePoints) {
        this.chart.series[0].removePoint?.(0);
      }
    }
  }

}
