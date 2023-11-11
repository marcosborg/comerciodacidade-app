import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SecurityService } from '../services/security.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CartPage {

  constructor(
    private alertController: AlertController,
    public router: Router,
    private securityService: SecurityService,
    private loadingController: LoadingController
  ) { }

  cart: any = [];
  company: any;
  access_token: string = '';
  totalAmount: number = 0;
  totalAmountWithDelivery: number = 0;
  product_id: any;
  price: any;
  user: any;
  qty: any;
  delivery_type: string = '0';
  delivery_ranges: any = [];
  weight: number = 0;
  delivery_value: number = 0;

  ionViewWillEnter() {
    this.loadingController.create().then((loading) => {
      loading.present();
      this.securityService.checkName('access_token').then((resp: any) => {
        this.access_token = resp.value;
        let data = {
          access_token: this.access_token
        }
        this.securityService.user(data).subscribe((resp) => {
          this.user = resp;
          loading.dismiss();
          this.checkCart();
        });
      });
    });
  }

  checkCart() {
    this.securityService.checkName('cart').then((resp: any) => {
      this.cart = JSON.parse(resp.value);
      if (resp.value == null || this.cart.length == 0) {
        this.router.navigateByUrl('tabs/tab1');
      } else {
        this.product_id = this.cart[0].product_id;
        this.price = this.cart[0].price;
        this.qty = this.cart[0].quantity;
        let total = 0; // Inicializa o total como zero
        let weight = 0;
        for (const item of this.cart) {
          const price = parseFloat(item.price.replace(',', '.')); // Converte o preço para um número
          const quantity = item.quantity;
          total += price * quantity; // Soma o preço total deste item ao total geral
          weight = weight + (item.weight * quantity);
          this.weight = weight;
        }

        this.totalAmount = total; // Armazena o total calculado em uma variável

        let data = {
          access_token: this.access_token,
          id: this.cart[0].company_id,
        };
        this.securityService.companyById(data).subscribe((resp: any) => {
          this.company = resp.data;
          if (resp.data.shop_company.delivery_ranges) {
            this.delivery_ranges = resp.data.shop_company.delivery_ranges;
          }

          let data = {
            delivery_ranges: this.delivery_ranges,
            weight: this.weight
          };

          // Chamar a função e obter o custo de envio
          this.delivery_value = this.calcularCustoEnvio(data);

          if (this.totalAmount >= this.company.shop_company.delivery_free_after) {
            this.delivery_value = 0;
          }

          if (this.delivery_type == '1') {
            this.totalAmountWithDelivery = this.totalAmount + this.delivery_value;
          } else {
            this.totalAmountWithDelivery = this.totalAmount;
          }

        });
      }
    });
  }

  calcularCustoEnvio(data: any) {
    const { delivery_ranges, weight } = data;

    // Encontrar a faixa de entrega correspondente ao peso
    const faixa = delivery_ranges.find((range: { from: number; to: number; }) => weight >= range.from && weight <= range.to);

    if (faixa) {
      return parseFloat(faixa.value); // Converter para número
    } else {
      return 0;
    }
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

  deleteCart() {
    this.alertController.create({
      header: 'Tem a certeza?',
      subHeader: 'O proceso é irreversível!',
      message: 'Se precisar, terá de acrescentar novamente os produtos ao carrinho.',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: () => {
            this.securityService.removeName('cart').then(() => {
              this.router.navigateByUrl('tabs/tab1');
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  deleteItem(item: any) {
    const index = this.cart.findIndex((cartItem: { product: any; }) => cartItem.product === item.product);

    if (index !== -1) {
      this.cart.splice(index, 1);

      // Atualize os dados do carrinho após a exclusão
      this.securityService.setName('cart', JSON.stringify(this.cart)).then(() => {
        // Atualize a exibição do carrinho
        this.checkCart();
      });
    }
  }

  payMbway() {
    this.alertController.create({
      header: 'Pagar com MBWAY',
      subHeader: 'Introduza o seu número de telemóvel',
      message: 'O processo continuará na APP MBWAY',
      backdropDismiss: false,
      inputs: [
        {
          name: 'celphone',
          placeholder: 'Número de telemóvel',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Continuar',
          handler: (d) => {
            this.loadingController.create().then((loading) => {
              loading.present();
              let data = {
                access_token: this.access_token,
                product_id: this.product_id,
                price: this.price,
                user_id: this.user.id,
                total: this.totalAmountWithDelivery,
                qty: this.qty,
                cart: JSON.stringify(this.cart),
                celphone: d.celphone,
                method: 'mbway',
                delivery: this.company.shop_company.delivery_company,
                delivery_value: this.delivery_value
              }
              this.securityService.ifthenPayments(data).subscribe((resp) => {
                loading.dismiss();
                this.alertController.create({
                  header: 'Verifique o seu telemóvel',
                  message: 'A operação continuará na APP MBWAY.',
                  buttons: [
                    {
                      text: 'Ok',
                      handler: () => {
                        this.securityService.removeName('cart').then(() => {
                          this.router.navigateByUrl('tabs/tab2');
                        });

                      }
                    }
                  ]
                }).then((alert) => {
                  alert.present();
                })
              });
            });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  paySimpleMbway() {
    this.alertController.create({
      header: 'Pagamento MBWAY',
      subHeader: 'Pode fazer pagamento para o número de telefone abaixo.',
      message: this.company.ifthen_pay.simple_mbway_number,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Paguei ou vou pagar',
          handler: () => {
            this.order('simple mbway');
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  payMb() {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        product_id: this.product_id,
        price: this.price,
        user_id: this.user.id,
        total: this.totalAmountWithDelivery,
        qty: this.qty,
        cart: JSON.stringify(this.cart),
        method: 'multibanco',
        delivery: this.company.shop_company.delivery_company,
        delivery_value: this.delivery_value
      }
      this.securityService.ifthenPayments(data).subscribe((resp: any) => {
        loading.dismiss();
        this.alertController.create({
          header: 'Referência multibanco',
          subHeader: 'A referência também foi enviada para o seu email.',
          inputs: [
            {
              label: 'Entidade',
              value: resp.Entity,
              disabled: true
            },
            {
              label: 'Referência',
              value: resp.Reference,
              disabled: true
            },
            {
              label: 'Valor',
              value: resp.Amount + ' €',
              disabled: true
            }
          ],
          backdropDismiss: false,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.securityService.removeName('cart').then(() => {
                  this.router.navigateByUrl('tabs/tab2');
                });
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
        console.log(resp);
      });
    });
  }

  order(method: string) {
    this.loadingController.create().then((loading) => {
      loading.present();
      let data = {
        access_token: this.access_token,
        product_id: this.product_id,
        price: this.price,
        user_id: this.user.id,
        total: this.totalAmount,
        qty: this.qty,
        cart: JSON.stringify(this.cart),
        method: method,
        delivery: this.company.shop_company.delivery_company,
        delivery_value: this.delivery_value
      }
      this.securityService.order(data).subscribe((resp) => {
        loading.dismiss();
        this.alertController.create({
          header: 'Encomenda realizada com sucesso',
          message: 'Será contactado brevemente para pagamento e entrega.',
          backdropDismiss: false,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.securityService.removeName('cart').then(() => {
                  this.router.navigateByUrl('tabs/tab2');
                });

              }
            }
          ]
        }).then((alert) => {
          alert.present();
        })
      });
    });
  }

}
