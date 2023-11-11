import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, IonModal } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import { format, addMinutes } from 'date-fns';
import { pt } from 'date-fns/locale';

@Component({
  selector: 'app-service-checkout',
  templateUrl: './service-checkout.page.html',
  styleUrls: ['./service-checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ServiceCheckoutPage implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private securityService: SecurityService,
  ) { }

  access_token: any = '';
  service_id: any;
  service: any;
  selectedDate: any;
  date: string = '';
  start_time: string = '';
  end_time: string = '';
  startHoursAndMinutes: string = '';
  endHoursAndMinutes: string = '';
  employee_id!: any;
  employee: any;
  pages: any = [];
  public allChecked: boolean = false;
  isModalOpen: boolean = false;
  pageTitle: string = '';
  pageContent: string = '';

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.activatedRoute.queryParams.subscribe(params => {
        let data = JSON.parse(params['data']);
        this.service_id = data.service_id;
        this.employee_id = data.employee_id;
        this.selectedDate = new Date(data.start_time);
        this.date = format(this.selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: pt });
        this.start_time = data.start_time;
        this.securityService.checkName('access_token').then((resp) => {
          this.access_token = resp.value;
          let data = {
            id: this.service_id,
            access_token: this.access_token,
          }
          this.securityService.serviceById(data).subscribe((resp) => {
            this.service = resp;
            const startDateTime = new Date(this.start_time);
            const endDateTime = addMinutes(startDateTime, this.service.data.service_duration.minutes);
            this.end_time = format(endDateTime, 'yyyy-MM-dd HH:mm:ss');
            this.startHoursAndMinutes = this.start_time.slice(11, 16);
            this.endHoursAndMinutes = this.end_time.slice(11, 16);
            let data = {
              access_token: this.access_token,
              id: this.employee_id,
            }
            this.securityService.serviceEmployee(data).subscribe((resp) => {
              this.employee = resp;
              this.getPages().then(() => {
                loading.dismiss();
              });
            });
          });
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

  async getPages() {
    let data = {
      access_token: this.access_token
    }
    return this.securityService.pages(data).subscribe((resp) => {
      const pages: any = resp;
      this.pages = pages.data;
    });
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
            //Gravar marcação
            let data = {
              access_token: this.access_token,
              service_employee_id: this.employee_id,
              service_id: this.service_id,
              start_time: this.start_time,
              end_time: this.end_time,
            }
            this.loadingController.create().then((loading) => {
              loading.present();
              this.securityService.saveSchedule(data).subscribe(() => {
                loading.dismiss();
                this.alertController.create({
                  header: 'Parabens!',
                  subHeader: 'Reserva concluida com sucesso!',
                  backdropDismiss: false,
                }).then((alert) => {
                  alert.present()
                  setTimeout(() => {
                    alert.dismiss();
                    this.router.navigateByUrl('tabs/tab2');
                  }, 2000);
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

  openModal(page: any) {
    this.pageContent = page.text;
    this.pageTitle = page.title;
    this.isModalOpen = true;
  }

  close() {
    this.isModalOpen = false;
  }

}
