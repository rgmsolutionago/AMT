import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieLogic } from '../../services/movie-logic.service';
import { PendingOrder, Product } from '../../models/pending-order.model';
import { CustomErrorComponent } from '../../components/custom-error/custom-error.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { formatDate } from '@angular/common';
import { CacheService } from '../../services/cache.service';
import { Observable } from 'rxjs';
import { PrintingService } from '../../services/printing.service';
import { TicketResponse } from '../../models/ticket-response.model';
import { LogService } from '../../services/log.service';

@Component({
  selector: 'app-sell-ticket',
  templateUrl: './sell-ticket.component.html'
})
export class SellTicketComponent implements OnInit {
  @ViewChild('errorPopup')
  errorPopup: CustomErrorComponent;

  order: PendingOrder;

  theatreID: number;
  workstationId: number;
  user: string;
  customerCreditCardCSID: any;
  salesDate: Date;
  idSale: string;
  customerName: string;
  customerLastName: string;
  customerId: number;
  customerTelephone: string;
  customerEmail: string;
  pickupCode: string;

  payRemainingMinutes: string;
  showPaymentMethodContactless: boolean;
  showPaymentMethodMagnetic: boolean;
  showPaymentMethodChip: boolean;
  paymentTimeoutSeconds: number;
  paymentTimeoutRemainingSeconds: number;
  paymentTimeoutRemaining: string;

  onlyCandy: boolean;

  constructor(
    private logic: MovieLogic,
    private router: Router,
    private cache: CacheService,
    private printingService: PrintingService,
    private logService: LogService,
    private route: ActivatedRoute
  ) {
    this.theatreID = AppConfig.settings.theatreID;
    this.workstationId = AppConfig.settings.workstationId;
    this.showPaymentMethodChip = AppConfig.settings.showPaymentMethodChip;
    this.showPaymentMethodMagnetic = AppConfig.settings.showPaymentMethodMagnetic;
    this.showPaymentMethodContactless = AppConfig.settings.showPaymentMethodContactless;
    this.paymentTimeoutSeconds = AppConfig.settings.paymentTimeoutSeconds;
    route.params.subscribe((params) => {
      this.onlyCandy = params.onlyCandy == 'candy';
    });
  }


  ngOnInit() {
    this.loadData().then(() => {
      //una vez finalizado load data procedemos a ejecutar el resto de los function
      this.sell();
      this.updatePaymentTimeoutRemaining();
      setInterval(() => {
        if (this.paymentTimeoutSeconds > 0) {
          this.paymentTimeoutSeconds--;
        }
  
        this.updatePaymentTimeoutRemaining();
      }, 1000); // Update timer every 1 second.

    }).catch(error => {
      console.log(error);
    });
  }

  updatePaymentTimeoutRemaining() {
    this.paymentTimeoutRemaining = this.convertToMinutesAndSeconds(this.paymentTimeoutSeconds);
  }

  loadData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.customerName = AppConfig.settings.finalCustomer.name;
      this.customerLastName = AppConfig.settings.finalCustomer.lastName;
      this.customerId = AppConfig.settings.finalCustomer.ID;
      this.customerTelephone = AppConfig.settings.finalCustomer.telephone;
      this.customerEmail = AppConfig.settings.finalCustomer.email;
  
      this.order = this.logic.getOrder();
      this.salesDate = this.loadSalesDate();
      this.idSale = this.getNewIdSale();
      this.pickupCode = this.getNewWorkstationPickupCode();
      this.user = this.logic.getWorkstationUser();
  
