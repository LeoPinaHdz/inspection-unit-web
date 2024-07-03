import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/_shared/services/loading.service';

@Component({
  selector: 'app-secure-layout',
  templateUrl: './secure-layout.component.html',
  styleUrls: ['./secure-layout.component.scss']
})
export class SecureLayoutComponent implements OnInit, AfterViewInit {
  loading$: Observable<boolean>;

  constructor(private router: Router,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    if (!sessionStorage.getItem('currentUser')) {
      this.router.navigate(['/auth/login']);
    }
  }

  ngAfterViewInit() {
    this.loading$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

}
