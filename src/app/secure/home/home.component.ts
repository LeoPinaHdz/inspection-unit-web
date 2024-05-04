import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HomeService } from './home.service';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/_shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  years: any[] = [];
  yearControl = new FormControl('', [Validators.required]);
  _onDestroy = new Subject<void>();
  dashboardData: any[] = [];

  constructor(
    private homeService: HomeService,
    private authService: AuthService
  ) {  }

  ngOnInit(): void {
    if (this.canViewDashboard()) {
      this.homeService.getAvailableYear()
      .pipe()
      .subscribe({
        next: (response) => {
          if (response.length) {
            this.years = response;
            this.yearControl = new FormControl({value: this.years[0].anio, disabled: response.length === 1}, [Validators.required]);
  
            this.yearControl.valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.loadMonthlyReport();
              });
  
              this.loadMonthlyReport();
          }
        },
        error: () => {
          console.error('Error trying to get clients');
        }
      });
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  canViewDashboard(): boolean {
    return this.authService.isAuthenticated() && this.authService.hasUserRole('DASHBOARD')
  }

  loadMonthlyReport(): void {
    this.homeService.getMonthlyReport(this.yearControl.getRawValue()!)
    .pipe()
    .subscribe({
      next: (response) => {
        this.dashboardData = response;
        this.prepareDataForDashboard();
      },
      error: () => {
        console.error('Error trying to get available monthly report');
      }
    });
  }

  prepareDataForDashboard(): void {
    const labels = Object.keys(this.dashboardData[0]).slice(1);
    const datasets = this.dashboardData.map(e => {
      const data = Object.values(e).slice(1) as number[];
      const label = Object.values(e)[0] as string;

      return {data, label};
    });

    this.lineChartData = {datasets, labels};
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: []
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      }
    },
    plugins: {
      legend: { display: true }
    }
  };
  public lineChartType: ChartType = 'line';
}
