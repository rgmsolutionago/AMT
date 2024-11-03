import { Injectable } from '@angular/core';
import { InformationService } from './information.service';
import { TransactionService } from './transaction.service';
import { CacheService } from './cache.service';
import { ErrorLogService } from './error-log.service';
import * as _ from 'lodash';
import { DateHelper } from '../utils/date.helper';
import { TicketResponse } from '../models/ticket-response.model';
import { Observable, forkJoin, from, of, throwError } from 'rxjs';
import { map, flatMap, filter, switchMap, mergeMap, concatMap, mergeAll, tap } from 'rxjs/operators';
import { flatten } from '@angular/core/src/render3/util';
import { Feature } from '../models/movie-response.model';
import { forceToArray } from '../utils/force-to-array.function';
import { TicketSummary } from '../models/ticket-summary.model';
import { Show } from '../models/show-response.model';
import { PricesResponse } from '../models/prices-response.model';
import { SellResponse } from '../models/sell-response.model';
import { WorkstationResponse } from '../models/workstation-response.model';
import { PrintingService } from './printing.service';
import { AppConfig } from '../app.config';
import { KeyLayoutItem } from '../models/key-layout-item.model';
import { MsgService } from './msg.service';

@Injectable({ providedIn: 'root' })
export class MovieLogic {
  onInit: Promise<void>;

  constructor(
    private info: InformationService,
    private trans: TransactionService,
    private cache: CacheService,
    private logger: ErrorLogService,
    private printingService: PrintingService,
    private _msgService: MsgService
  ) {
    this.onInit = new Promise((resolve, reject) => {
      Promise.all([info.onInit, trans.onInit]).then(() => {
        resolve();
      });
    });
  }

  // #Show selection
  movieSelectionData(id): any {
    const data: any = {};

    data.selectedMovie = this.getMovieData(id);
    data.movieShows = this.cache.getValidShowsBy(id);
    data.nextShow = data.selectedMovie.StartTime;

    return data;
  }

  getMovieShows(movieId: string): Observable<any> {
    return this.info.getMovieShowsByDate(movieId).pipe(map(show => this.parseMovieShowsAndGetValid(show)));
  }

  public parseMovieShowsAndGetValid(result: { Show: any[] }): _.Dictionary<any> {
    var shows = [];
    if (!result) {
      return shows;
    }

    if (Array.isArray(result.Show)) {
      shows = result.Show; //.filter(show => +show.Seats >= +this.getWorkstationToleranceShowtime());
    } else {
      shows = [result.Show];
    }
    return _.groupBy(shows, 'ScheduleDate');
  }

  getWeeklyFunctions(movieId: string): Observable<any> {
    return this.info.getWeeklyShowsFor(movieId).pipe(map(this.parseWeeklyShows));
  }

  getKeyLayouts(): Observable<KeyLayoutItem[]> {
    return this.info.getKeyLayouts().pipe(
      map((response: any) => {

        if (response && response.KeyLayout) {

          let layouts = [];
          if (!Array.isArray(response.KeyLayout)) {
            layouts.push(response.KeyLayout);
          } else {
            layouts = response.KeyLayout;
          }

          return layouts.map((layout: any) =>
          ({
            Id: layout.CodKeyLayout,
            Image: `data:image/gif;base64,${layout.Imagen}`
          }));
        } else {
          return [];
        }
      })
    );
  }

  getKeyLayoutsFirstId(): Observable<string | undefined> {
    return this.info.getKeyLayouts().pipe(
      map((response: any) => {
        if (response && response.KeyLayout && response.KeyLayout.length > 0) {
          return response.KeyLayout[0].CodKeyLayout;
        } else {
          return undefined;
        }
      })
    );
  }

  public parseWeeklyShows(result: any): any {
    return _.groupBy(result.Show, 'WeekDays');
  }

  public dateToIsoString(date: Date): string {
    let strDate = date.toISOString();
    strDate = strDate
      .slice(0, strDate.indexOf('T'))
      .split('-')
      .join('');

    return strDate;
  }

  // Movie purchase flow
  getPendingTickets(pID: number, pickupCode: string): Observable<TicketResponse> {
    return this.trans.getPendingTickets(pID, pickupCode);
  }

  // Movie purchase flow
  confirmPrintedTickets(pID: number, pickupCode: string): Observable<TicketResponse> {
    return this.trans.confirmPrintedTickets(pID, pickupCode);
  }

