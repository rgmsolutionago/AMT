import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieLogic } from '../../services/movie-logic.service';
import { PendingOrder, Product, Category } from '../../models/pending-order.model';
import { CustomErrorComponent } from '../../components/custom-error/custom-error.component';
import { PrintingService } from '../../services/printing.service';
import { environment } from '../../../environments/environment';
import { TicketSummary } from '../../models/ticket-summary.model';
import { forceToArray } from '../../utils/force-to-array.function';
import { DateHelper } from '../../utils/date.helper';

/**
 * Print Tikets
 */
@Component({
  selector: 'app-web-print-ticket',
  templateUrl: './web-print-ticket.component.html'
})
export class WebPrintTicketComponent implements OnInit {

  development = !environment.production;

  @ViewChild('errorPopup')
  errorPopup: CustomErrorComponent;

  ticketSummary: TicketSummary;
  ticketDate: string;
  order: PendingOrder;

  show: any;
  candies: any[] = [];
  movies: any[] = [];

  constructor(private logic: MovieLogic,
    private printingService: PrintingService) { }

  ngOnInit() {
    //TODO Improve information to show since multiple tickets may exist
    this.ticketSummary = this.logic.getTicketSummary();

    console.log("ticketSummary from web-print-ticket:");
    console.log(this.ticketSummary);

    this.printTickets();
  }

  async printTickets() {
    this.logMessage("Print start");

    this.printingService.printTickets(this.ticketSummary.ticketResponse)
    .then(() => {
        this.logMessage("Print finished success.");
        this.confirmPrintedTickets();
    })
    .catch(() => {
        this.logMessage("Print error");
        this.error(); 
    });
  }

  private logMessage(message)
  {
    const now = new Date();
    const formattedDateTime = now.toISOString().replace('T', ' ').substring(0, 19);
    console.log(`${message} at ${formattedDateTime}`);
  }

  private confirmPrintedTickets() {
    this.logic.confirmPrintedTickets(this.ticketSummary.pID, this.ticketSummary.pPickUpCode).subscribe(
      () => this.errorWithMessage("Gracias por su compra"),
      () => this.error());
  }

  error() {
    const message = "Ha ocurrido un error al imprimir su ticket, solicite ayuda al personal";
    this.errorPopup.open(message);
  }

  errorWithMessage(message: string) {
    this.errorPopup.open(message);
  }

  productPrice(candy: any) {
    return candy && (+candy.Amount * candy.Quantity) || '';
  }
}
