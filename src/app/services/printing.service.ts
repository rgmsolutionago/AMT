import { AppConfig } from '../app.config';
import { Injectable } from '@angular/core';
import { RestBaseService } from './rest-base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketResponse } from '../models/ticket-response.model';
import { forceToArray } from '../utils/force-to-array.function';
import { PrintRequest } from '../models/print-request.model';

@Injectable({
  providedIn: 'root'
})
export class PrintingService extends RestBaseService<any> {

  constructor(protected http: HttpClient) {
    super(http, `${AppConfig.settings.printer.serviceBaseUrl}`);
  }

  //Test request to wake up printer service.
  public async checkPrinterStatusTestRequest() {
    try {
      await this.get("printer/status?printername=Microsoft XPS Document Writer").toPromise();
      console.warn('Printer Status OK');
      return true;
    } catch (error) {
      console.warn('Printer Status', error);
      return false;
    }
  }

  public async printTickets(ticketResponse: TicketResponse) {
    var printBoxOfficeResult = (ticketResponse.Ticket == null || ticketResponse.Ticket == undefined) ? true : await this.printBoxOffice(ticketResponse);
    var printConcessionResult = await this.printConcession(ticketResponse);
    var printReceiptConcessionResult = await this.printReceiptConcession(ticketResponse);

    return printBoxOfficeResult && printConcessionResult && printReceiptConcessionResult;
  }

  public async printDocuments(documents: string)
  {
    if (!documents) {
      throw new Error("documents empty");
    }

    let printRequest: PrintRequest = {
      content: forceToArray(documents),
      printer: `${AppConfig.settings.printer.concession.name}`,
      port: `${AppConfig.settings.printer.concession.port}`
    };

    await this.post(printRequest, "printer").toPromise();
  }

  private async printBoxOffice(ticketResponse: TicketResponse) {
    var content = forceToArray(ticketResponse.Ticket).map(x => x.PrintStringTicket);
    if (content.length == 0) {
      return true;
    }

    let printRequest: PrintRequest = {
      content: content,
      printer: `${AppConfig.settings.printer.boxOffice.name}`,
      port: `${AppConfig.settings.printer.boxOffice.port}`
    };

    try {
      await this.post(printRequest, "printer").toPromise();
      return true;
    } catch (error) {
      console.warn('Printing Box Office', error);
      return false;
    }
  }

  private async printConcession(ticketResponse: TicketResponse) {

    if (!ticketResponse.Concessions.Concession.PrintStringConcessions) {
      return true;
    }

    let printRequest: PrintRequest = {
      content: forceToArray(ticketResponse.Concessions.Concession.PrintStringConcessions),
      printer: `${AppConfig.settings.printer.concession.name}`,
      port: `${AppConfig.settings.printer.concession.port}`
    };

    try {
      await this.post(printRequest, "printer").toPromise();
      return true;
    } catch (error) {
      console.warn('Printing Concession', error);
      return false;
    }
  }

  private async printReceiptConcession(ticketResponse: TicketResponse) {
    if (!ticketResponse.Concessions.Concession.PrintStringReceiptConcessions) {
      return true;
    }

    let printRequest: PrintRequest = {
      content: forceToArray(ticketResponse.Concessions.Concession.PrintStringReceiptConcessions),
      printer: `${AppConfig.settings.printer.receiptConcession.name}`,
      port: `${AppConfig.settings.printer.receiptConcession.port}`
    };

    try {
      await this.post(printRequest, "printer").toPromise();
      return true;
    } catch (error) {
      console.warn('Printing Receipt Concession', error);
      return false;
    }
  }
}