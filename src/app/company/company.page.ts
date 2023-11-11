import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from '../services/security.service';
import { register } from 'swiper/element/bundle';
register();

import { GoogleMap } from '@capacitor/google-maps';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, CartButtonComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CompanyPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController,
    public router: Router,
    public loadingController: LoadingController,
    private securityService: SecurityService,
  ) { }

  id: any = this.activatedRoute.snapshot.paramMap.get('id');
  access_token: any = '';
  company: any;
  segment: string = 'about';

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        id: this.id,
      }
      this.securityService.companyById(data).subscribe((resp) => {
        this.company = resp;
        this.company = this.company.data;
        loading.dismiss();
      });
    });
  }

  @ViewChild('map')
  mapRef!: ElementRef<HTMLElement>;
  newMap!: GoogleMap;
  apiKey: string = 'AIzaSyAAYYxvit-qTdOhu1Gr78b4GMHUirs_N_c';

  async createMap(latitude: any, longitude: any) {

    this.newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: this.mapRef.nativeElement,
      apiKey: this.apiKey,
      config: {
        center: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
        },
        zoom: 20,
      },
    });

    this.newMap.addMarker({
      coordinate: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      }
    })
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

  goCategories() {
    this.router.navigateByUrl('/categories/' + this.id);
  }

}
