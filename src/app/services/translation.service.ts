import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any = {};

  constructor(private http: HttpClient) {}

  loadTranslations(): Promise<void[]> {
    const languages = ['es']; // Idiomas permitidos
    const loadPromises = languages.map(lang =>
      this.http.get(`assets/i18n/${lang}.json`).toPromise().then(data => {
        this.translations[lang] = data;
      })
    );

    return Promise.all(loadPromises);
  }

translate(key: string, lang: string): Observable<string> {
  // Si las traducciones ya están cargadas, devuelve inmediatamente la traducción o la clave
  if (this.translations[lang] && this.translations[lang][key]) {
    return of(this.translations[lang][key]);
  }

  // Si las traducciones para el idioma aún no se han cargado, carga las traducciones primero
  if (!this.translations[lang]) {
    // Convertir la promesa a un Observable para mantener la consistencia en el manejo asíncrono
    return from(this.loadTranslations()).pipe(
      switchMap(() => {
        // Después de cargar las traducciones, verifica nuevamente y devuelve la traducción o la clave
        if (this.translations[lang] && this.translations[lang][key]) {
          return of(this.translations[lang][key]);
        } else {
          return of(key);
        }
      })
    );
  }

  // En el caso de que las traducciones existan pero no la clave específica, devuelve la clave
  return of(key);
}
}
