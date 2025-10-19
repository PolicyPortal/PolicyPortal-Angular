import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

describe('FormBuilder', () => {
  let component: FormBuilder;
  let fixture: ComponentFixture<FormBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormBuilder);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
