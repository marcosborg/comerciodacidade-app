import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { SearchComponent } from '../components/search/search.component';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SearchComponent, CartButtonComponent]
})
export class CategoriesPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) { }

  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  categories: any = [];
  company: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        id: this.id,
      }
      this.securityService.companyById(data).subscribe((resp) => {
        this.company = resp;
        this.securityService.categoriesByCompany(data).subscribe((resp) => {
          loading.dismiss();
          this.categories = resp;
        });
      });
    });
  }

  goCategory(id: any) {
    this.router.navigateByUrl('/products/' + id);
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

  goCompany(id: any) {
    this.router.navigateByUrl('/company/' + id);
  }

}