  // #Ticket Withdraw
  validateCode(ci: number, code: string): Observable<any> {
    console.log('Comenzando llamada al servicio getPendingTickets... ci: ' + ci + 'code: ' + code);
    return this.trans.getPendingTickets(ci, code).pipe(
      tap(ticketResponse => {
        console.log('Respuesta recibida del servicio getPendingTickets:', ticketResponse);
      }),
      flatMap(ticketResponse => {
        this.parseCodeValidation(ticketResponse);

        if (ticketResponse.Ticket) {

          const pricesObs = forceToArray(ticketResponse.Ticket)
            .map(ticketResponseTicket => this.trans.getCategoryPrices(ticketResponseTicket.ScheduleID).pipe(
              map(pricesResp => {

                if (!pricesResp || !pricesResp.TicketTypes) {
                  this.forcePrint(ticketResponse, ci, code);
                  //si entra acá es porque fallo el ws getCategoryPrices y hay que forzar la impresion,
                  //sin mostrar resumen en pantalla.
                }

                pricesResp.TicketTypes.TicketType = forceToArray(pricesResp.TicketTypes.TicketType)
                  .filter(w => w.Price == ticketResponseTicket.Amount)
                  .map(y => ({ ...y, ScheduleID: ticketResponseTicket.ScheduleID }));
                return pricesResp;
              }),
            ));

          const mergedPricesObs = forkJoin(pricesObs);

          const showsObs = forceToArray(ticketResponse.Ticket).map(z => this.info.getShows(z.ShowTimeDate).pipe(
            map(showResp => {
              showResp.Show = forceToArray(showResp.Show).filter(w => w.ScheduleId == z.ScheduleID);
              return showResp;
            }),
          ));

          const mergedShowsObs = forkJoin(showsObs).pipe(mergeAll());

          return forkJoin(mergedShowsObs, mergedPricesObs)
            .pipe(
              map(showsAndPrices => {

                const shows = showsAndPrices[0];
                const prices = showsAndPrices[1]; //array

                const ticketArray = forceToArray(ticketResponse.Ticket);

                for (let i = 0; i < ticketArray.length; i++) {
                  const t = ticketArray[i];
                  let matchingPrice = null;

                  for (let j = 0; j < prices.length; j++) {
                    const x = prices[j];
                    if (t.ScheduleID === x.TicketTypes.TicketType[0].ScheduleID && x.TicketTypes.TicketType[0].Price === t.Amount) {
                      matchingPrice = x.TicketTypes.TicketType[0];
                      break;
                    }
                  }

                  if (matchingPrice) {
                    t.TicketType = matchingPrice;
                  }
                }

                return ({ ticketResponse, shows: forceToArray(shows.Show) }) as TicketSummary;
              })
            );
        }
        else {

          const summary = {
            ticketResponse: ticketResponse,
            shows: null,
            pID: ci,
            pPickUpCode: code
          } as TicketSummary;
          this.cache.saveTicketSummary(summary);

          return new Observable<any>(observer => {
            observer.next({ ticketResponse, shows: null });
            observer.complete();
          });

        }
      }),
      flatMap(ticketSummary => {
        return this.info.getMovies()
          .pipe(
            map(movies => {
              let showsWithFeature = [];
              if (ticketSummary.shows != null) {
                showsWithFeature = ticketSummary.shows
                  .map(show => {
                    return { ...show, Feature: forceToArray(movies.Feature).find(m => m.FeatureId === show.FeatureId) } as Show;
                  });
              }
              const summary = {
                ticketResponse: ticketSummary.ticketResponse,
                shows: showsWithFeature,
                pID: ci,
                pPickUpCode: code
              } as TicketSummary;
              this.cache.saveTicketSummary(summary);
              return summary;
            })
          );
      }),
    );
  }

  onlyPrint(ci: number, code: string): Observable<any> {
    console.log('Comenzando llamada al servicio getPendingTickets... ci: ' + ci + ', code: ' + code);

    return this.trans.getPendingTickets(ci, code).pipe(
      tap(ticketResponse => {
        console.log('Respuesta recibida del servicio getPendingTickets:', ticketResponse);
      }),
      map(ticketResponse => {
        this.parseCodeValidation(ticketResponse);

        const summary: TicketSummary = {
          ticketResponse: ticketResponse,
          shows: null,
          pID: ci,
          pPickUpCode: code
        };
        this.cache.saveTicketSummary(summary);

        return { ticketResponse, shows: null };
      })
    );
  }


  async forcePrint(ticketResponse: TicketResponse, ci: number, code: string) {

    //este método se llama solo si falla el servicio de getPrices.
    //la idea es mandar a imprimir sin mostrar detalles en pantall
    this.cache.setFlagForcePrint();
    var printResult = await this.printingService.printTickets(ticketResponse);
    if (!printResult) {
      return throwError(new Error('Ha ocurrido un error al imprimir su ticket, solicite ayuda al personal'));
    }

    this.confirmPrintedTickets(ci, code);

  }



  getTicketSummary(): TicketSummary {
    return this.cache.getTicketSummary();
  }

