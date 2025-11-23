import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private userDataSubject = new BehaviorSubject<User | null>(null);

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  userData$ = this.userDataSubject.asObservable();

  private url = "http://localhost:3000/users";
  router = inject(Router);

  constructor() { 
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      this.isLoggedInSubject.next(isLoggedIn);

      const storedUserData = localStorage.getItem('userData');
      if (storedUserData && storedUserData !== '') {
        try {
          const data = JSON.parse(storedUserData);
          this.userDataSubject.next(data);

        } catch (error) {
          console.error("\nFailed to parse user data from local storage.\n")
        }
      }
      return;
    }

    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('userData', ''); 
  }

  async login(email: string, password: string): Promise<boolean> {
    const userData =  await this.checkUserCredentials(email, password)

    if (userData) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(userData));
      this.isLoggedInSubject.next(true);
      this.userDataSubject.next(userData)
      return true;
    }
    return false;
  }

  logout(): boolean {
    this.isLoggedInSubject.next(false);
    this.userDataSubject.next(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    
    return true;
  }

  async register(email: string, password: string): Promise<boolean> {
    const id = crypto.randomUUID(); // This will practically always return a unique number.

    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, email, password })
      });
      
      if (!res.ok) {
        throw new Error(`Error rgistering new user: ${res.status}`);
      };

      return this.login(email, password) ?? false;

    } catch (error) {
      console.log("Error when regisering new user: ", error);
      return false;
    }
  }

  async checkUserCredentials(email: string, password: string): Promise<{id: string, email: string} | null> {
    try {
      const res = await fetch(`${this.url}?email=${email}&password=${password}`);

      if (!res.ok) {
        throw new Error(`Error fetcing from database: ${res.status}`);
      }

      const data = await res.json();
      if (data && data.length > 0 && data[0].email === email && data[0].password === password) {      
        return { id: data[0].id, email: data[0].email };
      }

      return null;
    } catch (error) {

      console.error("\nError when checking user credentials: ", error);
      return null;
    }
  }
}
