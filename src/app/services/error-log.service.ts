import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ErrorLogService {
  logError(error: any, requestUrl?: string) {
    const date = new Date().toISOString();

    if (requestUrl !== undefined) {
      console.log(date, `Request URL: ${requestUrl}`);
    }

    if (error instanceof HttpErrorResponse) {
      console.error(
        date,
        'There was an HTTP error.',
        error.message,
        'Status code:',
        (<HttpErrorResponse>error).status
      );
    } else if (error instanceof TypeError) {
      console.error(
        date,
        'There was a Type error.',
        error.message,
        error.stack
      );
    } else if (error instanceof Error) {
      console.error(
        date,
        'There was a general error.',
        error.message,
        error.stack
      );
    } else {
      console.error(
        date,
        'Nobody threw an error but something happened!',
        error
      );
    }
  }
}
