import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialInsurance } from './commercial-insurance';

describe('CommercialInsurance', () => {
  let component: CommercialInsurance;
  let fixture: ComponentFixture<CommercialInsurance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialInsurance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialInsurance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
