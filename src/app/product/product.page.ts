import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SecurityService } from '../services/security.service';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';
register();

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CartButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductPage implements OnInit {

  constructor(
    private router: Router,
    private alertController: AlertController,
    private activatedRoute: ActivatedRoute,
    private loadingController: LoadingController,
    private securityService: SecurityService,
  ) { }

  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  product: any;
  segment: string = '';
  shop_product_index: string = '0';

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        id: this.id,
      }
      this.securityService.productById(data).subscribe((resp) => {
        this.product = resp;
        if (this.product.data.shop_product_variations.length > 0) {
          this.segment = 'variations';
        } else {
          this.segment = 'features';
        }
        loading.dismiss();
      });
    });
  }

  logout() {
    this.alertController.create({
      header: 'Tem a certeza?',
      buttons: [
        {
          text: 'Sim',
          handler: () => {
            this.router.navigateByUrl('/login');
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  order() {
    let data = {
      product_id: this.product.data.id,
      shop_product_variations_id: '',
    }
    if (this.product.data.shop_product_variations.length > 0) {
      data.shop_product_variations_id = this.product.data.shop_product_variations[this.shop_product_index].id;
    }
    // Checkout product
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(data)
      }
    };
    this.router.navigate(['product-checkout'], navigationExtras);
  }

}
