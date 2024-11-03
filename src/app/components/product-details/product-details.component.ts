import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  dialogClasses = 'modal-wrapper';
  product: any;

  constructor() { }

  ngOnInit() {
  }
  
  public open(product?: any): void {
    this.dialogClasses = 'modal-wrapper open animated fadeIn';
    this.product = product;
    console.log(product);
  }

  public close(): void {
    this.dialogClasses = 'modal-wrapper animated fadeOut';
  }
}
