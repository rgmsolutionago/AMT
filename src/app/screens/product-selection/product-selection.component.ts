import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieLogic } from '../../../app/services/movie-logic.service';
import { AppConfig } from '../../app.config';
import { MsgService } from '../../../app/services/msg.service';
import { ProductDetailsComponent } from '../../../app/components/product-details/product-details.component';

@Component({
  selector: 'app-product-selection',
  templateUrl: './product-selection.component.html',
  styleUrls: ['./product-selection.component.css']
})

export class ProductSelectionComponent implements OnInit {
  order;
  selectedProduct;
  selectedDate;
  products = [];
  onlyCandy: boolean;
  keyLayouts: any[] = [];
  loadingProducts: boolean;

  @ViewChild('productDetails')
  productDetails: ProductDetailsComponent;

  constructor(private logic: MovieLogic, 
              private _msgService: MsgService,
              private router: Router,
              private route: ActivatedRoute) {

    route.params.subscribe((params) => {
      this.onlyCandy = params.onlyCandy == 'candy';
    });

    this._msgService.$emitterSetProducts.subscribe((products: any[]) => {
      this.products = products;

      if (this.products && this.products.length > 0) {
        this.selectedProduct = this.products[0];
        this.products.forEach(product => {
          product.quantity = 0;

          if(this.productsBackup){
            const productBakcup = this.productsBackup.filter(p => p.CodProducto == product.CodProducto)[0];
            if(productBakcup) {
              product.quantity = productBakcup.quantity;
            }
          }
        
          
        });
      }
      this.loadingProducts = false;
    })
  }

  ngOnInit() {
    this.logic.onInit.then(() => {

      this.logic.getKeyLayouts().subscribe((keyLayoutResult: any[]) => {
        this.keyLayouts = keyLayoutResult;
        if(!this.keyLayouts || this.keyLayouts.length == 0)
          return;

        let firstKeylayoutId = this.keyLayouts[0].Id;
        this.loadProducts(firstKeylayoutId);

          if (this.onlyCandy) {
            var order = this.logic.getOrder();
    
            this.order = {
              products: [],
              categories: [],
              selectedMovie: null,
              level: 0,
              total: 0
            }

            if (order != null) {
              if (order.products != null) {
                this.order.products = order.products;
              }
            }
    
            this.calculateTotal();
            this.logic.saveOrder(this.order);
           
    
          } else {
            this.loadData();
          }
  
          this.productsBackup = this.order.products;
      });
    });
  }

  loadData() {
    this.order = this.logic.getOrder();
    this.productsBackup = [];
    // this.products = this.logic.getProducts();
    
    if(!this.onlyCandy){
      this.selectedDate = this.logic.toHumanDate(this.logic.parseIsoDate(this.order.date.toString()));
    }

    // Set user selected quantities
    if (this.order.products && this.products) {
      this.order.products.forEach(prod => {
        const product = this.products.find(p => p.CodProducto === prod.CodProducto);
        if (product) {
          product.quantity = prod.quantity;
          this.productsBackup.push(product);
        }
      });
    }

    this.calculateTotal();

  }

  productsBackup = [];

  loadProducts(firstKeylayoutId) {
    this.loadingProducts = true;
    this.logic.getProducts(firstKeylayoutId);
  }

  less(product) {
    product.quantity = product.quantity <= 0 ? 0 : product.quantity - 1;
    if(product.quantity <= 0 && this.productsBackup) {
      this.productsBackup = this.productsBackup.filter(p => p.CodProducto != product.CodProducto);
    }
    this.updateOrder();
  }

  more(product) {
    product.quantity = product.quantity >= 100 ? 100 : product.quantity + 1;
   
    if(this.productsBackup == null){
      this.productsBackup = [];
    }
    const productBakcup = this.productsBackup.filter(p => p.CodProducto == product.CodProducto)[0];
    if(!productBakcup) {
      this.productsBackup.push(product);
    } 
    this.updateOrder();
  }

  updateOrder() {
    this.order.total = 0;

    if (!this.order.products) {
      this.order.products = [];
    }

   
    
    // Add categories to the order total
    this.order.categories.forEach(category => {
      this.order.total += +category.Price * +category.quantity;
    });

    // Add the products to the order total
    this.productsBackup.forEach(product => {
      
      if (product.quantity > 0) {
        const orderProduct = this.order.products.find(p => p.CodProducto === product.CodProducto);

        if (orderProduct) {
          orderProduct.quantity = product.quantity;
        } else {
          this.order.products.push(product);
        }

        this.order.level = 30;
        this.order.total += product.quantity * +product.ImpPreciosXProducto;
      }
    });

    this.order.products = this.productsBackup;

    this.order.level = 22;
    
    this.logic.saveOrder(this.order);
  }

  select(product) {
    this.selectedProduct = product;
  }

  isSelected(product): boolean {
    return product && product.quantity > 0; // || product.CodProducto === this.selectedProduct.CodProducto;
  }

  calculateTotal() {
    // Add the products to the order total
    this.order.total = 0;
    this.order.categories.forEach(category => {
      this.order.total += +category.Price * +category.quantity;
    });


    if (this.order.products === null || this.order.products === undefined || this.products == null || this.products == undefined) 
      return;

    this.products.forEach(product => {
      const orderProduct = this.order.products.find(p => p.CodProducto === product.CodProducto);
      if (orderProduct) {
        product.quantity = orderProduct.quantity;
        this.order.level = 30;
        var total = orderProduct.quantity * +orderProduct.ImpPreciosXProducto;
        this.order.total += total;
      }

    this.logic.saveOrder(this.order);

    });
  }

  next() {
    if (AppConfig.settings.showClientInvoiceScreen) {
      if (this.onlyCandy) {
        this.router.navigateByUrl('/client-invoice-info/candy');
      } else {
        this.router.navigateByUrl('/client-invoice-info/');
      }
        
    } else {
      if (this.onlyCandy) {
        this.router.navigateByUrl('/pago/candy');
      } else {
        this.router.navigateByUrl('/pago/');
      }
    }
  }

  back() {
    if (this.onlyCandy) {
      this.router.navigateByUrl('/clean-cache');
    } else {
      if (this.order.distribution) {
        this.router.navigateByUrl('/asientos');
      } else {
        this.router.navigateByUrl('/categorias');
      }
    }
  }

  moreInfo(product: any){
    if(product.DescripcionExtra){
      this.productDetails.open(product);
    }
  }
}
