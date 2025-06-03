import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialPaymentAgingComponent } from './financial-payment-aging.component';

describe('FinancialPaymentAgingComponent', () => {
  let component: FinancialPaymentAgingComponent;
  let fixture: ComponentFixture<FinancialPaymentAgingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialPaymentAgingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialPaymentAgingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
