import { Injectable } from '@angular/core';
import { InformationService } from './information.service';
import { TransactionService } from './transaction.service';
import * as _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import { AppConfig } from '../app.config';
import { TicketResponse } from '../models/ticket-response.model';
import { forceToArray } from '../utils/force-to-array.function';
import { TicketSummary } from '../models/ticket-summary.model';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { MsgService } from './msg.service';


@Injectable({ providedIn: "root" })
export class CacheService {
  lastCacheUpdate: Date;
  functions = [];

  constructor(private info: InformationService, private trans: TransactionService, private _msgService: MsgService) {
    this.loadCache();

    Promise.all([info.onInit, trans.onInit]).then(() => {
      if (this.functions.length === 0) {
        this.createCache();
      } else {
        this.updateData();
      }
    });
  }

  public tryReloadCache() {
    console.log("cacheService.tryReloadCache()");
    const now = new Date();
    const lastCacheUpdate = this.getLastCacheUpdate();
    const differenceInMinutes = Math.floor((now.getTime() - lastCacheUpdate.getTime()) / 60000);
    if (differenceInMinutes > AppConfig.settings.reloadCacheAfterMinutes) {
      this.forceReloadCache();
    }
  }

  forceReloadCache() {
    console.log("cacheService.forceReloadCache()");
    this.invalidateCache();
    this.createCache();
  }

  setLastCacheUpdate() {
    var nowString = new Date().toISOString();
    console.log("cacheService.lastCacheUpdate: " + nowString)
    localStorage.setItem('lastCacheUpdate', nowString);
  }

  getLastCacheUpdate(): Date {
    var lastCacheUpdateString = localStorage.getItem('lastCacheUpdate');
    return new Date(lastCacheUpdateString);
  }

  invalidateCache() {
    localStorage.setItem('functions', null); 24e4
    this.functions = [];
  }

  createCache() {
    this.getShowsAndMovies();
  }

  loadCache() {
    const strFunctions = localStorage.getItem('functions');
    if (
      strFunctions !== null &&
      strFunctions !== 'null' &&
      strFunctions !== undefined &&
      strFunctions !== 'undefined' &&
      strFunctions !== ''
    ) {
      this.functions = JSON.parse(strFunctions);
    }
  }

  loadProducts(keyLayoutId) {
      this.info.getProductsByKeyLayout(keyLayoutId).subscribe(response => {
      if(!response)
        return;

      let cacheProductName = 'products' + keyLayoutId;
      let responseProducts = [];
      if (!this.isNullOrUndefined(response.Products) && !Array.isArray(response.Products)) {
        responseProducts.push(response.Products);
      } else {
        responseProducts = responseProducts.concat(response.Products);
      }

      console.log(responseProducts);
      
      localStorage.setItem(cacheProductName, JSON.stringify(responseProducts));

      responseProducts.forEach(product => {
        this.info.getProductImage(product.CodProducto).subscribe(productImageResponse => {
          let products = JSON.parse(localStorage.getItem(cacheProductName));
          
          const currentProduct = products.find(p => p.CodProducto === product.CodProducto);
          if(!currentProduct) {
            console.log(`cache-service.loadProducts. Empty currentProduct. CodProducto: ${product.CodProducto}`);
            return;
          }

          if (productImageResponse.result && 
            productImageResponse.result.GetProductImageResult.root.Products.Imagen !== null) {
            currentProduct.image = `data:image/jpg;base64,${productImageResponse.result.GetProductImageResult.root.Products.Imagen}`;
          } else {
            currentProduct.image = AppConfig.settings.defaultProductImage;
          }
          localStorage.setItem(cacheProductName, JSON.stringify(products));
          this._msgService.emitSetProducts(products);
        });
      });
    });
  }
  
  getProducts(keyLayoutId) {
    let cacheProductName = 'products' + keyLayoutId;
    var products = JSON.parse(localStorage.getItem(cacheProductName));
    return products;
  }

  getShowsAndMovies() {

    forkJoin(
      this.trans.getTheatreSalesDate(),
      this.info.getMovies()
    ).subscribe(response => {
      // Sales date save
      const salesDate = response[0];
      this.saveSalesDate(salesDate);

      // Movies information
      const movies = response[1];
      if (!movies) {
        console.warn("Movies is empty");
        return;
      }
      const features = movies.Feature;
      this.functions = forceToArray(features); // shows;
      localStorage.setItem('functions', JSON.stringify(this.functions));
      this.updateData();

      // let firstKeylayoutId = 4;
      // this.loadProducts(firstKeylayoutId);

      this.setLastCacheUpdate();
    });

  }

  loadSessionId() {
    this.trans.getSessionId().subscribe(sessionId => {
      localStorage.setItem('sessionId', sessionId.toString());
    });
  }

