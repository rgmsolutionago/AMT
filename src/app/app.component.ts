import { Component, HostListener } from '@angular/core';
import { FullScreenHelper } from './utils/full-screen.helper';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Cinestar ATM';

  @HostListener('click')
  public onClick(): void {
    if (environment.forceFullScreen)
      FullScreenHelper.launchFullScreen();
  }

}
