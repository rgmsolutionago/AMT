import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CinestarSoapService } from './cinestar-soap.service';
import { NgxSoapService } from 'ngx-soap';
import { Observable } from 'rxjs';
import { TicketResponse } from '../models/ticket-response.model';
import { PricesResponse } from '../models/prices-response.model';
import { SellResponse } from '../models/sell-response.model';
import { WorkstationResponse } from '../models/workstation-response.model';

@Injectable()
export class TransactionService extends CinestarSoapService {
  onInit: Promise<void>;

  constructor(private soap: NgxSoapService) {
    super(soap);
    this.onInit = this.initTrans();
  }

  /* Devuelve la fecha para la cual el complejo está vendiendo las entradas. */
  getTheatreSalesDate(): Observable<string> {
    return this.get(this.transClient, 'GetSalesDate', {
      pTheatreID: this.theatreID
    }).pipe(map(this.salesDate));
  }

  public salesDate(res: any): string {
    return (res && res.SalesDate) || null;
  }

  /* Devuelve la información de las entradas a imprimir. */
  getPendingTickets(ci: number, code: string): Observable<TicketResponse> {
    return this.getOne<TicketResponse>(this.transClient, 'GetPendingTickets', {
      pTheatreID: this.theatreID,
      pID: ci,
      pPickUpCode: code,
      pWorkstationID: this.workstationId
    });
  }

  /* Devuelve la información de las entradas a imprimir. */
  confirmPrintedTickets(ci: number, code: string): Observable<any> {
    return this.get(this.transClient, 'ConfirmPrintedTickets', {
      pTehatreID: this.theatreID,
      pID: ci,
      pPickUpCode: code,
      pWorkstationID: this.workstationId
    });
  }

  /* Devuelve los precios por categoría disponibles para la función a consultar. */
  getCategoryPrices(scheduleId: string): Observable<PricesResponse> {
    return this.getOne<PricesResponse>(this.transClient, 'GetPrices', {
      pTheatreID: this.theatreID,
      pScheduleID: scheduleId,
      pWorkstationID: this.workstationId
    }) ;
  }

  /* Devuelve la información de los asientos conteniendo la Distribución asociada y
  todas las Zonas habilitadas. */
  getSeats(scheduleId: string, sessionId: string) {
    return this.get(this.transClient, 'GetSeats', {
      pTheatreID: this.theatreID,
      pScheduleID: scheduleId,
      pSessionID: sessionId,
      pWorkstation: this.workstationId
    });
  }

  /* Graba en la tabla ButacasBloqueadas la butaca con el Id de la Sesión y la Terminal que la bloqueo. */
  blockSeat(scheduleId: string, seatId: string, sessionId: string) {
    return this.get(this.transClient, 'BlockSeat', {
      pTheatreID: this.theatreID,
      pScheduleID: scheduleId,
      pSeatID: seatId,
      pSessionID: sessionId,
      pWorkstationID: this.workstationId
    });
  }

  unblockSeat(seatId: string, sessionId: string, scheduleId: string) {
    return this.get(this.transClient, 'UnblockSeat', {
      pTheatreID: this.theatreID,
      pScheduleID: scheduleId,
      pSeatID: seatId,
      pSessionID: sessionId,
      pworkstationID: this.workstationId
    });
  }

  /* Elimina en la tabla ButacasBloqueadas las butacas con el Id de la Sesión y la Terminal que la bloqueo. */
  unblockAllSeats(sessionId: string) {
    return this.get(this.transClient, 'UnblockSeats', {
      pTheatreID: this.theatreID,
      pSessionID: sessionId,
      pWorkstationID: this.workstationId
    });
  }

  /* Devuelve un IdSession aleatorio para diferenciar las Sesiones. */
  getSessionId() {
    return this.get(this.transClient, 'GetSession', {});
  }

   /* Inicia el procesamiento de una venta. */
  sell(xmlSaleData: string): Observable<SellResponse> {
    return this.getOne<SellResponse>(this.transClient, 'Sell', {
      xmlSaleData: xmlSaleData
    });
  }

  getWorkstationByID() {
    return this.getOne<WorkstationResponse>(this.transClient, 'GetWorkstationByID', {
      pTheatreID: this.theatreID,
      pWorkStationID: this.workstationId
    });
  }

  saveLog(method: string, cls: string, description: string): Observable<any> {
    return this.get(this.transClient, 'SaveLog', {
      pTheatreID: this.theatreGroupID,
      pWorkstationID: this.workstationId,
      pAplication: 'ATM',
      pMethod: method,
      pClass: cls,
      pDescription: description
    });
  }
}
