import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MonthPage } from './month.page';

describe('MonthPage', () => {
  let component: MonthPage;
  let fixture: ComponentFixture<MonthPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MonthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
