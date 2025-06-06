import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorPurchaseOrderComponent } from './vendor-purchase-order.component';

describe('VendorPurchaseOrderComponent', () => {
  let component: VendorPurchaseOrderComponent;
  let fixture: ComponentFixture<VendorPurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorPurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
