import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { SearchComponent } from '../components/search/search.component';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.page.html',
  styleUrls: ['./companies.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SearchComponent, CartButtonComponent]
})
export class CompaniesPage implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController
  ) { }

  category_id: any = this.route.snapshot.paramMap.get('category_id');
  access_token: any = '';
  companies: any = [];

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        category_id: this.category_id,
      }
      this.securityService.companiesByCategory(data).subscribe((data) => {
        loading.dismiss();
        this.companies = data;
      });
    });
  }

  goProductCategories(id: any) {
    this.router.navigateByUrl('/categories/' + id);
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
