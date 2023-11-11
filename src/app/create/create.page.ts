import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CreatePage implements OnInit {

  constructor(
    private securityService: SecurityService,
    public loadingController: LoadingController,
    public router: Router,
    public alertCtrl: AlertController
  ) { }

  name: string = '';
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  showPassword: boolean = false;

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.removeName('access_token').then(() => {
        loading.dismiss();
      });
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goLogin() {
    this.router.navigateByUrl('login');
  }

  register() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.password_confirmation
      }
      this.securityService.register(data).subscribe((resp) => {
        loading.dismiss();
        this.alertCtrl.create({
          header: 'Parabens!',
          subHeader: 'Pode fazer login!',
          backdropDismiss: false,
        }).then((alert) => {
          alert.present()
          setTimeout(() => {
            alert.dismiss();
            this.router.navigateByUrl('login');
          }, 2000);
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

}
