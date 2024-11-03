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
  selector: 'app-web-code-ticket',
  templateUrl: './web-code-ticket.component.html'
})
export class WebCodeTicketComponent implements OnInit {

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
    this.order = this.logic.getOrder();
    if (this.order != null) {
      this.order.level = 30;
      this.logic.saveOrder(this.order);
    }

    // TODO Improve information to show since multiple tickets may exist
    this.ticketSummary = this.logic.getTicketSummary();

    console.log("ticketSummary from web-code-ticket:");
    console.log(this.ticketSummary);

    this.buildTickets();
    this.buildCandies();
    this.buildShow();
    this.printTickets();
  }


  buildTickets() {
    if (this.ticketSummary.ticketResponse.Ticket != null) {
      let tickets: any = forceToArray(this.ticketSummary &&
        this.ticketSummary.ticketResponse &&
        this.ticketSummary.ticketResponse.Ticket);

      const ticketsList = [];

      if (Array.isArray(tickets)) {
        tickets.forEach(ticket => {
          if (ticket.TicketType != null) {

            const tycketTypeID = ticket.TicketType.ID;

            let ticketExists = ticketsList.find(x => x.TicketType.ID == tycketTypeID);
            if (ticketExists != null) {
              ticketExists.Quantity++;
            } else {
              ticketsList.push({
                ...ticket,
                Quantity: 1
              })
            }
          }
        });
      } else {
        ticketsList.push({ ...tickets, Quantity: 1 })
      }
      this.movies = ticketsList;
    }
  }

  buildShow() {
    const movieDate = this.tickets[0];

    if(this.ticketSummary.shows !== null){
      let show = this.ticketSummary.shows[0];
  
      if (show != undefined) {
        this.show = {
          originalTitle: show.Feature.OriginalTitle,
          premierDate: this.logic.toHumanDate(DateHelper.buildDateFromYYYYMMDD(movieDate.ShowTimeDate)),
          startTime: show.StartTime,
          screenName: show.ScreenName
        }
      }
    }
  }

  buildCandies() {

    let conseccions = this.ticketSummary.ticketResponse.Concessions.Concession;
    if(conseccions.Items != undefined){
      if(conseccions!=null){
        if (Array.isArray(conseccions.Items.Item)) {
          conseccions.Items.Item.map(i => {
            this.candies.push(i);
          })
        } else {
          this.candies.push(conseccions.Items.Item);
        }
      }
    }
  }

  get tickets() {
    return forceToArray(this.ticketSummary &&
      this.ticketSummary.ticketResponse &&
      this.ticketSummary.ticketResponse.Ticket);
  }

  get ticketsTotal() {
    let total = 0;

    this.movies.map(m => {
      total += Number(m.Amount) * m.Quantity;
    })

    this.candies.map(c => {
      total += Number(c.Amount) * c.Quantity;
    })

    return total;
  }

  async printTickets() {
      this.logMessage("Print start");
      this.printingService.printTickets(this.ticketSummary.ticketResponse)
      .then(() => {
          this.logMessage("Print finished success.");
          if(!this.development)
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
    this.logic.cleanLastWebCodeTicket();
  }

  productPrice(candy: any) {
    return candy && (+candy.Amount * candy.Quantity) || '';
  }


}
