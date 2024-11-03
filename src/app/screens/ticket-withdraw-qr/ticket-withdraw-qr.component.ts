import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MovieLogic } from '../../services/movie-logic.service';
import { AppConfig } from '../../app.config';
import { HostListener } from '@angular/core';
import { PopupComponent } from '../../components/popup/popup.component';

@Component({
  selector: 'app-ticket-withdraw-qr',
  templateUrl: './ticket-withdraw-qr.component.html'
})
export class TicketWithdrawQRComponent implements OnInit {
  @ViewChild('errorPopup')
  errorPopup: PopupComponent;

  readonly WITHDRAW_TICKET_CODE_LENGTH: number = AppConfig.settings.withdraw.ticketCodeLength;

  lastFocusedControl: string;
  tries: number;
  detectedText: string;
  clientCI: number;
  withdrawTicketCode: string;
  errorPopupMessage: string;
  codeHasBeenDetected: boolean;
  keyboardTimeoutId: number;

  constructor(private router: Router, private logic: MovieLogic) { }

  ngOnInit() {
    this.tries = 1;
    this.detectedText = "";
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.codeHasBeenDetected) {
      return;
    }

    window.clearTimeout(this.keyboardTimeoutId);     
    this.startDetectionFinishedTimer();

    this.detectedText = this.detectedText + event.key;
    console.log(`ticket-withdraw-qr.handleKeyboardEvent. Detected text: ${this.detectedText}.`);
  }

  private loadWithdrawTicketCode() {
    let withdrawTicketCodeText = this.detectedText
      .substring(0, this.WITHDRAW_TICKET_CODE_LENGTH);
    this.withdrawTicketCode = withdrawTicketCodeText;
  }

  private loadClientId() {
    let clientCIText = this.detectedText.substring(this.WITHDRAW_TICKET_CODE_LENGTH, this.detectedText.length);
    let numericClientCIText = clientCIText.replace(/\D/g, "");
    this.clientCI = Number(numericClientCIText);
  }

  onSave() {
    if (this.tries >= AppConfig.settings.withdraw.maxTries) {
      this.router.navigate(['/seleccion']);
    }

    console.log(`ticket-withdraw-qr.onSave. Validating code. ClientId: ${this.clientCI}. TicketCode: ${this.withdrawTicketCode}.`);
    this.logic.onlyPrint(this.clientCI, this.withdrawTicketCode).subscribe(
      () => {
        //this.router.navigate(['/codigo-web-ticket']);
        this.router.navigate(['/imprimir-tickets']);
      },
      error => {
        //cuando el servicio getCategoryPrices falla, simplemente se manda a imprimir sin mostrar ningún resumen.
        //por eso forzamos un mensaje de success en vez de un mensaje de error.
        if(error.message.includes("Cannot read properties of null (reading 'TicketTypes')"))
          this.error("Tickets impresos, gracias por su compra");
        else
          this.error(error.status != 500 && error.message ? error.message : null)

        this.tries += 1;
        this.detectedText = "";
        this.codeHasBeenDetected = false;
      }
    );
  }

  error(errorMessage: string) {
    this.errorPopupMessage = errorMessage ? errorMessage : "Ha ocurrido un error al consultar sus tickets, reintente o solicite ayuda al personal.";
    this.errorPopup.setOpen(true);
  }

  startDetectionFinishedTimer() {
    this.keyboardTimeoutId = window.setTimeout(() => this.processDetectedText(), 1500);
  }

  processDetectedText() {
    this.codeHasBeenDetected = true;

    this.loadWithdrawTicketCode();
    this.loadClientId();

    this.onSave();
  }
}

