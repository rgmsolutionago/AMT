import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-on-screen-keyboard',
  templateUrl: './on-screen-keyboard.component.html',
  styleUrls: ['./on-screen-keyboard.component.css']
})
export class OnScreenKeyboardComponent {
  @Output() keyPressed: EventEmitter<string> = new EventEmitter();
  open = false;

  onKeyPress(key: string): void {
    this.keyPressed.emit(key);
  }

  setOpen(open: boolean) {
    this.open = open;
  }
}