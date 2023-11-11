import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceCheckoutPage } from './service-checkout.page';

describe('ServiceCheckoutPage', () => {
  let component: ServiceCheckoutPage;
  let fixture: ComponentFixture<ServiceCheckoutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServiceCheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
