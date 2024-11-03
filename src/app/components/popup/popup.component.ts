import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html'
})
export class PopupComponent implements OnInit {
  @Input() okButtonText: string;
  @Input() okButtonClass: string;
  open = false;

  constructor() {}

  ngOnInit() {}

  setOpen(open: boolean) {
    this.open = open;
  }
}