      if(!this.user){      
        this.cache.loadUser().then(userId => {
          this.user = userId;
          resolve();
        }).catch(error => {
          console.error('Hubo un error al obtener el usuario:', error);
          reject(error);
        });
      } else {
        resolve();
      }
    });
  }

  handlePrintDocuments(res: any) {

      let printSuccess = true;

      if (res && res.PrintStringReceiptConcessions) {
        this.printingService.printDocuments(res.PrintStringReceiptConcessions).
        then(() => {printSuccess = true;})
        .catch((err) => {
          printSuccess = false;
          console.error(err);
          this.logService.saveLog("handlePrintDocuments", "SellTicketComponent", err);
        });
      }
      
      if (res && res.PrintStringTicket) {
        this.printingService.printDocuments(res.PrintStringTicket).
        then(() => {printSuccess = true;})
        .catch((err) => {
          printSuccess = false;
          console.error(err);
          this.logService.saveLog("handlePrintDocuments", "SellTicketComponent", err);
        });
      }

      if (res && res.PrintStringConcessions) {
        this.printingService.printDocuments(res.PrintStringConcessions).
        then(() => {printSuccess = true;})
        .catch((err) => {
          printSuccess = false;
          console.error(err);
          this.logService.saveLog("handlePrintDocuments", "SellTicketComponent", err);
        });
      }

      if(printSuccess){
        this.logic.confirmPrintedTickets(this.customerId, this.pickupCode).subscribe();
        this.forcePrintMessage();
      }
      else
        this.errorPrint();
  }

  sell() {
    var outerThis = this;
    var xmlSaleData = this.getXMLSale();
    console.log("Sell XML: " + xmlSaleData)
    this.logic.sell(xmlSaleData)
      .subscribe(res => {
        if (res.Error != null && res.Error.Message != null) {
          outerThis.error();
          console.warn('Sell error', res.Error.Message);
          return;
        }

        this.handlePrintDocuments(res);
      },
        error => {
          outerThis.error();
          console.warn('Sell', error);
        });
  }

  /**
   * Generate a new pickupCode with workstationId and lastPickupCode+1. 
   * lastPickupCode is a two digit number between 0 and 99.
   * The new pickupCode number is saved in cache.
   * @returns four digit string pickup code
   */
  getNewWorkstationPickupCode(): string {
    var lastPickupCode = this.cache.getLastPickupCode();
    var newPickupCode = lastPickupCode + 1;
    this.cache.updateLastPickupCode(newPickupCode);

    //Add 0 to complete 4 digit terminal and take only the last 2, because workstation id 
    //could be 1, 2 or 3 digits.
    var twoDigitsWorkstationIdString = this.workstationId.toString().padStart(4, "0").slice(-2);
    var twoDigitsPickupCodeString = newPickupCode.toString().padStart(2, "0")
    return `${twoDigitsWorkstationIdString}${twoDigitsPickupCodeString}`;
  }

  loadSalesDate(): Date {
    return this.logic.getSalesDate();
  }

  getXMLTickets() {
    if (this.order.categories == null || this.order.categories.length == 0 || this.onlyCandy) {
      return "";
    }

    var scheduleId = this.order.show.ScheduleId;
    var result = "";
    var seatCounter = 0;
    for (const category of this.order.categories) {
      for (let i = 1; i <= category.quantity; i++) {
        var seat = "0";
        if (this.order.selectedSeats && this.order.selectedSeats.length > 0) {
          seat = this.order.selectedSeats[seatCounter];
          seatCounter++;
        }

        var categoryId = category.ID;
        var zoneId = category.Zone;
        result += this.getXMLTicket(scheduleId, seat, categoryId, zoneId);
      }
    }

    return result;
  }

  // <TicketType><ID>1</ID> id de categoria
  getXMLTicket(scheduleId: string, seatNumber: string, categoryId: string, zoneId: string) {
    return `
            <Ticket>
                <ScheduleID>${scheduleId}</ScheduleID>
                <SeatNumber>${seatNumber}</SeatNumber>
                <TicketType>
                    <ID>${categoryId}</ID>
                    <Zone>${zoneId}</Zone>
                </TicketType>
            </Ticket>`;
  }

  getXMLConcessions() {
    if (!this.order.products || this.order.products.length == 0) {
      return "";
    }

    var result = "";
    for (const product of this.order.products) {
      result += this.getXMLConcession(product);
    }
    return result;
  }

  getXMLConcession(product: Product) {
    return `
          <Item>
              <ProductID>${product.CodProducto}</ProductID>
              <Quantity>${product.quantity}</Quantity>
          </Item>`;
  }

  //
  /**
   * Generates a new idSale
   * @returns Example: ATM_1_20221207231508."ATM_" + workstationId + "_" + date now formatted as yyyyMMddHHmmss
   */
  getNewIdSale(): string {
    var formattedDate = formatDate(Date.now(), 'yyyyMMddHHmmss', "en-US");
    return `ATM_${this.workstationId.toString()}_${formattedDate}`;
  }

  getXMLSale(): string {
    //DONE. user -> consulta por workstationId al metodo de trans GetWorkstationByID()
    //DONE. password -> probar mandar vacio, si da error verificar de donde se puede obtener
    //DONE. date -> sale de trans getSalesDate, revisar para traerlo hasta aca. Formato 22/05/2007
    //paymentMethod -> metodo de pago, puede ser efectivo o tarjeta. Ahora se va a usar solo tarjeta.
    //<PaymentMethod>1</PaymentMethod>Venta con Tarjeta de CREDITO
    //<PaymentMethod>2</PaymentMethod>Venta con Tarjeta de DEBITO
    //<PaymentMethod>3</PaymentMethod>Venta en Efectivo. En el caso de venta por efectivo el tag IsCreditCardAuthorized no puede venir en 1.
    //DONE. idsale -> numero con prefijo. Ejemplo: "ATM_" + workstationId + "_" + numero generado con fecha yyyyMMddHHmmss. ATM_1_20221207121508
    //Todos los datos del customer van en el archivo de config.
    //DONE. Customer.Name -> pendiente consultar a javier si es para consumo final, en tal caso no se envia datos del cliente. Probar mandar usuario vacio
    //Customer.LastName -> pendiente consultar a javier si es para consumo final, en tal caso no se envia datos del cliente. Probar mandar usuario vacio
    //DONE. Customer.ID -> pendiente consultar a javier si es para consumo final, en tal caso no se envia datos del cliente. Probar mandar usuario vacio
    //DONE. Customer.Telephone -> pendiente consultar a javier si es para consumo final, en tal caso no se envia datos del cliente. Probar mandar usuario vacio
    //DONE. Customer.Email -> pendiente consultar a javier si es para consumo final, en tal caso no se envia datos del cliente. Probar mandar usuario vacio.
    //Customer.CreditCardCSID -> codigo de tarjeta que tiene asociada la categoria configurada en cinestar. Codigo que identifica la marca de la tarjeta de credito. availablePaymentMethods.code que sale de la config
    //DONE. Customer.CreditCardNumber - viaja vacio
    //DONE. Customer.ExpirationDate - viaja vacio
    //DONE. Customer.PIN -> viaja vacio
    //DONE. Customer.<Payments>1</Payments> -> fijo
    //DONE. Customer. <SecurityCode></SecurityCode> - vacio
    //DONE. Customer. <PickUpCode></PickUpCode> -> generar un numero de 4 digitos para retiro. Ejemplo: workstatioId + numero. El CI que pide en pantalla va a ser un usuario exclusivo para el atm.
    //DONE. <IsCreditCardAuthorized>0</IsCreditCardAuthorized> valor fijo, enviar 0
    //DONE. <AuthorizationCode>0</AuthorizationCode> valor fijo, enviar 0
    //DONE. <Track></Track> viaja vacio
    //DONE. <TaxID>${this.taxID}</TaxID> viaja vacio
    //DONE. <TaxName>${this.taxName}</TaxName> viaja vacio
    console.log("onlycandy", this.onlyCandy)
    return `<root>
              <SaleData>
                  <TheatreID>${this.theatreID}</TheatreID>
                  <Workstation>${this.workstationId}</Workstation>
                  <User>${this.user}</User>
                  <Password></Password>
                  <Date>${this.logic.toShortDate(this.salesDate)}</Date>
                  <PaymentMethod>${this.order.paymentMethod}</PaymentMethod>
                  <Amount>${this.order.total}</Amount>
                  <IdSale>${this.idSale}</IdSale>
                  <Customer>
                      <Name>${this.customerName}</Name>
                      <LastName>${this.customerLastName}</LastName>
                      <ID>${this.customerId}</ID>
                      <Telephone>${this.customerTelephone}</Telephone>
                      <Email>${this.customerEmail}</Email>
                      <CreditCardCSID>${this.order.creditCardCSID}</CreditCardCSID>
                      <CreditCardNumber/>
                      <ExpirationDate/>
                      <PIN/>
                      <Payments>1</Payments>
                      <SecurityCode/>
                      <PickUpCode>${this.pickupCode}</PickUpCode>
                      <IsCreditCardAuthorized>0</IsCreditCardAuthorized>
                      <AuthorizationCode>0</AuthorizationCode>
                      <Track></Track>
					            <TaxID>${this.order.clientDocument !== undefined ? this.order.clientDocument : ''}</TaxID>
                      <TaxName>${this.order.clientName !== undefined ? this.order.clientName : ''}</TaxName>
                  </Customer>
                  ${
                    this.onlyCandy ? "<Tickets></Tickets>" : `<Tickets>${this.getXMLTickets()}</Tickets>`
                  }
                  <Concessions>${this.getXMLConcessions()}</Concessions>
              </SaleData>
          </root>`;
  }

  error() {
    const errorMessage = "Ha ocurrido un error al confirmar su ticket, intente nuevamente o solicite ayuda al personal.";
    this.errorPopup.open(errorMessage);
  }

  errorPrint() {
    const errorMessage = "Ha ocurrido un error al imprimir su ticket, intente nuevamente o solicite ayuda al personal.";
    this.errorPopup.open(errorMessage);
  }

  forcePrintMessage(){
    const errorMessage = "Tickets impresos, gracias por su compra.";
    this.errorPopup.open(errorMessage);
  }

  customError(error: string) {
    this.errorPopup.open(error);
  }

  productPrice(product: Product) {
    return product && (+product.ImpPreciosXProducto * product.quantity) || '';
  }

  convertToMinutesAndSeconds(totalSeconds: number): string {
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = totalSeconds % 60;

    const formattedMinutes: string = minutes.toString().padStart(2, '0');
    const formattedSeconds: string = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
