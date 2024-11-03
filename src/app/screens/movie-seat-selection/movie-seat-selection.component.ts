import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { Router } from '@angular/router';
import { Cinema } from './cinema.model';
import { Seat } from './seat.model';
import { Observable } from 'rxjs';
import { PopupComponent } from '../../components/popup/popup.component';
import { CacheService } from '../../../app/services/cache.service';
import { AppConfig } from '../../../app/app.config';

/**
 * Allow to select Movie Seats
 */
@Component({
  selector: 'app-movie-seat-selection',
  templateUrl: './movie-seat-selection.component.html'
})
export class MovieSeatSelectionComponent implements OnInit {
  order: any;
  context;

  totalSeats: number;
  selectedSeatsCounter: number;
  selectedSeats: string[];
  hasPreferencial: boolean = false;

  @ViewChild('seatCanvas')
  seatCanvas: ElementRef;

  @ViewChild('errorPopup')
  errorPopup: PopupComponent;

  @ViewChild('seatBlocked')
  seatBlocked: ElementRef;

  @ViewChild('seatSelected')
  seatSelected: ElementRef;

  @ViewChild('seatAvailable')
  seatAvailable: ElementRef;

  @ViewChild('seatOccupied')
  seatOccupied: ElementRef;

  @ViewChild('seatAvailableHandicap')
  seatAvailableHandicap: ElementRef;

  @ViewChild('seatSelectedHandicap')
  seatSelectedHandicap: ElementRef;

  cinema: Cinema;

  constructor(private logic: MovieLogic, private router: Router, private cache: CacheService) { }

  ngOnInit() {
    this.logic.onInit.then(() => {
      this.loadData();
    });
  }

  loadData() {
    this.order = this.logic.getOrder();

    this.totalSeats = 0;
    this.order.categories.forEach(c => (this.totalSeats += c.quantity));

    if (Array.isArray(this.order.selectedSeats) && this.order.selectedSeats.length > 0) {
      this.selectedSeats = this.order.selectedSeats.slice();
      this.selectedSeatsCounter = this.selectedSeats.length;

    } else {
      this.selectedSeatsCounter = 0;
      this.selectedSeats = [];
    }

    if (this.order.distribution) {
      // Let the canvas be ready
      setTimeout(() => {
        this.createCanvas(this.order.distribution);
      }, 500);
    }
  }

  createCanvas(distribution) {
    const canvas: HTMLCanvasElement = this.seatCanvas.nativeElement;

    //Click puede no funcionar por la posicion del canvas
    this.context = canvas.getContext('2d');

    if (this.context !== undefined && this.context !== null) {
      this.cinema = new Cinema(distribution, this.context);
      this.cinema.seatAvailable = this.seatAvailable.nativeElement;
      this.cinema.seatAvailableHandicap = this.seatAvailableHandicap.nativeElement;
      this.cinema.seatSelected = this.seatSelected.nativeElement;
      this.cinema.seatSelectedHandicap = this.seatSelectedHandicap.nativeElement;
      this.cinema.seatBlocked = this.seatBlocked.nativeElement;
      this.cinema.draw(canvas);
      this.cinema.SeatSelected.on((seat?) => this.selectSeat(seat));

      this.findPreferencialSeats(this.cinema.seats);
    }

    // If there is already a selected seat unlock it and select it
    if (this.selectedSeatsCounter > 0) {
      this.logic.unblockAllSeats();

      // Iterate and select seats
      this.order.selectedSeats.forEach((seatId: string) => this.cinema.selectSeat(seatId));
    }
  }

  error() {
    this.errorPopup.setOpen(true);
  }

  selectSeat(seat: Seat) {
    if (seat.status === 'available' && this.selectedSeatsCounter < this.totalSeats) {
      this.selectedSeatsCounter += 1;
      seat.setSelected();

      const seatNumber = seat.number;
      this.selectedSeats.push(seatNumber);

    } else if (seat.status === 'selected') {
      this.selectedSeatsCounter -= 1;
      seat.setAvailable();


      this.selectedSeats = this.selectedSeats.filter(x => x !== seat.number);
    }
  }

  displaySeat(seatNumber: string) {
    const seat = this.cinema.seats.filter(x => x.number == seatNumber)[0];
    if (seat) {
      return seat.seatType === 1 ? seat.number + " (Preferencial)" : seat.number;
    }
    return seatNumber;
  }

  findPreferencialSeats(seats: Seat[]): void {
    if (seats !== null && seats.length > 0)
      this.hasPreferencial = seats.some(seat => seat.seatType === 1);
  }

  next() {
    if (this.isSelectionReady()) {
      this.confirmSelection()
        .then(() => {
          const keyLayoutsExist = this.cache.getKeyLayoutsExists() == "true";
          if(keyLayoutsExist){
            this.router.navigateByUrl('/productos/')
          } else {
            if (AppConfig.settings.showClientInvoiceScreen) {
                this.router.navigateByUrl('/client-invoice-info/');
            } else {
                this.router.navigateByUrl('/pago/');
            }
          }
        })
        .catch(error => {
          this.error();
        });
    }
  }

  confirmSelection(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scheduleId = this.order.show.ScheduleId;
      const selected = this.cinema.getSelectedSeats();
      const seatPromises = [];

      selected.forEach(s => {
        seatPromises.push(this.logic.blockSeat(scheduleId, s.number));
      });

      Observable.forkJoin(seatPromises).subscribe(responses => {
        let result = true;
        let error = '';

        responses.forEach(r => {
          if (r.Error) {
            error = r.Error.Message;
            result = false;
          } else {
            result = r.Response === 'True';
          }
        });

        if (!result) {
          this.logic.unblockAllSeats();
          reject(error);
        } else {
          this.order.level = 22;
          this.order.selectedSeats = selected.map(s => s.number);
          this.logic.saveOrder(this.order);
          resolve();
        }
      });
    });
  }

  isSelectionReady(): boolean {
    return this.selectedSeatsCounter === this.totalSeats;
  }
}
