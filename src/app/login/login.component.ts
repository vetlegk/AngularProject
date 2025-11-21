import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { RegisterFormComponent } from "./forms/register-form/register-form.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterFormComponent],
  template: `
    <main>
        <header>
          <img class="logo" src="assets/logo.svg" alt="logo" />
          <p><i>Find your forever home!</i></p>
        </header>
      <section class="login-section">
        <app-login-form *ngIf="!( isRegistering$ | async )"></app-login-form>
        <app-register-form *ngIf="isRegistering$ | async"></app-register-form>
      </section>
    </main>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private isRegisteringSubject = new BehaviorSubject<boolean>(false);
  isRegistering$ = this.isRegisteringSubject.asObservable();

  authService: AuthService = inject(AuthService);
  router = inject(Router);

  toggleRegisterForm = () => {
    this.isRegisteringSubject.next(!this.isRegisteringSubject.value);
  }

  constructor() { 
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/homes']);
      }
    }).unsubscribe();
  }
}
