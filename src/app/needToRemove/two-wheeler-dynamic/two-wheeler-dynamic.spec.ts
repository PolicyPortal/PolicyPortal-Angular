import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelerDynamic } from './two-wheeler-dynamic';

describe('TwoWheelerDynamic', () => {
  let component: TwoWheelerDynamic;
  let fixture: ComponentFixture<TwoWheelerDynamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelerDynamic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelerDynamic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
