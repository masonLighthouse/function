import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from 'chart.js';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
})
export class StatsComponent implements OnInit, OnChanges {
  @Input() stats: any;
  showChartElement: boolean;
  canvas: HTMLCanvasElement;
  myChart: any;
  ctx: any;
  dataCount: number = 6;
  labels: any[] = [];
  dataPoints: number[] = [0, 3, 2, 5, 8, 7];
  data: any;
  config: any;

  constructor() {}

  ngOnInit() {
    this.showChartElement = this.stats;
  }

  ngOnChanges() {
    if (this.stats === true) {
      this.showChartElement = true;
      setTimeout(() => {
        Chart.register(
          ArcElement,
          LineElement,
          BarElement,
          PointElement,
          BarController,
          BubbleController,
          DoughnutController,
          LineController,
          PieController,
          PolarAreaController,
          RadarController,
          ScatterController,
          CategoryScale,
          LinearScale,
          LogarithmicScale,
          RadialLinearScale,
          TimeScale,
          TimeSeriesScale,
          Decimation,
          Filler,
          Legend,
          Title,
          Tooltip
        );
        for (let i = 0; i < this.dataCount; ++i) {
          if (this.labels.length < this.dataCount) {
            this.labels.push(i.toString());
          }
        }
        this.canvas = <HTMLCanvasElement>document.getElementById('myChart');
        this.ctx = this.canvas.getContext('2d');
        this.data = {
          labels: this.labels,
          datasets: [
            {
              label: 'Tasks (count of tasks crossed off on a specific day)',
              data: this.dataPoints,
              borderColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
              cubicInterpolationMode: 'monotone',
              tension: 0.4,
            },
          ],
        };
        this.config = {
          type: 'line',
          data: this.data,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Task completion count (per week)',
              },
            },
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: 'Value',
                },
                suggestedMin: 0,
                suggestedMax: Math.max(...this.dataPoints) + 5,
              },
            },
          },
        };
        this.myChart = new Chart(this.ctx, this.config);
      }, 100);
    } else {
      this.showChartElement = false;
    }
  }
}
