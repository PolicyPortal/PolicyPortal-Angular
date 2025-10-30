import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Commercials } from './commercials';

describe('Commercials', () => {
  let component: Commercials;
  let fixture: ComponentFixture<Commercials>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Commercials]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Commercials);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
