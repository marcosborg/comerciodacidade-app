import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(
    private http: HttpClient
  ) { }

  async setName(key: string, name: string) {
    await Preferences.set({
      key: key,
      value: name,
    });
  };

  async checkName(key: string) {
    return await Preferences.get({ key: key });
  };

  async removeName(key: string) {
    await Preferences.remove({ key: key });
  };

  //url: string = 'https://comerciodacidade.pt/api/';
  url: string = 'http://127.0.0.1:8000/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Accept-Language': 'pt'
    })
  };

  askForDelete(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    };
    return this.http.post(this.url + 'v1/users/ask-for-delete', data, httpOptions);
  }

  login(data: any) {
    return this.http.post(this.url + 'login', data, this.httpOptions);
  }

  register(data: any) {
    return this.http.post(this.url + 'register', data, this.httpOptions);
  }

  shopCategories() {
    return this.http.get(this.url + 'shop-categories');
  }

  companiesByCategory(data: any) {
    return this.http.get(this.url + 'companiesByCategory/' + data.category_id);
  }

  categoriesByCompany(data: any) {
    return this.http.get(this.url + 'categoriesByCompany/' + data.id);
  }

  companyById(data: any) {
    return this.http.get(this.url + 'companies/' + data.id);
  }

  companyByProductCategory(data: any) {
    return this.http.get(this.url + 'companyByProductCategory/' + data.id);
  }

  shopProductsByCategoryProduct(data: any) {
    return this.http.get(this.url + 'shopProductsByCategoryProduct/' + data.id);
  }

  shopServicesByCategoryProduct(data: any) {
    return this.http.get(this.url + 'shopServicesByCategoryProduct/' + data.id);
  }

  productById(data: any) {
    return this.http.get(this.url + 'shop-products/' + data.id);
  }

  serviceById(data: any) {
    return this.http.get(this.url + 'services/' + data.id);
  }

  shopProductSubCategoryByCategoryId(data: any) {
    return this.http.get(this.url + 'shop-product-sub-category-by-category-id/' + data.id);
  }

  shopProductsBySubcategoryProduct(data: any) {
    return this.http.get(this.url + 'shopProductsBySubcategoryProduct/' + data.id);
  }

  shopServicesBySubcategoryProduct(data: any) {
    return this.http.get(this.url + 'shopServicesBySubcategoryProduct/' + data.id);
  }

  paginatedModel(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    };
    return this.http.get(data.url, httpOptions);
  }

  randomShopProducts() {
    return this.http.get(this.url + 'randomShopProducts');
  }

  randomServices() {
    return this.http.get(this.url + 'randomServices');
  }

  serviceEmployeeSchedules(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'v1/serviceEmployeeSchedules', data, httpOptions);
  }

  serviceEmployee(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/service-employees/' + data.id, httpOptions);
  }

  pages(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/pages', httpOptions);
  }

  saveSchedule(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'v1/saveSchedule', data, httpOptions);
  }

  lastPurchases(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/last-purchases', httpOptions);
  }

  user(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/users/user', httpOptions);
  }

  countries(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/countries', httpOptions);
  }

  userUpdate(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'v1/users/update', data, httpOptions);
  }

  search(data: any) {
    return this.http.post(this.url + 'search', data);
  }

  orderProduct(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'v1/order-product', data, httpOptions);
  }

  productVariationById(data: any) {
    return this.http.get(this.url + 'shop-product-variations/' + data.id);
  }

  schedule(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/shop-schedules/' + data.id, httpOptions);
  }

  deleteSchedule(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/delete-schedule/' + data.id, httpOptions);
  }

  purchase(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/purchases/' + data.id, httpOptions);
  }

  deletePurchase(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.get(this.url + 'v1/delete-purchase/' + data.id, httpOptions);
  }

  order(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'orders/order', data, httpOptions);
  }

  ifthenPayments(data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + data.access_token
      })
    }
    return this.http.post(this.url + 'orders/ifthen-payments', data, httpOptions);
  }

}
