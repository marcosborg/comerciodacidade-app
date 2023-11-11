import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {

  constructor(
    private securityService: SecurityService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public router: Router
  ) { }

  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  ionViewWillEnter() {
    this.securityService.removeName('access_token');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async login() {
    this.loadingCtrl.create().then((loading) => {
      loading.present();
      let data = {
        email: this.email,
        password: this.password
      }
      this.securityService.login(data).subscribe((resp: any) => {
        loading.dismiss();
        this.securityService.setName('access_token', resp['access_token']).then(() => {
          this.alertCtrl.create({
            header: 'Parabens!',
            subHeader: 'Pode proseguir!',
            backdropDismiss: false,
          }).then((alert) => {
            alert.present()
            setTimeout(() => {
              alert.dismiss();
              this.router.navigateByUrl('tabs');
            }, 2000);
          });
        });
      }, (error) => {
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
          this.alertCtrl.create({
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
      });
    });
  }

  goCreate() {
    this.router.navigateByUrl('create');
  }

}
