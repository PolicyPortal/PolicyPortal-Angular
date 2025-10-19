import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsManagement } from './tickets-management';

describe('TicketsManagement', () => {
  let component: TicketsManagement;
  let fixture: ComponentFixture<TicketsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
