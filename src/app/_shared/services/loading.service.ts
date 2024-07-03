import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  constructor(private ngZone: NgZone) {}

  setLoading(loading: boolean) {
    this.ngZone.run(() => {
      this._loading.next(loading);
    });
  }
}