import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/Services/auth.service';
@Component({
  selector: 'app-login',
  imports: [FormsModule, NgClass, CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class Login implements OnInit {
  email: string = '';
  password: string = '';
  error: string | null = null;
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    // Optional: Check if the user is already logged in on component load
    if (this.authService.isLoggedIn()) {
      this.authService.redirectToDashboard();
    }
  }


  onLogin(): void {
    this.loading = true;
    this.error = null;

    const credentials = { email: this.email, password: this.password };
    
    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // The navigation is now handled by the AuthService
      },
      error: (err) => {
        this.error = 'Invalid email or password. Please try again.';
        this.loading = false;
        console.error('Login error', err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
}
