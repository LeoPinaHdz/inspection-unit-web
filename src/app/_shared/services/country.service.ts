import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country, CountrySE } from '../models/country.model';

@Injectable()
export class CountryService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(`${environment.url}Country/GetAll`);
  }

  getAllSE(): Observable<CountrySE[]> {
    return this.http.get<CountrySE[]>(`${environment.url}Country/GetAllSE`);
  }
}
