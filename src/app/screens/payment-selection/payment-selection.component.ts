import { AppConfig } from '../../app.config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { CacheService } from '../../../app/services/cache.service';

@Component({
  selector: 'app-payment-selection',
  templateUrl: './payment-selection.component.html'
})
export class PaymentSelectionComponent implements OnInit {
  @ViewChild('errorPopup')
  errorPopup: PopupComponent;

  order;
  selectedProduct;
  selectedDate;
  products = [];
  availablePaymentMethods = []
  selectedPaymentMethod;
  selectedCreditCardCSID;
  errorMessage;

  onlyCandy: boolean;

  constructor(
    private logic: MovieLogic,
    private router: Router,
    private cache: CacheService,
    private route: ActivatedRoute
  ) { 
    route.params.subscribe((params) => {
      this.onlyCandy = params.onlyCandy == 'candy';
    });
  }

  ngOnInit() {
    this.logic.onInit.then(() => {
      this.loadData();
    });
  }

  loadData() {
    let selectedKeyLayoutId = 4; // Esto lo va a obtener del localstorage
    this.order = this.logic.getOrder();
    this.products = this.logic.getProducts(selectedKeyLayoutId);

    if(!this.onlyCandy){
      this.selectedDate = this.logic.toHumanDate(this.logic.parseIsoDate(this.order.date.toString()));
    }
    this.availablePaymentMethods = AppConfig.settings.availablePaymentMethods;

    if (!this.products) {
      return;
    }

    if (this.products.length > 0) {
      this.selectedProduct = this.products[0];
    }

    // Reset product quantity
    this.products.forEach(product => {
      product.quantity = 0;
    });

    // Set user selected quantities
    if (this.order.products) {
      this.order.products.forEach(prod => {
        const product = this.products.find(p => p.CodProducto === prod.CodProducto);
        if (product) {
          product.quantity = prod.quantity;
        }
      });
    }
    //this.c();
  }

  // calculateTotal() {
  //   // Add the products to the order total
  //   if (this.order.products != null) {

  //     this.products.forEach(product => {

  //       const orderProduct = this.order.products.find(p => p.CodProducto === product.CodProducto);
  //       if (orderProduct) {
  //         product.quantity = orderProduct.quantity;
  //         this.order.level = 30;
  //         var total = orderProduct.quantity * +orderProduct.ImpPreciosXProducto;
  //         this.order.total += total;
  //       }

  //     });
  //   }
  // }

  next() {
    if (!this.validateUserSelectedPaymentMethod()) {
      return;
    }

    this.order.paymentMethod = this.selectedPaymentMethod;
    this.order.creditCardCSID = this.selectedCreditCardCSID;
    this.logic.saveOrder(this.order);
    if(this.onlyCandy){
      this.router.navigateByUrl("/venta/candy");

    } else {
      this.router.navigateByUrl("/venta/");

    }
  }

  validateUserSelectedPaymentMethod(): boolean {
    if (this.selectedPaymentMethod != null) {
      return true;
    } else {
      this.customError("No se ha seleccionado un medio de pago")
      return false;
    }
  }

  back() {

    if(AppConfig.settings.showClientInvoiceScreen){
      if(this.onlyCandy){
        this.router.navigateByUrl('/client-invoice-info/candy');
      } else {
        this.router.navigateByUrl('/client-invoice-info/');
      }
    } else {
      
      const keyLayoutsExists = this.cache.getKeyLayoutsExists() == "true";
      
      if(keyLayoutsExists){
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
  }

  error() {
    this.errorMessage = "Ha ocurrido un error al imprimir su ticket, intente nuevamente o solicite ayuda al personal.";
    this.errorPopup.setOpen(true);
  }

  customError(error: string) {
    this.errorMessage = error;
    this.errorPopup.setOpen(true);
  }
}
