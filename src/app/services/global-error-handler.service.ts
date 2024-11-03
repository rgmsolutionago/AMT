import { Injectable, Injector, ErrorHandler, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLogService } from './error-log.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  constructor(private injector: Injector, private logger: ErrorLogService, private ngZone: NgZone) { }

  handleError(error: any): any {
    const router = this.injector.get(Router);

    this.logger.logError(error, router.url);
    this.ngZone.run(() => router.navigate(['error'])
    );
  }
}
