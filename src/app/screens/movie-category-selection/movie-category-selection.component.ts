import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { PopupComponent } from '../../components/popup/popup.component';
import { forceToArray } from '../../utils/force-to-array.function';
import { CacheService } from '../../../app/services/cache.service';
import { AppConfig } from '../../../app/app.config';

/**
 * Allow to select a Movie Category and navigate to Select Seat or Select Product view.
 */
@Component({
  selector: 'app-movie-category-selection',
  templateUrl: './movie-category-selection.component.html'
})
export class MovieCategorySelectionComponent implements OnInit {
  @ViewChild('errorPopup')
  errorPopup: PopupComponent;

  selectedCategory;
  selectedMovie;
  selectedDate;
  categories = [];
  order;

  constructor(private logic: MovieLogic, private router: Router, private cache: CacheService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.order = this.logic.getOrder();
    this.calculateTotal();

    this.selectedMovie = this.order.show;
    this.selectedDate = this.logic.toHumanDate(this.logic.parseIsoDate(this.order.date.toString()));

    this.logic.onInit.then(() => {
      this.getCategoryPrices();
      this.getSeats();
    });
  }

  calculateTotal() {
    if(this.order.categories){
      var total = 0;
      this.order.categories.map(category => {
        total += category.quantity * category.Price;
      });
      this.order.total = total;
      this.logic.saveOrder(this.order);
    }
  }

  error() {
    this.errorPopup.setOpen(true);
  }

  getSeats() {
    this.logic.getSeatDistribution(this.order.show.ScheduleId).subscribe((response: any) => {
      this.order.distribution = response && response.Distribution;
      this.logic.saveOrder(this.order);
    });
  }

  next() {
    if (this.order.distribution) {
      this.router.navigateByUrl('/asientos');
    } else {

      const keyLayoutsExist = this.cache.getKeyLayoutsExists() == "true";
      if(keyLayoutsExist){
        this.router.navigateByUrl('/productos/')
      } else {
        if (AppConfig.settings.showClientInvoiceScreen) {
            this.router.navigateByUrl('/client-invoice-info/');
        } else {
            this.router.navigateByUrl('/pago/');
        }
      }

    }
  }

  getCategoryPrices() {
    this.logic.getCategoryPrices(this.selectedMovie.ScheduleId).subscribe(response => {
      if(!(response.TicketTypes && response.TicketTypes.TicketType)){
        this.error();
        return;
      }
      
      const types = forceToArray(response.TicketTypes && response.TicketTypes.TicketType);

      if (types !== null && types !== undefined) {
        if (types.length) {
          this.categories = types;
        } else {
          this.categories.push(types);
        }

        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0];
        }

        // Reset quantity
        this.categories.forEach(category => {
          category.quantity = 0;
        });

        // Set user selected quantities
        if (this.order.categories) {
          this.order.categories.forEach(cat => {
            const category = this.categories.find(c => c.ID === cat.ID);
            if (category) {
              category.quantity = cat.quantity;
            }
          });
        }
      } else {
        this.error();
      }
    });
  }

  updateOrder() {
    this.cleanOrder();
    
    this.categories.forEach(category => {
  
      if (category.quantity > 0) {
        this.order.categories.push(category);
        this.order.total += category.quantity * category.Price;

        this.order.level = 21;
      }
    });

    this.logic.saveOrder(this.order);
  }

  less(category) {
    category.quantity = category.quantity <= 0 ? 0 : category.quantity - 1;

    this.updateOrder();
  }

  cleanOrder() {
    this.order.total = 0;
    this.order.categories = [];
  }

  more(category) {
    category.quantity = category.quantity >= 100 ? 100 : category.quantity + 1;

    this.updateOrder();
  }

  select(category) {
    this.selectedCategory = category;
  }

  isOrderReady(): boolean {
    return this.order.total > 0;
  }
}
