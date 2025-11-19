import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private authTokenSubject = new BehaviorSubject<string>('');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  authToken$ = this.authTokenSubject.asObservable();

  private url = "http://localhost:3000/users";
  router = inject(Router);

  constructor() { 
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);

    const storedToken = localStorage.getItem('authToken');

    if (storedToken && storedToken !== '') {
      this.authTokenSubject.next(storedToken);
      return;
    }

    localStorage.setItem('authToken', '');
  }

  async login(email: string, password: string): Promise<boolean> {
    const isLoginSuccess = await this.checkUserCredentials(email, password);

    if (isLoginSuccess) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      this.isLoggedInSubject.next(true);
      this.authTokenSubject.next(email);
      return true;
    }
    return false;
  }

  logout(): boolean {
    this.isLoggedInSubject.next(false);
    this.authTokenSubject.next('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    
    return true;
  }

  async checkUserCredentials(email: string, password: string): Promise<boolean> {
    const res = await fetch(`${this.url}?email=${email}&password=${password}`);
    const data = await res.json();

    if (data && data.length > 0) {
      return true;
    }
    return false;
  }
}
