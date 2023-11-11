import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StartPage {

  constructor(
    public router: Router,
    private securityService: SecurityService,
  ) { }

  ionViewWillEnter() {
    setTimeout(() => {
      this.securityService.checkName('access_token').then((resp: any) => {
        if (resp.value == null) {
          this.router.navigateByUrl('login');
        } else {
          this.router.navigateByUrl('tabs');
        }
      })
    }, 2000);
  }

}
