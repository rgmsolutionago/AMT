import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-keylayout',
  templateUrl: './keylayout.component.html'
})
export class KeylayoutComponent {

  @Input() keyLayouts: any[] = [];
  @Output() loadProducts = new EventEmitter<any>();

  selectedKeyLayout;

  constructor() { 

  }



  loadKeyLayout(keyLayout: any) {
    this.selectedKeyLayout = keyLayout.Id;
    this.loadProducts.emit(keyLayout.Id);
  }
}

