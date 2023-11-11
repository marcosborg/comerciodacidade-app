import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from '../services/security.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { addMinutes, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, CartButtonComponent]
})
export class Tab2Page {

  constructor(
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private securityService: SecurityService
  ) { }

  access_token: string = '';
  segment: string = 'purchases';
  schedules: any = [];
  purchases: any = [];
  isScheduleModalOpen = false;
  schedule: any;
  date: string = '';
  startHoursAndMinutes: string = '';
  endHoursAndMinutes: string = '';
  isPurchaseModalOpen = false;
  purchase: any;

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

  ionViewWillEnter() {
    this.load();
  }

  load() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.checkName('access_token').then((resp) => {
        if (resp.value) {
          this.access_token = resp['value'];
          let data = {
            access_token: this.access_token
          }
          this.securityService.lastPurchases(data).subscribe((resp: any) => {
            loading.dismiss();
            this.schedules = resp.schedules;
            this.purchases = resp.purchases;
          });
        } else {
          loading.dismiss();
          this.alertController.create({
            header: 'Accesso de cliente',
            message: 'Deve realizar login para continuar.',
            backdropDismiss: false,
            buttons: [
              {
                text: 'Voltar',
                handler: () => {
                  this.router.navigateByUrl('/');
                }
              },
              {
                text: 'Login',
                handler: () => {
                  this.router.navigateByUrl('/login');
                }
              }
            ]
          }).then((alert) => {
            alert.present();
          });
        }
      });
    });
  }

  openSchedule(id: any) {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        id: id,
      }
      this.securityService.schedule(data).subscribe((resp: any) => {
        loading.dismiss();
        this.schedule = resp.data;
        const start_time = new Date(this.schedule.start_time);
        this.date = format(start_time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
        this.startHoursAndMinutes = this.schedule.start_time.slice(11, 16);
        this.endHoursAndMinutes = this.schedule.end_time.slice(11, 16);
        this.setIsScheduleModalOpen(true);
      });
    });
  }

  setIsScheduleModalOpen(isOpen: boolean) {
    this.isScheduleModalOpen = isOpen;
  }

  cancelSchedule() {
    this.alertController.create({
      header: 'Tem a certeza?',
      subHeader: 'Esta ação é irreversível!',
      message: 'Se precisar reagendar terá de o fazer novamente na página do serviço.',
      buttons: [
        {
          text: 'Quero manter',
          role: 'cancel',
        },
        {
          text: 'Quero cancelar',
          handler: () => {
            this.loadingController.create().then((loading) => {
              loading.present();
              let data = {
                access_token: this.access_token,
                id: this.schedule.id,
              }
              this.securityService.deleteSchedule(data).subscribe(() => {
                this.alertController.create({
                  message: 'Eliminado com sucesso.',
                }).then((alert) => {
                  loading.dismiss();
                  alert.present();
                  setTimeout(() => {
                    alert.dismiss().then(() => {
                      this.isScheduleModalOpen = false;
                      this.load()
                    });
                  }, 1000);
                });
              });
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  openPurchase(id: any) {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        id: id,
      }
      this.securityService.purchase(data).subscribe((resp: any) => {
        loading.dismiss();
        this.purchase = resp.data;
        console.log(this.purchase);
        this.setIsPurchaseModalOpen(true);
      });
    });
  }

  setIsPurchaseModalOpen(isOpen: boolean) {
    this.isPurchaseModalOpen = isOpen;
  }

  goScheduleCompany() {
    this.isScheduleModalOpen = false;
    setTimeout(() => {
      this.router.navigateByUrl('/company/' + this.schedule.service.shop_company.company_id);
    }, 100);
  }

  goScheduleService() {
    this.isScheduleModalOpen = false;
    setTimeout(() => {
      this.router.navigateByUrl('/service/' + this.schedule.service.id);
    }, 100);
  }

  goPurchaseCompany() {
    this.isPurchaseModalOpen = false;
    setTimeout(() => {
      this.router.navigateByUrl('/company/' + this.purchase.product.shop_product_categories[0].company_id);
    }, 100);
  }

  goPurchaseProduct() {
    this.isPurchaseModalOpen = false;
    setTimeout(() => {
      this.router.navigateByUrl('/product/' + this.purchase.product.id);
    }, 100);
  }

  cancelPurchase() {
    this.alertController.create({
      header: 'Tem a certeza?',
      subHeader: 'Esta ação é irreversível!',
      message: 'Se precisar de adquirir o produto terá de o fazer novamente na página do mesmo.',
      buttons: [
        {
          text: 'Quero manter',
          role: 'cancel',
        },
        {
          text: 'Quero cancelar',
          handler: () => {
            this.loadingController.create().then((loading) => {
              loading.present();
              let data = {
                access_token: this.access_token,
                id: this.purchase.id,
              }
              console.log(data);
              this.securityService.deletePurchase(data).subscribe(() => {
                this.alertController.create({
                  message: 'Eliminado com sucesso.',
                }).then((alert) => {
                  loading.dismiss();
                  alert.present();
                  setTimeout(() => {
                    alert.dismiss().then(() => {
                      this.isPurchaseModalOpen = false;
                      this.load()
                    });
                  }, 1000);
                });
              });
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

}
