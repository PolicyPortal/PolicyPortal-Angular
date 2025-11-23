import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MENU_ITEMS_ADMIN, MENU_ITEMS_DEALER } from '../constants/menu.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly TOKEN_EXPIRATION_KEY = 'tokenExpiration';
  private readonly USER_DATA_KEY = 'userData';
  private serviceApiUrl = `${environment.apiUrl}/auth`;

  private menuItemsSource = new BehaviorSubject<any[]>([]);
  public menuItems$ = this.menuItemsSource.asObservable();

  constructor(private router: Router, private http: HttpClient) {
    // This will correctly load the menu if the user is already logged in (e.g., after a refresh)
    this.loadMenuForCurrentUser();
  }

  isLoggedIn(): boolean {
    debugger;
    const token = localStorage.getItem(this.TOKEN_KEY);
    // if the token is expired, consider the user as logged out
    if (token) {
      const expiration = localStorage.getItem(this.TOKEN_EXPIRATION_KEY);
      console.log('Token expiration from localStorage:', expiration);



      if( expiration === null ||expiration === "undefined" || expiration === undefined) 
      {
        this.logout();
        localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
          localStorage.removeItem(this.USER_DATA_KEY);
        return false;
      }
      else {
        const now = Date.now();
        const expiresAt = parseInt(expiration!, 10);

        console.log('now:', now);
        console.log('Expiration time:', expiresAt);

        console.log('Current time:', now);
        console.log('Token expiration time:', expiresAt);

        if (now >= expiresAt) {
          // Token has expired
          this.logout(); // Optionally log out the user
          localStorage.removeItem(this.TOKEN_KEY);
          localStorage.removeItem(this.TOKEN_EXPIRATION_KEY);
          localStorage.removeItem(this.USER_DATA_KEY);

          return false;
        }
      }

      
    } 
    else {
      console.log('No token found in localStorage.');
    }

    return !!token;
  }

  // register(userData: any): Observable<any> {
  //   return this.http.post(`${this.serviceApiUrl}/register`, userData);
  // }

  //   addDealer(dealerData: any): Observable<any> {
  //   return this.http.post(`${this.serviceApiUrl}/register`, dealerData);
  // }
  addDealer(dealerData: FormData): Observable<any> {
    console.log('Dealer Data being sent:', dealerData.getAll(''));
    return this.http.post(`${this.serviceApiUrl}/register`, dealerData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.serviceApiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        if (response && response.token) {
          // 1. Store the token and user data
          localStorage.setItem(this.TOKEN_KEY, response.token.token);
          localStorage.setItem(this.TOKEN_EXPIRATION_KEY, response.token.tokenExpiresAt);
          localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(response.token.userDetails));

          console.log('Login response:', response);
          console.log('Stored token:', response.token.token);
          console.log('TOKEN_EXPIRATION_KEY', response.token.tokenExpiresAt);
          // --- FIX 1: UPDATE THE MENU RIGHT AFTER LOGIN ---
          // This tells the rest of the application that the menu has changed.
          this.loadMenuForCurrentUser();

          // 2. Redirect to the correct dashboard
          this.redirectToDashboard();
        }
      })
    );
  }


  getDealerId(): number {
    const userData = this.getUserData();
    console.log('User Data in getDealerId():', userData);
    return userData.id;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA_KEY);
    
    // --- FIX 2: CLEAR THE MENU ON LOGOUT ---
    this.menuItemsSource.next([]); 

    this.router.navigate(['/app/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUserData(): any | null {
    const userData = localStorage.getItem(this.USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole(): string | null {
    const userData = this.getUserData();
    return userData ? userData.role : null;
  }

  redirectToDashboard(): void {
    const role = this.getUserRole();
    if (role === 'Admin') {
      this.router.navigate(['/app/admin-dashboard']);
    } else if (role === 'Dealer') {
      this.router.navigate(['/app/dashboard']);
    } else {
      // Fallback if role is not found, which can happen right after login
      // if the logic is not perfectly timed.
      this.router.navigate(['/app/unauthorized']);
    }
  }
  
  private loadMenuForCurrentUser(): void {
    const role = this.getUserRole();
    let menu: any[] = [];
    if (role === 'Admin') {
      menu = MENU_ITEMS_ADMIN;
    } else if (role === 'Dealer') {
      menu = MENU_ITEMS_DEALER;
    }
    this.menuItemsSource.next(menu);
  }
}