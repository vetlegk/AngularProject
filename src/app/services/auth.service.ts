import { inject, Injectable } from '@angular/core';
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
    if (isLoggedIn) {
      this.isLoggedInSubject.next(isLoggedIn);

      const storedToken = localStorage.getItem('authToken');
      if (storedToken && storedToken !== '') {
        this.authTokenSubject.next(storedToken);
      }
      return;
    }

    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('authToken', ''); 
  }

  async login(email: string, password: string): Promise<boolean> {
    return await this.checkUserCredentials(email, password).then( isSuccessful => {
      if (isSuccessful) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('authToken', email); // Using email as a simple token
        this.isLoggedInSubject.next(true);
        this.authTokenSubject.next(email);
        return true;
      }
      return false;
    })
  }

  logout(): boolean {
    this.isLoggedInSubject.next(false);
    this.authTokenSubject.next('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    
    return true;
  }

  async register(email: string, password: string): Promise<boolean> {
    const id = crypto.randomUUID();
    const res = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, email, password })
    });
    
    if (res.ok) {
      return this.login(email, password);
    }
    return false;
  }

  async checkUserCredentials(email: string, password: string): Promise<boolean> {
    const res = await fetch(`${this.url}?email=${email}&password=${password}`);

    return await res.json().then(data => {
      if (data.length > 0 && data[0].email === email && data[0].password === password) {      
        return true;
      }
      return false;
    });
  }
}
