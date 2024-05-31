import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  constructor(private http: HttpClient) {
  }

  getFolio(type: string): Observable<any> {
    return this.http.post<any>(`${environment.url}Utilities/GetFolio`, {type});
  }

}
