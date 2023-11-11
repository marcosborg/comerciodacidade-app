import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CheckoutPage {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private securityService: SecurityService
  ) { }

  access_token: any;
  pages: any = [];
  public allChecked: boolean = false;
  pageTitle: string = '';
  pageContent: string = '';
  isModalOpen: boolean = false;

  ionViewWillEnter() {
    this.securityService.checkName('access_token').then((resp) => {
      this.access_token = resp.value;
      let data = {
        access_token: this.access_token
      }
      return this.securityService.pages(data).subscribe((resp) => {
        const pages: any = resp;
        this.pages = pages.data;
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

  openModal(page: any) {
    this.pageContent = page.text;
    this.pageTitle = page.title;
    this.isModalOpen = true;
  }

  finish() {
    this.alertController.create({
      header: 'Concluir',
      message: 'Ao continuar, confirmo que li e concordo com os termos e condições de utilização, bem como com a política de privacidade.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Continuar',
          handler: () => {
            console.log('continuar');
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  close() {
    this.isModalOpen = false;
  }

}
