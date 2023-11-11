import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, InfiniteScrollCustomEvent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { SearchComponent } from '../components/search/search.component';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SearchComponent, CartButtonComponent]
})
export class ProductsPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router,
  ) { }

  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  products: any = [];
  services: any = [];
  category: any;
  subcategories: any = [];
  filter: boolean = false;
  products_next_page_url: string = '';
  services_next_page_url: string = '';
  segment: string = 'products';

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        id: this.id,
      }
      this.securityService.companyByProductCategory(data).subscribe((resp) => {
        this.category = resp;
        this.securityService.shopProductSubCategoryByCategoryId(data).subscribe((resp) => {
          this.subcategories = resp;
          this.securityService.shopProductsByCategoryProduct(data).subscribe((resp) => {
            let response: any = resp;
            this.products = response.data;
            this.products_next_page_url = response.next_page_url;
            this.securityService.shopServicesByCategoryProduct(data).subscribe((resp) => {
              loading.dismiss();
              let response: any = resp;
              this.services = response.data;
              this.services_next_page_url = response.next_page_url;
              if (this.services.length > 0 && this.products.length == 0) {
                this.segment = 'services';
              }
            });
          });
        });
      });
    });
  }

  goProduct(id: number) {
    this.router.navigateByUrl('/product/' + id);
  }

  goService(id: number) {
    this.router.navigateByUrl('/service/' + id);
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

  showFilter() {
    if (this.filter === true) {
      this.filter = false;
    } else {
      this.filter = true;
    }
  }

  segmentChanged(event: Event) {
    this.loadingController.create().then((loading) => {
      loading.present();
      let resp: any = event;
      let id = resp.detail.value;
      if (id == 0) {
        let data = {
          access_token: this.access_token,
          id: this.id,
        }
        this.securityService.shopProductsByCategoryProduct(data).subscribe((resp) => {
          let response: any = resp;
          this.products = response.data;
          this.products_next_page_url = response.next_page_url;
          this.securityService.shopServicesByCategoryProduct(data).subscribe((resp) => {
            loading.dismiss();
            let response: any = resp;
            this.services = response.data;
            this.services_next_page_url = response.next_page_url;
          });
        });
      } else {
        let data = {
          access_token: this.access_token,
          id: id,
        }
        this.securityService.shopProductsBySubcategoryProduct(data).subscribe((resp) => {
          let response: any = resp;
          this.products = response.data;
          this.products_next_page_url = response.next_page_url;
          this.securityService.shopServicesBySubcategoryProduct(data).subscribe((resp) => {
            loading.dismiss();
            let response: any = resp;
            this.services = response.data;
            this.services_next_page_url = response.next_page_url;
          });
        });
      }
    });
  }

  onIonProductsInfinite(ev: any) {
    let data = {
      url: this.products_next_page_url,
      access_token: this.access_token
    }
    this.securityService.paginatedModel(data).subscribe((resp) => {
      let response: any = resp;
      response.data.forEach((element: any) => {
        this.products.push(element);
      });
      this.products_next_page_url = response.next_page_url;
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

  onIonServicesInfinite(ev: any) {
    let data = {
      url: this.services_next_page_url,
      access_token: this.access_token
    }
    this.securityService.paginatedModel(data).subscribe((resp) => {
      let response: any = resp;
      response.data.forEach((element: any) => {
        this.services.push(element);
      });
      this.services_next_page_url = response.next_page_url;
      (ev as InfiniteScrollCustomEvent).target.complete();
    });
  }

}
