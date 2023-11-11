import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ServicePage implements OnInit {

  constructor(
    private alertController: AlertController,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    private securityService: SecurityService,
  ) { }

  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  service: any;

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.checkName('access_token').then((resp) => {
        if (resp.value != null) {
          this.access_token = resp.value;
        }
        let data = {
          id: this.id,
        }
        this.securityService.serviceById(data).subscribe((resp) => {
          this.service = resp;
          loading.dismiss();
        });
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

  schedule() {
    this.router.navigateByUrl('month/' + this.id);
  }

  goCompany(company_id: any) {
    this.router.navigateByUrl('company/' + company_id);
  }

}
