import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWheelerFormbuilder } from './two-wheeler-formbuilder';

describe('TwoWheelerFormbuilder', () => {
  let component: TwoWheelerFormbuilder;
  let fixture: ComponentFixture<TwoWheelerFormbuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoWheelerFormbuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoWheelerFormbuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
