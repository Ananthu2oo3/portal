import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialVendorInnvoiceComponent } from './financial-vendor-innvoice.component';

describe('FinancialVendorInnvoiceComponent', () => {
  let component: FinancialVendorInnvoiceComponent;
  let fixture: ComponentFixture<FinancialVendorInnvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialVendorInnvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialVendorInnvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
