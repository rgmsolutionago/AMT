import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-withdraw-mode-selection',
  templateUrl: './ticket-withdraw-mode-selection.component.html'
})
export class TicketWithdrawModeSelectionComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
    if (!this.isQRWithdrawalEnabled()) {
      this.router.navigateByUrl('/retiro');
    }  
  }

  isQRWithdrawalEnabled() {
    return AppConfig.settings.isQRWithdrawalEnabled;
  }

  navigate(path: string) {
    this.router.navigateByUrl(path);
  }
}
