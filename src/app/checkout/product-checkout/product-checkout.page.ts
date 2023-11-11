import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-product-checkout',
  templateUrl: './product-checkout.page.html',
  styleUrls: ['./product-checkout.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ProductCheckoutPage implements OnInit {

  constructor(
    private alertController: AlertController,
    public router: Router,
    private loadingController: LoadingController,
    private activatedRoute: ActivatedRoute,
    private securityService: SecurityService
  ) { }

  access_token: any;
  product: any;
  product_variation_name: any;
  product_variation: any;
  qty: number = 1;
  total: any = 0;
  cart: any = [];
  price: any;
  weight: any;

  ngOnInit() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.checkName('access_token').then((resp) => {
        if (resp.value != null) {
          this.access_token = resp.value;
        }
      });
      this.activatedRoute.queryParams.subscribe(params => {
        let parameters = JSON.parse(params['data']);
        let data = {
          id: parameters.product_id
        }
        this.securityService.productById(data).subscribe((resp: any) => {
          this.product = resp.data;
          this.price = this.product.price;
          this.weight = this.product.weight;
          if (parameters.shop_product_variations_id) {
            let data = {
              id: parameters.shop_product_variations_id
            }
            this.securityService.productVariationById(data).subscribe((resp: any) => {
              this.product_variation = resp.data;
              this.product_variation_name = resp.data.name;
              if (resp.data.price != this.price) {
                this.price = resp.data.price;
              }
              if (resp.data.weight) {
                this.weight = resp.data.weight;
              }
              loading.dismiss();
              this.checkTotal();
            });
          } else {
            loading.dismiss();
            this.product_variation_name = '';
            this.checkTotal();
          }
        });
      });
    });
  }

  checkTotal() {
    this.total = this.qty * (this.product_variation ? this.product_variation.price : this.product.data.price);
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

  finish() {
    this.securityService.checkName('cart').then((resp: any) => {
      let cart = [];
      if (resp.value != null) {
        cart = JSON.parse(resp.value);
      }

      // Verificar se a company_id do produto a ser adicionado é diferente da company_id dos produtos no carrinho
      const newProductCompanyId = this.product.shop_product_categories[0].company.id;
      const existingProductsCompanyIds = cart.map((item: { company_id: any; }) => item.company_id);

      if (existingProductsCompanyIds.length > 0 && existingProductsCompanyIds.some((id: any) => id !== newProductCompanyId)) {
        // Exibir um alerta indicando que não é possível adicionar produtos de empresas diferentes ao mesmo carrinho
        this.alertController.create({
          header: 'Não é possível adicionar produtos de empresas diferentes',
          message: 'Você só pode adicionar produtos da mesma empresa ao carrinho.',
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });
        return; // Não prosseguir com a adição ao carrinho
      }

      // Procurar pelo produto no carrinho com o mesmo ID
      const existingProduct = cart.find((item: { product: any; }) => item.product === this.product.id);

      if (existingProduct) {
        // Se o produto já existe no carrinho, aumente a quantidade
        existingProduct.quantity += this.qty;
      } else {
        // Caso contrário, adicione um novo item ao carrinho
        cart.push({
          product_id: this.product.id,
          product_name: this.product.name,
          variation: this.product_variation_name,
          quantity: this.qty,
          price: this.price,
          company_id: this.product.shop_product_categories[0].company.id,
          weight: this.weight ? this.weight : 0,
        });
      }

      this.cart = cart;

      // Atualize os dados do carrinho
      this.securityService.setName('cart', JSON.stringify(this.cart)).then(() => {
        this.alertController.create({
          header: 'Adicionado ao carrinho',
          message: 'Quer continuar a escolher na loja ou ir para o checkout?',
          backdropDismiss: false,
          buttons: [
            {
              text: 'Continuar a escolher',
              handler: () => {
                this.router.navigateByUrl('categories/' + this.product.shop_product_categories[0].company.id);
              }
            },
            {
              text: 'Ir para checkout',
              handler: () => {
                this.router.navigateByUrl('cart');
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      });
    });
  }




  decreaseQuantity() {
    if (this.qty > 1) {
      this.qty--;
      this.checkTotal();
    }
  }

  increaseQuantity() {
    this.qty++;
    this.checkTotal();
  }

}
