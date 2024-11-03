import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../../app.config';
import { MovieLogic } from '../../services/movie-logic.service';
import { SellOption } from '../../utils/sellOption';
import { CacheService } from '../../../app/services/cache.service';
import { MsgService } from '../../../app/services/msg.service';

/**
 * Main page. Allow to Buy Ticket or Withdraw Ticket
 */
@Component({
  selector: 'app-option-selection',
  templateUrl: './option-selection.component.html'
})
export class OptionSelectionComponent implements OnInit {


  sellOption: SellOption;
  keyLayoutsExists = false;

  constructor(private logic: MovieLogic, private cache: CacheService, private msgService: MsgService) {
    this.sellOption = AppConfig.settings.sellOption;
    this.logic.onInit.then(() => {
      this.logic.cleanOrder();
    });
   }

  ngOnInit() { 
    this.checkLayouts();
  }

  
  checkLayouts() {
    console.log("start");

    this.logic.getKeyLayouts().subscribe((res:any) => {
      let keylayoutsExists = false;
      if(res != null && res.length > 0){
        keylayoutsExists = true; 
      }
      this.keyLayoutsExists = keylayoutsExists;
      this.cache.saveKeyLayoutsExists(keylayoutsExists);
      this.msgService.emitSetKeyLayoutsExists(keylayoutsExists);
    });

    
  }
}
