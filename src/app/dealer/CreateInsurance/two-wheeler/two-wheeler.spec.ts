import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheeler } from './two-wheeler';

describe('TwoWheeler', () => {
  let component: TwoWheeler;
  let fixture: ComponentFixture<TwoWheeler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheeler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheeler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
