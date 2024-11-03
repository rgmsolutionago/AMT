import { Injectable } from '@angular/core';
import { NgxSoapService } from 'ngx-soap';
import { CinestarSoapService } from './cinestar-soap.service';
import { Observable, concat } from 'rxjs';
import { DateHelper } from '../utils/date.helper';
import { ShowResponse } from '../models/show-response.model';
import { MovieResponse } from '../models/movie-response.model';
import { catchError } from 'rxjs/operators';

@Injectable()
export class InformationService extends CinestarSoapService {
  onInit: Promise<void>;

  constructor(private soap: NgxSoapService) {
    super(soap);
    this.onInit = this.initInfo();
  }

  /* Devuelve las funciones para la fecha a consultar en el grupo de complejos,
  ordenado por película, complejo, número de performance y horario. */
  getShows(date: string): Observable<ShowResponse> {
    return this.getOne<ShowResponse>(this.infoClient, 'ShowTimeByDate', {
      TheatreGroupId: this.theatreGroupID,
      FilterId: this.atmFilter,
      SDate: date
    });
  }

  /* Devuelve todas las películas disponibles para un complejo. */
  getMovies(): Observable<MovieResponse> {
    return this.getOne<MovieResponse>(this.infoClient, 'Movies', {
      TheatreGroupId: this.theatreGroupID,
      FilterId: 'MWITHSCHEDULE' // this.atmFilter
    });
  }

  getProductss(): Observable<any> {
    return this.get(this.infoClient, 'GetProducts', {
      TheatreGroupId: this.theatreGroupID,
      FilterID: this.productsFilter
    });
  }

  /* Devuelve la cinesemana correspondiente a la película que se le pase por parámetro. */
  getWeeklyShowsFor(movieId: string) {
    return this.get(this.infoClient, 'WeeklyShowTimeByMovie', {
      TheatreGroupId: this.theatreGroupID,
      FeatureId: movieId,
      FilterId: ''
    });
  }

  /* Devuelve las funciones para una pelicula en una fecha determinada */
  getMovieShowsByDate(movieId: string, date: string = ''): Observable<any> {
    return this.get(this.infoClient, 'ShowTimeByDateAndMovie', {
      TheatreGroupId: this.theatreGroupID,
      SDate: date,
      FeatureId: movieId,
      FilterId: this.atmFilter
    });
  }

  /* Retorna la información detallada de la película para la cual se solicita la información. */
  getMovieDetail(movieId: string) {
    return this.get(this.infoClient, 'MovieDetail', {
      TheatreGroupId: this.theatreGroupID,
      FeatureId: movieId
    });
  }

  /* Este método retorna el afiche de la película que solicita en base64. */
  getPoster(movieId: string) {
    return this.getRaw(this.infoClient, 'GetPoster', {
      TheatreGroupId: this.theatreGroupID,
      FeatureID: movieId
    });
  }

  /* Devuelve la imagen de distribución de la sala en base64. */
  getLayoutImage() {
    return this.getRaw(this.infoClient, 'GetDistriImage', {
      TheatreGroupId: this.theatreGroupID,
      DistributionID: 1
    });
  }

  /* Este método retorna la imagen asociada a un producto de un complejo */
  getProductImage(productId: string): Observable<any> {
    return this.getRaw(this.infoClient, 'GetProductImage', {
      TheatreGroupId: this.theatreGroupID,
      ProductID: productId
    });
  }

  /* Retorna la cantidad máxima de entradas por persona y cuando no deja vender más entradas por este medio. */
  getAtmSettings(): Observable<any> {
    return this.get(this.infoClient, 'ATMSettings', {
      TheatreGroupId: this.theatreGroupID
    });
  }

  /* Retorna el conjunto de keylayouts que se encuentran disponibles para el complejo. */
  getKeyLayouts(): Observable<any> {
    return this.get(this.infoClient, 'GetKeyLayouts', {
      TheatreGroupId: this.theatreGroupID,
      WorkstationID: this.workstationId,
      FilterID: ''
    });
  }

  /* Retorna el conjunto de productos filtrando por keylayout id */
  getProductsByKeyLayout(keyLayoutId: string): Observable<any> {    
    return this.get(this.infoClient, 'GetProductsByKeyLayout', {
      TheatreGroupId: this.theatreGroupID,
      WorkstationId: this.workstationId,
      KeyLayoutId: keyLayoutId,
      FilterID: ''
    });
  }


  getProducts(): Observable<any> {
    return this.get(this.infoClient, 'GetProducts', {
      TheatreGroupId: this.theatreGroupID,
      FilterID: this.productsFilter
    });
  }
}
