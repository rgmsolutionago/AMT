import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieLogic } from '../../services/movie-logic.service';
import { PendingOrder, Product } from '../../models/pending-order.model';
import { PopupComponent } from '../../components/popup/popup.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-print-ticket',
  templateUrl: './print-ticket.component.html'
})
export class PrintTicketComponent implements OnInit {

  order: PendingOrder;

  constructor(private logic: MovieLogic) { }

  ngOnInit() {
    this.order = this.logic.getOrder();
    // TODO Replace with current order values
    const pID = 2222;
    const pickupCode = "2222";
    if (environment.production) this.logic.confirmPrintedTickets(pID, pickupCode).subscribe(() => null);
  }

  productPrice(product: Product) {
    return product && (+product.ImpPreciosXProducto * product.quantity) || '';
  }

}
