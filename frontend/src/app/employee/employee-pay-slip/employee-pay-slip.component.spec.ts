import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePaySlipComponent } from './employee-pay-slip.component';

describe('EmployeePaySlipComponent', () => {
  let component: EmployeePaySlipComponent;
  let fixture: ComponentFixture<EmployeePaySlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePaySlipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePaySlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
