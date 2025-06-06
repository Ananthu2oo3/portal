import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorQuotationRequestComponent } from './vendor-quotation-request.component';

describe('VendorQuotationRequestComponent', () => {
  let component: VendorQuotationRequestComponent;
  let fixture: ComponentFixture<VendorQuotationRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorQuotationRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorQuotationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
