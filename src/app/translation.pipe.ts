import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './services/translation.service';
import { Observable } from 'rxjs';

@Pipe({
  name: 'translate'
})
export class TranslationPipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string, lang: string): Observable<string> {
    return this.translationService.translate(key, lang);
  }
}