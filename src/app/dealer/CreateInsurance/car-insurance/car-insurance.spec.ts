import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarInsurance } from './car-insurance';

describe('CarInsurance', () => {
  let component: CarInsurance;
  let fixture: ComponentFixture<CarInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarInsurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
