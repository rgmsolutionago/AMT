import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit {
  dialogClasses = 'modal-wrapper';
  message = '';

  constructor() {}

  ngOnInit() {}

  public open(message?: string): void {
    this.dialogClasses = 'modal-wrapper open';
    this.message = message;
  }

  public close(): void {
    this.dialogClasses = 'modal-wrapper';
  }
}
