import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { StartComponent } from './screens/start/start.component';
import { MovieSelectionComponent } from './screens/movie-selection/movie-selection.component';
import { MovieShowSelectionComponent } from './screens/movie-show-selection/movie-show-selection.component';
import { MovieCategorySelectionComponent } from './screens/movie-category-selection/movie-category-selection.component';
import { MovieSeatSelectionComponent } from './screens/movie-seat-selection/movie-seat-selection.component';
import { ProductSelectionComponent } from './screens/product-selection/product-selection.component';
import { PaymentSelectionComponent } from './screens/payment-selection/payment-selection.component';
import { PrintTicketComponent } from './screens/print-ticket/print-ticket.component';
import { SellTicketComponent } from './screens/sell-ticket/sell-ticket.component';
import { CleanCacheComponent } from './screens/clean-cache/clean-cache.component';
import { TermsScreenComponent } from './components/terms-screen/terms-screen.component';
import { HeaderComponent } from './components/header/header.component';
import { PopupComponent } from './components/popup/popup.component';
import { TimerComponent } from './components/timer/timer.component';
import { OptionSelectionComponent } from './screens/option-selection/option-selection.component';
import { TicketWithdrawModeSelectionComponent } from './screens/ticket-withdraw-mode-selection/ticket-withdraw-mode-selection.component';
import { TicketWithdrawComponent } from './screens/ticket-withdraw/ticket-withdraw.component';
import { TicketWithdrawQRComponent } from './screens/ticket-withdraw-qr/ticket-withdraw-qr.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NgxSoapModule } from 'ngx-soap';
import { CinestarSoapService } from './services/cinestar-soap.service';
import { CacheLoaderComponent } from './components/cache-loader/cache-loader.component';
import { BodyComponent } from './components/body/body.component';
import { ErrorComponent } from './error/error.component';
import { CustomErrorComponent } from './components/custom-error/custom-error.component';
import { ErrorLogService } from './services/error-log.service';
import { GlobalErrorHandlerService } from './services/global-error-handler.service';
import { TransactionService } from './services/transaction.service';
import { CacheService } from './services/cache.service';
import { InformationService } from './services/information.service';
import { MovieLogic } from './services/movie-logic.service';
import { AlertComponent } from './components/alert/alert.component';
import { NgIdleModule } from '@ng-idle/core';
import { SlickModule } from 'ngx-slick';
import { AppConfig } from './app.config';
import { SafePipe } from './pipes/safe.pipe';
import { WebCodeTicketComponent } from './screens/web-code-ticket/web-code-ticket.component';
import { ToHumanDatePipe } from './pipes/to-human-date.pipe';
import { TranslationService } from './services/translation.service';
import { TranslationPipe } from './translation.pipe';
import { ClientInvoiceInfoComponent } from './screens/client-invoice-info/client-invoice-info.component';
import { FormsModule } from '@angular/forms';
import { OnScreenKeyboardComponent } from './components/on-screen-keyboard/on-screen-keyboard.component';
import { WebPrintTicketComponent } from './screens/web-print-ticket/web-print-ticket.component';
import { KeylayoutComponent } from './components/keylayout/keylayout.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { LogService } from './services/log.service';

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  declarations: [
    AppComponent,
    StartComponent,
    MovieSelectionComponent,
    MovieShowSelectionComponent,
    MovieCategorySelectionComponent,
    MovieSeatSelectionComponent,
    ProductSelectionComponent,
    PaymentSelectionComponent,
    PrintTicketComponent,
    SellTicketComponent,
    WebCodeTicketComponent,
    TermsScreenComponent,
    HeaderComponent,
    OptionSelectionComponent,
    TicketWithdrawModeSelectionComponent,
    TicketWithdrawComponent,
    TicketWithdrawQRComponent,
    NavBarComponent,
    CacheLoaderComponent,
    BodyComponent,
    ErrorComponent,
    CustomErrorComponent,
    AlertComponent,
    CleanCacheComponent,
    PopupComponent,
    TimerComponent,
    SafePipe,
    ToHumanDatePipe,
    TranslationPipe,
    ClientInvoiceInfoComponent,
    OnScreenKeyboardComponent,
    WebPrintTicketComponent,
    KeylayoutComponent,
    ProductDetailsComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ReactiveFormsModule,
    NgxSoapModule,
    FormsModule,
    SlickModule.forRoot(),
    NgIdleModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: StartComponent, pathMatch: 'full' },
      { path: 'seleccion', component: OptionSelectionComponent },
      { path: 'seleccion-retiro', component: TicketWithdrawModeSelectionComponent },
      { path: 'retiro', component: TicketWithdrawComponent },
      { path: 'retiro-qr', component: TicketWithdrawQRComponent },
      { path: 'codigo-web-ticket', component: WebCodeTicketComponent },
      { path: 'imprimir-tickets', component: WebPrintTicketComponent },
      { path: 'codigo-web-ticket/:onlyCandy', component: WebCodeTicketComponent },
      { path: 'impresion', component: PrintTicketComponent },
      { path: 'venta/', component: SellTicketComponent },
      { path: 'venta/:onlyCandy', component: SellTicketComponent },
      { path: 'cartelera', component: MovieSelectionComponent },
      { path: 'funciones', component: MovieShowSelectionComponent },
      { path: 'categorias', component: MovieCategorySelectionComponent },
      { path: 'asientos', component: MovieSeatSelectionComponent },
      { path: 'productos/', component: ProductSelectionComponent },
      { path: 'productos/:onlyCandy', component: ProductSelectionComponent },
      { path: 'pago/', component: PaymentSelectionComponent },
      { path: 'pago/:onlyCandy', component: PaymentSelectionComponent },
      { path: 'clean-cache', component: CleanCacheComponent },
      { path: 'error', component: ErrorComponent },
      { path: 'custom-error', component: CustomErrorComponent },
      { path: 'client-invoice-info', component: ClientInvoiceInfoComponent },
      { path: 'client-invoice-info/:onlyCandy', component: ClientInvoiceInfoComponent },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ])
  ],
  providers: [
    CinestarSoapService,
    TransactionService,
    InformationService,
    CacheService,
    MovieLogic,
    ErrorLogService,
    LogService,
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
    TranslationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
