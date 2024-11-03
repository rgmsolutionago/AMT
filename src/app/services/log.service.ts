import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';

@Injectable()
export class LogService {

    constructor(private trans: TransactionService)
    {
    }

    saveLog(method: string, cls: string, description: string){
        this.trans.saveLog(method, cls, description).subscribe();
      }
}