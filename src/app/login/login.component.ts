import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
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
        <app-login-form *ngIf="!isRegistering" (setRegisterForm)="toggleRegisterForm()">></app-login-form>
        <app-register-form *ngIf="isRegistering" (setLoginForm)="toggleRegisterForm()">></app-register-form>
      </section>
    </main>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router = inject(Router);
  isRegistering = false;

  constructor() { 
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/homes']);
      }
    }).unsubscribe();
  }

  toggleRegisterForm = () => {
    this.isRegistering = !this.isRegistering;
  }
}
