import { LiteEvent } from '../../Events/LiteEvent';
import { Seat } from './seat.model';

export class Cinema {
  private readonly onSeatSelected = new LiteEvent<Seat>();

  context: CanvasRenderingContext2D;
  seats: Seat[];
  seatAvailable;
  seatAvailableHandicap;
  seatSelected;
  seatSelectedHandicap;
  seatOccupied;
  seatBlocked;
  

  constructor(distribution: { Zones: { Zone: { Seats: { Seat: any[] } } } }, ctx: CanvasRenderingContext2D) {
    this.seats = distribution.Zones.Zone.Seats.Seat.map(s => {
      return new Seat(s, ctx, this);
    });

    this.context = ctx;
  }

  public get SeatSelected() {
    return this.onSeatSelected.expose();
  }

  draw(canvas: HTMLCanvasElement) {
    this.seats.forEach(seat => {
      seat.draw();
    });

    canvas.addEventListener('click', e => {
      const pos = this.getMousePos(canvas, e);
      const seat = this.getSeat(pos.x, pos.y);

      if (seat) {
        this.onSeatSelected.trigger(seat);
      }
    });
  }

  getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  getSeat(x: number, y: number): Seat {
    let selected = null;

    for (let index = 0; selected === null && index < this.seats.length; index++) {
      const seat = this.seats[index];
      if (seat.contains(x, y)) {
        selected = seat;
      }
    }

    return selected;
  }

  selectSeat(id: string) {
    const seat = this.seats.find(s => s.number === id);
    seat.setSelected();
  }

  getSelectedSeats(): Seat[] {
    const selected = [];

    for (let index = 0; index < this.seats.length; index++) {
      const seat = this.seats[index];
      if (seat.isSelected()) {
        selected.push(seat);
      }
    }

    return selected;
  }
}
