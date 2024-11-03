import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MovieLogic } from '../../services/movie-logic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingOrder } from '../../models/pending-order.model';
import { OnScreenKeyboardComponent } from '../../components/on-screen-keyboard/on-screen-keyboard.component';
import { CacheService } from '../../../app/services/cache.service';

/**
 * Allow to Select a Movie
 */
@Component({
  selector: 'app-client-invoice-info',
  templateUrl: './client-invoice-info.component.html'
})
export class ClientInvoiceInfoComponent implements OnInit {

  @ViewChild('onScreenKeyboard')
  onScreenKeyboard: OnScreenKeyboardComponent;
  @ViewChild('inputClientDocument') inputClientDocument: ElementRef<HTMLInputElement>;
  @ViewChild('inputClientName') inputClientName: ElementRef<HTMLInputElement>;

  order: PendingOrder;
  clientName: string = '';
  clientDocument: string = '';
  focusedInputName: string;
  onlyCandy: boolean;

  constructor(private logic: MovieLogic, private cache: CacheService,
    private router: Router, private route: ActivatedRoute) {
      route.params.subscribe((params) => {
        this.onlyCandy = params.onlyCandy == 'candy';
      });
     }

  ngOnInit() {
    this.onScreenKeyboard.setOpen(false);
    
    this.logic.onInit.then(() => {
      this.loadData();
    });
  }

  loadData() {
    this.order = this.logic.getOrder();

    if (this.order.clientDocument !== undefined) {
      this.clientDocument = this.order.clientDocument;
    }

    if (this.order.clientName !== undefined) {
      this.clientName = this.order.clientName;
    }
  }

  next() {
    this.saveClientInfo();
    if (this.onlyCandy) {
      this.router.navigateByUrl('/pago/candy');
    } else {
      this.router.navigateByUrl('/pago/');
    }
  }

  back() {
    this.saveClientInfo();

    const keyLayoutsExists = this.cache.getKeyLayoutsExists() == "true";
    if(keyLayoutsExists) {
      if(this.onlyCandy){
        this.router.navigateByUrl('/productos/candy');
      } else {
        this.router.navigateByUrl('/productos/');
      }
    } else {
      if (this.order.distribution) {
        this.router.navigateByUrl('/asientos');
      } else {
        this.router.navigateByUrl('/categorias');
      }
    }
   

  }

  saveClientInfo() {
    this.order.clientDocument = this.stringHasValue(this.clientDocument) ? this.clientDocument : '';
    this.order.clientName = this.stringHasValue(this.clientName) ? this.clientName : '';
    this.logic.saveOrder(this.order);
  }

  stringHasValue(variable: string): boolean {
    return (variable !== undefined && variable !== null && variable !== '');
  }

  onKeyPressed(key: string): void {
    if (this.focusedInputName == 'inputClientDocument') {
      if (key === 'Delete') {
        this.clientDocument = this.clientDocument.slice(0, -1);
      } else {
        this.clientDocument = this.clientDocument + key;
      }
    }

    if (this.focusedInputName == 'inputClientName') {
      if (key === 'Delete') {
        this.clientName = this.clientName.slice(0, -1);
      } else {
        this.clientName = this.clientName + key;
      }
    }
  }

  focusInput(inputName: string): void {
    this.focusedInputName = inputName;

    if (this.focusedInputName == 'inputClientDocument') {
      this.inputClientDocument.nativeElement.focus();
    }

    if (this.focusedInputName == 'inputClientName') {
      this.inputClientName.nativeElement.focus();
    }

    this.onScreenKeyboard.setOpen(true);
  }
}
