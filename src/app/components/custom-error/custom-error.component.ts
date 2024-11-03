import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-error',
  templateUrl: './custom-error.component.html'
})
export class CustomErrorComponent implements OnInit {
  dialogClasses = 'modal-wrapper';
  message = '';

  constructor() { }

  ngOnInit() {
  }
  
  public open(message?: string): void {
    this.dialogClasses = 'modal-wrapper open animated fadeIn';
    this.message = message;
  }

  public close(): void {
    this.dialogClasses = 'modal-wrapper animated fadeOut';
  }
}
