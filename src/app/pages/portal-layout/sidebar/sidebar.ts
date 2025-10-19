import { Component, signal, inject, OnDestroy } from '@angular/core';
import { OverlayscrollbarsModule } from "overlayscrollbars-ngx";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { AuthService } from '../../../core/Services/auth.service';
import { Subscription } from 'rxjs';
import { MenuItem } from '../../../core/models/menu-item.interface';

@Component({
  selector: 'app-sidebar',
  standalone: true, // Make sure component is standalone
  imports: [OverlayscrollbarsModule, RouterLink, RouterLinkActive, NgClass, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnDestroy {
  // Use inject() for modern, constructor-less dependency injection
  private authService = inject(AuthService);
  private menuSubscription: Subscription;

  // The signal will be updated by the subscription
  menuItems = signal<MenuItem[]>([]);
  activeMenu = signal<string | null>(null);

  constructor() {
    // Subscribe to the observable from the AuthService
    this.menuSubscription = this.authService.menuItems$.subscribe(items => {
      console.log('Sidebar received new menu items:', items);
      // When new items are broadcast, update the signal
      this.menuItems.set(items);
    });
  }

  // Best practice: Unsubscribe when the component is destroyed to prevent memory leaks
  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
  }

  toggleSubmenu(label: string | undefined) {
    if (!label) return;
    this.activeMenu.set(this.activeMenu() === label ? null : label);
  }
}

