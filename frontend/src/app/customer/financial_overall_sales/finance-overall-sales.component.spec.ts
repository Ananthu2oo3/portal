import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceOverallSalesComponent } from './finance-overall-sales.component';

describe('FinanceOverallSalesComponent', () => {
  let component: FinanceOverallSalesComponent;
  let fixture: ComponentFixture<FinanceOverallSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceOverallSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceOverallSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
