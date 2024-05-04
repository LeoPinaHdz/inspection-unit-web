import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import * as HttpStatusCodes from 'http-status-codes';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LoaderService } from '../components/loader';
import { NotificationsService } from '../components/notification';
import { TipoError } from '../enums';

@Injectable()
export class ErrorHttpInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const loaderService = this.injector.get(LoaderService);
        const notificationService = this.injector.get(NotificationsService);

        console.log(`error status : ${error.status} ${error.statusText}`, error.message);

        const errorInfo = {
          url: request.url,
          body: request.body,
          params: request.params,
        };

        if (this.noExisteConexion()) {
          notificationService.error('info', 'Sin Conexión!', 'Error!');
        }

        loaderService.hide();

        switch (error.status) {
          case HttpStatusCodes.BAD_REQUEST:
            if (error.error.tipoError) {
              if (error.error.tipoError === TipoError.Validacion) {
                error.error.validationErrors.forEach((mensaje) => {
                  notificationService.error(mensaje);
                });

                return throwError(error.error.validationErrors);
              } else if (error.error.tipoError === TipoError.Negocio) {
                const negociosMensaje = this.negociosErrorMessage(error.error);
                notificationService.error(error.error.message);

                return throwError(negociosMensaje);
              }
            } else {
              notificationService.error(error.error.message);
              return throwError(error.error.message);
            }
            break;

          case HttpStatusCodes.FORBIDDEN:
          case HttpStatusCodes.UNAUTHORIZED:
            notificationService.error('No cuenta con permisos para acceder a esta función.');
            break;

          case HttpStatusCodes.INTERNAL_SERVER_ERROR:
            notificationService.error(error.message);
            // loaderService.loadingSource.next(false);
            break;

          case 0:
            notificationService.error(error.message);
            // this.loadingService.loadingSource.next(false);
            break;
        }

        return throwError(error.message);
      })
    );
  }

  private noExisteConexion(): boolean {
    return !navigator.onLine;
  }

  private negociosErrorMessage(error: ErrorApi): string[] {
    const errors: string[] = [error.mensaje];
    return errors;
  }
}

interface ErrorApi {
  mensaje: string;
  tipoError: TipoError;
}
