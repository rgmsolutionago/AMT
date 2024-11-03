import { Component, OnInit, ViewChild } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { PopupComponent } from '../popup/popup.component';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { MovieLogic } from '../../services/movie-logic.service';
import { CacheService } from '../../services/cache.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html'
})
export class TimerComponent {
  @ViewChild('timeoutAlert')
  timeoutAlert: PopupComponent;

  countdown = 0;

  constructor(private logic: MovieLogic,
    private cacheService: CacheService,
    private idle: Idle,
    private router: Router) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(AppConfig.settings.timeToIdleWarningSeconds);

    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(AppConfig.settings.timeFromIdleWarningToKickSeconds);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onTimeout.subscribe(() => {
      console.log("timer.idle.onTimeout()");
      // Clean cache, close dialog and redirect
      this.logic.cleanOrder();
      this.timeoutAlert.setOpen(false);
      this.resetTimer();
      this.router.navigate(['/']);
      this.cacheService.tryReloadCache();
    });

    idle.onIdleStart.subscribe(() => {
      console.log("timer.idle.onIdleStart()");
      // Open Idle dialog
      if(!this.currentlyInAnyStartScreen()){
        this.timeoutAlert.setOpen(true);
      }
    });

    idle.onTimeoutWarning.subscribe((countdown: number) => {
      console.log("timer.idle.onTimeoutWarning()");
      this.countdown = countdown;
    });

    this.resetTimer();
  }

  currentlyInAnyStartScreen(){
    const startScreenUrls = ["/", "/seleccion"]
    return startScreenUrls.indexOf(this.router.url) !== -1;
  }

  resetTimer() {
    console.log("timer.resetTimer()");
    this.idle.watch();
    this.countdown = 0;
  }

  pauseTimer() {
    console.log("time.pauseTimer()");
    this.idle.stop();
    this.countdown = 0;
  }
}
