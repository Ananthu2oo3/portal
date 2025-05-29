import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialInvoiceComponent } from './financial-invoice.component';

describe('FinancialInvoiceComponent', () => {
  let component: FinancialInvoiceComponent;
  let fixture: ComponentFixture<FinancialInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
