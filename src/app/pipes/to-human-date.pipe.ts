import { Pipe, PipeTransform } from '@angular/core';
import { forceToArray } from '../utils/force-to-array.function';
import { MovieLogic } from '../services/movie-logic.service';

@Pipe({
  name: 'toHumanDate'
})
export class ToHumanDatePipe implements PipeTransform {

  constructor(protected movieLogic: MovieLogic) { }

  public transform(isoDate: string): string {
    return this.movieLogic.toHumanDate(
      this.movieLogic.parseIsoDate(isoDate)
    );
  }

}
