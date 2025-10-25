import { NgClass } from '@angular/common';
import { Component, HostListener, OnInit, signal, Signal } from '@angular/core';
import { AuthService } from '../../../core/Services/auth.service';
import { WalletService } from '../../../core/Services/wallet.service';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {

  walletBalance = 0;
  user: any;

  constructor(private authService: AuthService, private walletService: WalletService) { }

  fetchBalance() {
    console.log('Fetching wallet balance');
    this.walletService.getBalance().subscribe({
      next: res => {
        console.log('res', res);
        this.walletBalance = res.balance;
      },
      error: () => this.walletBalance = 0,
    });
  }
  // Signals to manage dropdown states
  isProfileDropdownOpen = signal(false);
  isNotificationsDropdownOpen = signal(false);

  ngOnInit(): void {
        this.user = this.authService.getUserData();
        console.log('User data:', this.user);
  }

  toggleProfileDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isProfileDropdownOpen.update(value => !value);
    this.isNotificationsDropdownOpen.set(false); // Close other dropdown
  }

  toggleNotificationsDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isNotificationsDropdownOpen.update(value => !value);
    this.isProfileDropdownOpen.set(false); // Close other dropdown
  }
  
  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse');
    document.body.classList.toggle('sidebar-open');
  }

  onLogout(): void {
    this.authService.logout();
  }

    @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isProfileDropdownOpen.set(false);
    this.isNotificationsDropdownOpen.set(false);
  }
}
