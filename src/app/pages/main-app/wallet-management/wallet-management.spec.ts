import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletManagement } from './wallet-management';

describe('WalletManagement', () => {
  let component: WalletManagement;
  let fixture: ComponentFixture<WalletManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
