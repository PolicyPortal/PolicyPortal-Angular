import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInsurance } from './select-insurance';

describe('SelectInsurance', () => {
  let component: SelectInsurance;
  let fixture: ComponentFixture<SelectInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectInsurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
