import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SecurityService } from 'src/app/services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss'],
  imports: [CommonModule, IonicModule],
  standalone: true,
})
export class CartButtonComponent implements OnInit {

  constructor(
    private securityService: SecurityService,
    public router: Router,
  ) { }

  visible: boolean = false;

  ngOnInit() {
    this.securityService.checkName('access_token').then((resp) => {
      if (resp.value != null) {
        this.securityService.checkName('cart').then((resp: any) => {
          this.visible = resp.value;
        });
      }
    });
  }

}
