import { inject, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userEmailSubject = new BehaviorSubject<string>('');

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userEmail$ = this.userEmailSubject.asObservable();

  private url = "http://localhost:3000/users";
  router = inject(Router);

  constructor() { 
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject.next(isLoggedIn);

    const storedEmail = localStorage.getItem('userEmail');

    if (storedEmail && storedEmail !== '') {
      this.userEmailSubject.next(storedEmail);
      return;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    const isLoginSuccess = await this.checkUserCredentials(email, password);

    if (isLoginSuccess) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      this.isLoggedInSubject.next(true);
      this.userEmailSubject.next(email);
      return true;
    }

    alert('Invalid email or password');
    return false;
  }

  logout(): boolean {
    this.isLoggedInSubject.next(false);
    this.userEmailSubject.next('');
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
