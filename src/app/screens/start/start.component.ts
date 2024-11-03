import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { PrintingService } from '../../services/printing.service';
import * as _ from 'lodash';
import { TranslationService } from '../../services/translation.service';
import { environment } from '../../../environments/environment';
import { MovieLogic } from '../../services/movie-logic.service';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html'
})
export class StartComponent implements OnInit {
  constructor(private router: Router,
    private logic: MovieLogic,
    private cache: CacheService,
    private printingService: PrintingService,
    private translationService: TranslationService) { 

    }

  theatreName: string;
  appVersion = environment.appVersion;

  ngOnInit() {

  

    this.translationService.loadTranslations().then(() => {
      console.log('Traducciones cargadas');
    }).catch(error => {
      console.error('Error al cargar las traducciones', error);
    });

    this.theatreName = AppConfig.settings.theatreName;
    if (!AppConfig.settings.showIntroScreen) {
      this.router.navigateByUrl('/seleccion');
    }
    this.printingService.checkPrinterStatusTestRequest();
   
  }


  start() {
    this.router.navigateByUrl('/seleccion');
  }
}
