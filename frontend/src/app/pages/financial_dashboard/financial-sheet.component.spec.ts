import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialSheetComponent } from './financial-sheet.component';

describe('FinancialSheetComponent', () => {
  let component: FinancialSheetComponent;
  let fixture: ComponentFixture<FinancialSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
