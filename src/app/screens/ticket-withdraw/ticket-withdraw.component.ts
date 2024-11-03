import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { AlertComponent } from '../../../app/components/alert/alert.component';
import { AppConfig } from '../../app.config';

@Component({
  selector: 'app-ticket-withdraw',
  templateUrl: './ticket-withdraw.component.html'
})
export class TicketWithdrawComponent implements OnInit {
  @ViewChild('alert')
  private alert: AlertComponent;

  lastFocusedControl: string;
  tries: number;
  ticketForm = new FormGroup({
    ci: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required)
  });

  onlyCandy: boolean;

  isSubmitting = false;

  constructor(private router: Router, private logic: MovieLogic,
    private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.onlyCandy = params.onlyCandy == 'candy';
    });
  }

  ngOnInit() {
    this.lastFocusedControl = 'ci';
    this.tries = 1;
  }

  onFocus(control) {
    this.lastFocusedControl = control;
  }

  add(number) {
    const prevVal = this.ticketForm.controls[this.lastFocusedControl].value;
    this.ticketForm.controls[this.lastFocusedControl].setValue((prevVal !== null ? prevVal : '') + number.toString());
  }

  del() {
    this.ticketForm.controls[this.lastFocusedControl].setValue(
      this.ticketForm.controls[this.lastFocusedControl].value.slice(0, -1)
    );
  }

  onSave() {
    this.isSubmitting = true;

    if (this.tries >= AppConfig.settings.withdraw.maxTries) {
      this.router.navigate(['/seleccion']);
    }

    this.logic.onlyPrint(this.ticketForm.controls.ci.value, this.ticketForm.controls.code.value).subscribe(
      (x) => {
        // if(this.onlyCandy){
        //   this.router.navigate(['/codigo-web-ticket/candy']);
        // } else {
        //   this.router.navigate(['/codigo-web-ticket']);
        // }
        this.router.navigate(['/imprimir-tickets']);
      },
      error => {
        //cuando el servicio getCategoryPrices falla, simplemente se manda a imprimir sin mostrar ningún resumen.
        //por eso forzamos un mensaje de success en vez de un mensaje de error.
        if(error.message.includes("Cannot read properties of null (reading 'TicketTypes')"))
          this.alert.open("Tickets impresos, gracias por su compra");
        else
          this.alert.open(error);

        this.ticketForm.reset();
        this.tries += 1;
      }
    ).add(() => this.isSubmitting = false);
  }
}
