import { EventEmitter, Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })
export class MsgService {

  constructor() { }


  $emitterSetProducts = new EventEmitter<any[]>();
  emitSetProducts(products: any[]){
    this.$emitterSetProducts.emit(products);
  }

  $emitterSetKeyLayoutsExists = new EventEmitter<boolean>();
  emitSetKeyLayoutsExists(value: boolean){
    this.$emitterSetKeyLayoutsExists.emit(value);
  }


}
