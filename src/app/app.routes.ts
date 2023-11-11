import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'companies/:category_id',
    loadComponent: () => import('./companies/companies.page').then( m => m.CompaniesPage)
  },
  {
    path: 'categories/:id',
    loadComponent: () => import('./categories/categories.page').then( m => m.CategoriesPage)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./product/product.page').then( m => m.ProductPage)
  },
  {
    path: 'company/:id',
    loadComponent: () => import('./company/company.page').then( m => m.CompanyPage)
  },
  {
    path: 'service/:id',
    loadComponent: () => import('./service/service.page').then( m => m.ServicePage)
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create.page').then( m => m.CreatePage)
  },
  {
    path: 'month/:id',
    loadComponent: () => import('./calendar/month/month.page').then( m => m.MonthPage)
  },
  {
    path: 'day/:id/:date',
    loadComponent: () => import('./calendar/day/day.page').then( m => m.DayPage)
  },
  {
    path: 'service-checkout',
    loadComponent: () => import('./checkout/service-checkout/service-checkout.page').then( m => m.ServiceCheckoutPage)
  },
  {
    path: 'product-checkout',
    loadComponent: () => import('./checkout/product-checkout/product-checkout.page').then( m => m.ProductCheckoutPage)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./checkout/checkout/checkout.page').then( m => m.CheckoutPage)
  },
  {
    path: 'cart',
    loadComponent: () => import('./cart/cart.page').then( m => m.CartPage)
  },
];
