import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from '../services/security.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { SearchComponent } from '../components/search/search.component';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';
register();


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, SearchComponent, CartButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page implements OnInit {
  constructor(
    private securityService: SecurityService,
    private router: Router,
    private alertController: AlertController,
    public loadingController: LoadingController
  ) { }

  access_token: any = '';
  categories: any = [];
  products: any = [];
  services: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.shopCategories();
    });

  }

  shopCategories() {
    this.securityService.shopCategories().subscribe((resp: any) => {
      this.categories = resp['data'];
      this.randomShopProducts();
    }, (err: any) => {
      console.log(err);
    });
  }

  randomShopProducts() {
    this.securityService.randomShopProducts().subscribe((resp) => {
      this.randomServices();
      this.products = resp;
    });
  }

  randomServices() {
    this.securityService.randomServices().subscribe((resp) => {
      this.loadingController.dismiss();
      this.services = resp;
    });
  }

  goCompanies(category_id: any) {
    this.router.navigateByUrl('/companies/' + category_id);
  }

  goProduct(product_id: any) {
    this.router.navigateByUrl('product/' + product_id);
  }

  goService(service_id: any) {
    this.router.navigateByUrl('service/' + service_id);
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

}