  getSessionId(): string {
    return localStorage.getItem('sessionId');
  }

  updateLastPickupCode(newPickupCode: number) {
    localStorage.setItem('lastPickupCode', newPickupCode.toString());
  }

  getLastPickupCode(): number {
    const MAX_PICKUP_CODE_NUMBER = 99;
    var lastPickupCodeString = localStorage.getItem('lastPickupCode');
    if (lastPickupCodeString == "") {
      return 0;
    }

    if (Number(lastPickupCodeString) >= MAX_PICKUP_CODE_NUMBER) {
      return 0; //Reset pickup code.
    }

    return Number(lastPickupCodeString);
  }

  loadWorkstationSettings() {
    this.trans.getWorkstationByID().subscribe(res => {
      localStorage.setItem('workstation_user', res.Workstation.User);
      localStorage.setItem('workstation_tolerance_showtime', res.Workstation.ToleranceShowtime);
    });
  }

  loadUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.trans.getWorkstationByID().subscribe(res => {
        localStorage.setItem('workstation_user', res.Workstation.User);
        localStorage.setItem('workstation_tolerance_showtime', res.Workstation.ToleranceShowtime);
  
        resolve(res.Workstation.User);
      }, error => {
        reject(error);
      });
    });
  }
  

  get workstationUser(): string {
    return localStorage.getItem('workstation_user');
  }

  get workstationToleranceShowtime(): string {
    return localStorage.getItem('workstation_tolerance_showtime');
  }

  updateData() {
    // Allways load a new session
    this.loadSessionId();

    // Load settings
    this.loadWorkstationSettings();

    /*this.info.getLayoutImage().subscribe(response => {
      console.log('image ', response);
    });*/

    // Loads default image for fast visualization
    this.functions.forEach(show => {
      show.poster = AppConfig.settings.defaultMoviePoster;
    });

    // Loads corresponding image if there is any, and overrides the default one
    this.functions.map(show => {
      this.getPoster(show);
    });
  }

  getPoster(show) {
    this.info.getPoster(show.FeatureId).subscribe(response => {
      if (response.result) {
        show.poster = `data:image/jpg;base64,${response.result.GetPosterResult}`;
      }
    });
  }

  getValidMovie(movieId) {
    return this.functions.find(f => f.FeatureId === movieId && +f.Seats >= +this.workstationToleranceShowtime);
  }

  getShowsBy(movieId) {
    return this.functions.filter(f => f.FeatureId === movieId);
  }

  getValidShowsBy(movieId) {
    return this.functions.filter(f => f.FeatureId === movieId && +f.Seats >= +this.workstationToleranceShowtime);
  }

  saveOrder(order) {
    localStorage.setItem('pendingOrder', JSON.stringify(order));
  }

  getOrder(): string {
    return JSON.parse(localStorage.getItem('pendingOrder'));
  }

  cleanOrder() {
    localStorage.removeItem('pendingOrder');
  }

  cleanLastWebCodeTicket() {
    localStorage.removeItem('webCodeTickets');
    localStorage.removeItem('ticketSummary');
  }

  saveSalesDate(salesDate) {
    localStorage.setItem('salesDate', salesDate);
  }

  getSalesDate(): string {
    return localStorage.getItem('salesDate');
  }

  saveWebCodeTicket(ticket: TicketResponse) {
    localStorage.setItem('webCodeTickets', JSON.stringify(ticket));
  }

  getWebCodeTickets(): TicketResponse {
    return JSON.parse(localStorage.getItem('webCodeTickets'));
  }

  saveTicketSummary(shows: TicketSummary) {
    localStorage.setItem('ticketSummary', JSON.stringify(shows));
  }

  getTicketSummary(): TicketSummary {
    return JSON.parse(localStorage.getItem('ticketSummary'));
  }

  setFlagForcePrint(){
    localStorage.setItem('forcePrint', JSON.stringify(1));
  }

  isFlagForcePrint(){
    var flagForcePrint = localStorage.getItem('forcePrint');
    return flagForcePrint !== null;
  }

  removeFlagForcePrint(){
    localStorage.removeItem('forcePrint');
  }

  save(key: string, item: string) {
    localStorage.setItem(key, item);
  }

  load(key: string): string {
    return localStorage.getItem(key);
  }

  isNullOrUndefined(obj: any): boolean {
    return obj === null || obj === undefined;
  }


  saveKeyLayoutsExists(value: boolean) {
    return localStorage.setItem('keyLayoutsExists', value ? "true" : "false");
  }

  getKeyLayoutsExists(): string {
    return localStorage.getItem('keyLayoutsExists',);
  }

}
