import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormManagement } from './form-management';

describe('FormManagement', () => {
  let component: FormManagement;
  let fixture: ComponentFixture<FormManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
