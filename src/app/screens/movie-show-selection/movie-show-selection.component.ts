import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { CustomErrorComponent } from '../../components/custom-error/custom-error.component';
import { Dictionary } from 'lodash';

/**
 * Allow to Select a Movie Function
 */
@Component({
  selector: 'app-movie-show-selection',
  templateUrl: './movie-show-selection.component.html'
})
export class MovieShowSelectionComponent implements OnInit {

  @ViewChild('errorPopup')
  errorPopup: CustomErrorComponent;

  selectedMovieTitle;
  selectedMovie;
  nextShow;
  selectedDate;
  order;
  orderBeforeChanges;
  activePopup;
  showHash = {};
  dayShows = [];
  weekDays = [];
  salesDate: string;
  movieTechnology: string;
  movieFeatures = [];
  featuresShows = [];
  selectedFeature;

  constructor(private logic: MovieLogic, private router: Router) { }

  ngOnInit() {
    this.getMovieData();
  }

  isSalesDate(date: string) {
    const salesDate = this.logic.getSalesDate();
    return salesDate === new Date(date);
  }

  showHasAvailableSeats(show) {
    return Number(show.Seats) > 0;
  }

  getMovieData() {
    this.orderBeforeChanges = this.logic.getOrder();
    this.order = this.logic.getOrder();
    this.selectedMovieTitle = this.order.selectedMovie.originalTitle;

    for (let index = 0; index < this.order.selectedMovie.feature.length; index++) {
      const feature = this.order.selectedMovie.feature[index];
      this.movieFeatures.push(feature);
    }

    if (this.movieFeatures.length > 0) {
      if (this.order.selectedFeature !== undefined) {
        this.selectFeature(this.order.selectedFeature, false);
      } else {
        this.selectFeature(this.movieFeatures[0], true);
      }
    }
  }

  addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60000);
  }

  getWeeklyFunctions() {
    let outerThis = this;

    this.logic.getMovieShows(this.order.selectedFeature.FeatureId).subscribe(shows => {
      console.log('shows', shows);
      if (outerThis.isObjectEmpty(shows)) {
        outerThis.removeCurrentFeature();
        return;
      }

      const salesDate = this.logic.getSalesDate();
      const minutesOfCurrentDay = (new Date().getHours() * 60) + new Date().getMinutes()
      const toleranceMinutes = this.logic.getWorkstationToleranceShowtime();
      const salesDateWithMinutes = this.addMinutes(salesDate, minutesOfCurrentDay);
      console.log(`movie-show-selection.getWeeklyFunctions. salesDateWithMinutes: : ${salesDateWithMinutes}`)
      console.log(`movie-show-selection.getWeeklyFunctions. toleranceMinutes: ${toleranceMinutes}`)

      outerThis.weekDays = [];
      for (const isoDate in shows) {
        if (shows.hasOwnProperty(isoDate)) {
          // Set parsed dates
          shows[isoDate].forEach(show => {
            show.date = this.logic.parseIsoDate(show.ScheduleDate);
            show.parsedDate = this.logic.toHumanDate(show.date);
          });

          // Filter by current hour
          shows[isoDate] = shows[isoDate].filter(show => {
            if(show.Status === 'CANC') {
              console.log(`movie-show-selection.getWeeklyFunctions. Show ignored CANC. FeatureId: ${show.FeatureId}. 
              ScheduleDate: ${show.ScheduleDate}. StartTime: ${show.StartTime}`);
              return false;
            }

            const time = show.StartTime.split(':');
            show.date.setHours(+time[0], +time[1]);

            const showTimeWithTolerance = this.addMinutes(show.date, Number(toleranceMinutes));
            var result = showTimeWithTolerance.getTime() > salesDateWithMinutes.getTime();
            if (!result) {
              console.log(`movie-show-selection.getWeeklyFunctions. Show ignored. FeatureId: ${show.FeatureId}. 
              ScheduleDate: ${show.ScheduleDate}. StartTime: ${show.StartTime}`);
            }
            return result;
          });

          if (shows[isoDate].length == 0) {
            continue;
          }

          // Create week days
          const date = this.logic.parseIsoDate(isoDate);
          const dayAndMonth = this.logic.toHumanDateWithDayAndMonth(date);
          outerThis.weekDays.push({ isoDate: isoDate, dayAndMonth: dayAndMonth });
        }
      }

      outerThis.showHash = shows;

      if (outerThis.weekDays.length == 0) {
        outerThis.removeCurrentFeature();
        return;
      }

      // Get next hour
      const rawSalesDate = this.logic.getRawSalesDate();
      const todayShows = outerThis.showHash[rawSalesDate];
      outerThis.nextShow = todayShows && todayShows.length > 0 ? todayShows[0].StartTime : '';

      //Select date if order has a date selected, otherwise select first day of shows
      if (outerThis.order.date !== undefined && outerThis.order.date !== null && outerThis.order.date !== '') {
        this.selectDay(outerThis.order.date);
      } else {
        const date = outerThis.weekDays[0].isoDate;
        this.selectDay(date);
        // If user change day, select first show of the day... if any
        if (outerThis.showHash[date] !== undefined && outerThis.showHash[date].length > 0) {
          this.selectShow(outerThis.showHash[date][0]);
        } else {
          this.selectShow(null);
        }
      }
    });
  }

  isObjectEmpty(obj: Dictionary<any>): boolean {
    return Object.keys(obj).length === 0;
  }

  selectFeature(feature: string, resetOrderDay: boolean) {
    if (resetOrderDay) {
      this.order.date = "";
    }

    this.order.selectedFeature = feature;
    this.order.level = 20;
    this.selectedFeature = feature;
    this.getWeeklyFunctions();
  }

  removeCurrentFeature() {
    let featureId = this.order.selectedFeature.FeatureId;
    this.movieFeatures = this.movieFeatures
      .filter(feature => feature.FeatureId !== featureId);
    if(this.movieFeatures.length == 0) {
      this.error("No existen funciones para la película seleccionada");
      return;
    }

    this.selectFeature(this.movieFeatures[0], true);
  }

  selectShow(show) {
    //If show does not have available seats not allow to select show.
    if(Number(show.Seats) == 0) {
      return;
    }

    this.order.show = show;
    this.order.level = 20;
  }

  changeDay(date: string) {
    this.selectDay(date);

    // If user change day, select first show of the day... if any
    if (this.showHash[date] !== undefined && this.showHash[date].length > 0) {
      const show = this.showHash[date][0];
      this.selectShow(show);
    } else {
      this.selectShow(null);
    }
  }

  selectDay(date: string) {
    this.dayShows = this.showHash[+date];
    this.selectedDate = this.logic.toHumanDate(this.logic.parseIsoDate(date.toString()));
    this.order.date = +date;
  }

  next() {
    const savedOrder = this.orderBeforeChanges;
    if (this.order && this.order.show && savedOrder && savedOrder.show && savedOrder.show.ScheduleId !== this.order.show.ScheduleId)
      this.logic.saveOrderShowChanged(this.order);
    else
      this.logic.saveOrder(this.order);
    this.router.navigateByUrl('/categorias');
  }

  isActiveDay(date: string): boolean {
    return this.order.date === Number(date);
  }

  isShowSelected(show): boolean {
    return this.order.show && show.ScheduleId === this.order.show.ScheduleId;
  }

  isFeatureSelected(feature): boolean {
    return this.order.selectedFeature && feature.FeatureId === this.order.selectedFeature.FeatureId;
  }

  isSelectionReady(): boolean {
    return this.order.show && this.order.show.ScheduleId;
  }

  error(message: string) {
    this.errorPopup.open(message);
  }
}
