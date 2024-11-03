import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { AppConfig } from '../../app.config';
import { MsgService } from '../../../app/services/msg.service';
// import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html'
})
export class NavBarComponent implements OnInit {
  @Input('activePage') activePage: string;
  @Input() onlyCandy: any;

  order;
  keyLayoutsExists: boolean;

  constructor(private logic: MovieLogic, private router: Router, private msgService: MsgService) { 
   
    msgService.$emitterSetKeyLayoutsExists.subscribe(value => {
      this.keyLayoutsExists = value;
    });
    
  }

  ngOnInit() {
    this.order = this.logic.getOrder();
  }

  getOrderCurrentStep(): number {
    const orderCurrentStep: number =
      this.order && this.order.currentStep ? this.order.currentStep : 0;

    return orderCurrentStep;
  }

  isDisabled(orderCurrentStep: number) {
    return this.getOrderCurrentStep() <= orderCurrentStep;
  }

  orderCurrentStep() {
    return this.getOrderCurrentStep();
  }

  isWithdraw() {
    return this.activePage === 'impresion' || this.activePage === 'venta';
  }
}