  getWebCodeTicket(): TicketResponse {
    return this.cache.getWebCodeTickets();
  }

  public parseCodeValidation(result: TicketResponse): string {
    let response: string = null;

    if (result.Error !== undefined) {
      let message: string;
      message = result.Error.Message;

      if (message.indexOf('#CS#20001') !== -1) {
        response = 'El código ingresado no tiene entradas para retirar';
      } else {
        response = 'Ocurrió un error al procesar la solicitud';
        this.logger.logError(result.Error);
      }

      throw new Error(response);
    } else {
      this.cache.saveWebCodeTicket(result);
    }

    return response;
  }

  // #Order
  saveOrder(order) {

    if (order.selectedMovie && order.selectedMovie.feature) {

      order.selectedMovie.feature.forEach(function (value) {
        if (value.poster) {
          const sizeInBytes = 4 * Math.ceil((value.poster.length / 3)) * 0.5624896334383812;
          const sizeInMB = sizeInBytes / 1024 / 1024;

          if (sizeInMB > 1) {
            value.poster = AppConfig.settings.defaultMoviePoster;
          }
        }
      });
    }

    this.cache.saveOrder(order);
  }


  getOrder(): any {
    return this.cache.getOrder();
  }

  cleanOrder() {
    this.unblockAllSeats();
    this.cache.cleanOrder();
  }

  cleanLastWebCodeTicket() {
    this.cache.cleanLastWebCodeTicket();
  }

  saveOrderShowChanged(order) {
    order.total = 0;
    order.products = [];
    order.categories = [];
    order.selectedSeats = [];
    this.saveOrder(order);
  }

  // #Categories
  getCategoryPrices(scheduleId: string): Observable<PricesResponse> {
    return this.trans.getCategoryPrices(scheduleId);
  }

  // #Seats
  getSeatDistribution(scheduleId: string): Observable<any> {
    const sessionId = this.cache.getSessionId();
    return this.trans.getSeats(scheduleId, sessionId);
  }

  blockSeat(scheduleId: string, seatId: string): Observable<any> {
    const sessionId = this.cache.getSessionId();
    return this.trans.blockSeat(scheduleId, seatId, sessionId);
  }

  unblockAllSeats() {
    const order = this.getOrder();
    const sessionId = this.cache.getSessionId();

    if (order === undefined || order === null) {
      this.trans.unblockAllSeats(sessionId);
      return;
    }

    if (order.show === undefined || order.show === null) {
      this.trans.unblockAllSeats(sessionId);
      return;
    }

    const scheduleId = order.show.ScheduleId;
    const selected = order.selectedSeats;
    const seatPromises = [];

    if (selected !== undefined && selected !== null) {
      selected.forEach((s: string) => {
        seatPromises.push(this.trans.unblockSeat(s, sessionId, scheduleId));
      });

      forkJoin(seatPromises).subscribe(responses => {
        let result = true;

        responses.forEach(r => {
          if (r.Error) {
            result = false;
            return;
          } else {
            result = r.Response === 'True';
          }
        });

        if (!result) {
          this.trans.unblockAllSeats(sessionId);
        }
      });
    }
  }

  sell(xmlSaleData: string): Observable<SellResponse> {
    return this.trans.sell(xmlSaleData);
  }

  getWorkstationByID(): Observable<WorkstationResponse> {
    return this.trans.getWorkstationByID();
  }

  // #Movies
  getMovies() {
    return this.cache.functions;
  }
  // #Movies
  getCountMovies() {
    return this.cache.functions.length;
  }
  // #Products
  getProducts(keyLayoutId) {
    let products = this.cache.getProducts(keyLayoutId);


    if (!products || products.length == 0) {
      this.cache.loadProducts(keyLayoutId);
    }

    this._msgService.emitSetProducts(products);
    return products;
  }

  getWorkstationToleranceShowtime() {
    return this.cache.workstationToleranceShowtime;
  }

  getWorkstationUser() {
    return this.cache.workstationUser;
  }

  getMovieData(movieId: string) {
    return this.cache.getValidMovie(movieId);
  }

  getShowDataFor(showId: string) {
    return this.cache.getShowsBy(showId);
  }

  getSalesDate(): Date {
    return this.parseIsoDate(this.cache.getSalesDate());
  }

  getRawSalesDate(): string {
    return this.cache.getSalesDate();
  }

  getSalesDateWeekDay(): string {
    return this.toHumanDateWeekDay(this.getSalesDate());
  }

  toHumanDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  toHumanDateWithDayAndMonth(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  toHumanDateWeekDay(date: Date): string {
    return date.toLocaleString('es-ES', { weekday: 'short' }).replace('.', '');
  }

  parseIsoDate(strIsoDate: string): Date {
    return DateHelper.parseIsoToDate(strIsoDate);
  }

  toShortDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

}
