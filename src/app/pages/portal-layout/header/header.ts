import { NgClass } from '@angular/common';
import { Component, OnInit, signal, Signal } from '@angular/core';
import { AuthService } from '../../../core/Services/auth.service';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  user: any;

  constructor(private authService: AuthService) { }

  isNotificationsDropdownOpen = signal<boolean>(false); // Signal to manage the state of the notifications dropdown
  isProfileDropdownOpen = signal<boolean>(false); // Signal to manage the state of the profile dropdown

  ngOnInit(): void {
        this.user = this.authService.getUserData();
        console.log('User data:', this.user);
  }

  toggleNotificationsDropdown() {
      this.isProfileDropdownOpen.set(false); // Close profile dropdown when notifications are toggled
      this.isNotificationsDropdownOpen.set(!this.isNotificationsDropdownOpen()); 
  }

  toggleProfileDropdown() {
    this.isNotificationsDropdownOpen.set(false);
    this.isProfileDropdownOpen.set(!this.isProfileDropdownOpen());
  }

  toggleSidebar() {
    document.body.classList.toggle('sidebar-collapse'); // Toggle the sidebar collapse class on the body element
    document.body.classList.toggle('sidebar-open'); // Toggle the sidebar open class on the body element
  }
 

  onLogout(): void {
    this.authService.logout();
  }
}
