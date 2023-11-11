import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from '../services/security.service';
import { FormsModule } from '@angular/forms';
import { CartButtonComponent } from '../components/cart-button/cart-button.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CartButtonComponent],
})
export class Tab3Page {
  constructor(
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private securityService: SecurityService
  ) { }

  access_token!: string;
  user: any;
  name: string | undefined;
  email: string | undefined;
  address: string | undefined;
  country_id: number = 170;
  phone: string | undefined;
  city: string | undefined;
  zip: string | undefined;
  vat: string | undefined;

  ionViewWillEnter(): void {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.checkName('access_token').then((resp) => {
        if (resp.value) {
          this.access_token = resp['value'];
          loading.dismiss();
          this.getUser();
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

  getUser() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token
      }
      this.securityService.user(data).subscribe((resp) => {
        loading.dismiss();
        this.user = resp;
        this.name = this.user.name;
        this.email = this.user.email;
        this.phone = this.user.address ? this.user.address.phone : '';
        this.address = this.user.address ? this.user.address.address : '';
        this.city = this.user.address ? this.user.address.city : '';
        this.zip = this.user.address ? this.user.address.zip : '';
        this.vat = this.user.address ? this.user.address.vat : '';
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

  update() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        user_id: this.user.id,
        name: this.name,
        phone: this.phone,
        address: this.address,
        city: this.city,
        zip: this.zip,
        country_id: this.country_id,
        vat: this.vat,
      }
      this.securityService.userUpdate(data).subscribe(() => {
        loading.dismiss();
        this.alertController.create({
          header: 'Atualizado com sucesso!',
          subHeader: 'Pode continuar.',
          backdropDismiss: false,
        }).then((alert) => {
          alert.present()
          setTimeout(() => {
            alert.dismiss();

          }, 2000);
        });
      }, ((error) => {
        loading.dismiss();
        if (error.status == 422) {
          let html = '';
          let errors = error.error.errors;
          for (const key in errors) {
            if (errors.hasOwnProperty(key)) {
              let err = errors[key];
              for (const k in err) {
                if (err.hasOwnProperty(k)) {
                  html += err[k] + ' ';
                }
              }
            }
          }
          this.alertController.create({
            header: 'Erro de validação',
            subHeader: 'Corrija os erros abaixo',
            message: html,
            buttons: ['Tentar novamente']
          }).then((alert) => {
            alert.present();
          });
        } else {
          console.log(error);
        }
      }));
    });
  }

  askForDelete() {
    this.alertController.create({
      header: 'Alerta!',
      subHeader: 'Está a solicitar a eliminação da sua conta!',
      message: 'Deseja prosseguir? Iremos analisar e confirmar consigo antes de eliminar totalmente a sua conta e todos os seus dados. Antes de continuar, queira deixar o motivo de nos deixar. Obrigado.',
      inputs: [
        {
          placeholder: 'Motivo',
          type: 'textarea',
          name: 'reason',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: (inputs) => {
            this.loadingController.create().then((loading) => {
              loading.present();
              let data = {
                access_token: this.access_token,
                reason: inputs.reason
              }
              this.securityService.askForDelete(data).subscribe((resp) => {
                loading.dismiss();
                this.alertController.create({
                  header: 'Enviado',
                  message: 'Vamos dar seguimento ao seu pedido.',
                  backdropDismiss: false,
                  buttons: [
                    {
                      text: 'Ok',
                      handler: () => {
                        this.router.navigateByUrl('/');
                      }
                    }
                  ]
                }).then((alert) => {
                  alert.present();
                });
              }, (error) => {
                loading.dismiss();
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
