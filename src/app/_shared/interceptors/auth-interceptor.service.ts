import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler): Observable<HttpEvent<any>> {

      const currentToken = sessionStorage.getItem('token');

      if (currentToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
      }

      request = request.clone({
        headers: request.headers.set('Accept', 'application/json'),
      });

      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          return event;
        })
      );
  }
}
