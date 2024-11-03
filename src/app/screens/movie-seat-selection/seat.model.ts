import { Cinema } from './cinema.model';

export class Seat {
  status: string;
  number: string;
  x: number;
  y: number;
  seatType: number;
  width?: number;
  height?: number;
  context: CanvasRenderingContext2D;
  cinema: Cinema;

  constructor(seat: any, ctx: CanvasRenderingContext2D, cinema: Cinema) {
    this.status = seat.Status;
    this.number = seat.SeatNumber;
    this.x = +seat.X;
    this.y = +seat.Y;
    this.seatType = +seat.SeatType;
    this.width = 18;
    this.height = 18;
    this.context = ctx;
    this.cinema = cinema;
  }

  contains = function (x: number, y: number) {
    return (
      this.x <= x &&
      x <= this.x + this.width &&
      this.y <= y &&
      y <= this.y + this.height
    );
  };

  draw = function () {
    this.drawImage();
    //this.drawText();
  };

  drawImage = function () {
    let image = this.cinema.graySeat;

    switch (this.status) {
      case 'available':
        if (this.seatType === 1) { //1 discapacidad o preferencial
          image = this.cinema.seatAvailableHandicap;
        } else { //0 normal, 2 otro sin definir
          image = this.cinema.seatAvailable;
        }
        break;
      case 'selected':
        if (this.seatType === 1) { //1 discapacidad o preferencial
          image = this.cinema.seatSelectedHandicap;
        } else { //0 normal, 2 otro sin definir
          image = this.cinema.seatSelected;
        }
        break;
      case 'sold':
        image = this.cinema.seatBlocked;
        break;
      case 'blocked':
      case 'disabled':
      default:
        image = this.cinema.seatBlocked;
        break;
    }

    // Lightgray bakcground
    this.context.fillStyle = "rgb(238,241,243)";
    this.context.fillRect(this.x, this.y, this.width, this.height);
    // Rounded rectangle with 2px radius
    this.context.strokeStyle = "lightgray";
    this.context.beginPath();
    this.context.roundRect(this.x-1, this.y-1, this.width+2, this.height+2, [2]);
    this.context.stroke();
    // Icon image
    this.context.drawImage(image, this.x, this.y, this.width, this.height);
  };

  // drawText = function () {
  //   const [letter, number] = this.number.split('-');

  //   this.context.fillStyle = '#eeeeee';
  //   this.context.font = '9px Arial';
  //   this.context.textAlign = "center";
  //   this.context.fillText(letter, this.x + 10, this.y + 9);
  //   this.context.fillText(number, this.x + 10, this.y + 18);
  // };

  isSelected(): boolean {
    return this.status === 'selected';
  }

  setSelected = function () {
    this.status = 'selected';
    this.draw();
  };

  setAvailable = function () {
    this.status = 'available';
    this.draw();
  };
}
