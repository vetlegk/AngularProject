import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main>
        <header>
          <img class="logo" src="assets/logo.svg" alt="logo" />
          <p><i>Your next home awaits!</i></p>
        </header>
      <section class="login-section">
        <h2>Login</h2>
        <form class="login-form" [formGroup]="loginForm" (submit)="submitLogin()">
          <input id="email" type="email" formControlName="email" placeholder="Email:" />
          <input id="password" type="password" formControlName="password" placeholder="Password:" />

          <div class="button-group">
            <button class="primary" type="submit">Log In</button>
            <button class="primary" type="submit">Register</button>
          </div>
        </form>
      </section>
    </main>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  email = new FormControl('');
  password = new FormControl('');
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() { 
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/homes']);
      }
    }).unsubscribe();
  }

  async submitLogin() {
    const email = this.loginForm.get('email')?.value || '';
    const password = this.loginForm.get('password')?.value || '';
    const success = await this.authService.login(email, password);

    if (success) {
      this.router.navigate(['/homes']);
      return;
    }
    alert('Login failed: Invalid email or password.');
  }
}
