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
    <section>
      <h1>
        Welcome to the <span>Homes</span> application!
      </h1>
      <section>
        <h2>Login</h2>
        <form [formGroup]="loginForm" (submit)="submitLogin()">
          <label for="email">Email:</label>
          <input id="email" type="email" formControlName="email" />

          <label for="password">Password:</label>
          <input id="password" type="password" formControlName="password" />

          <button type="submit">Log In</button>
        </form>
      </section>
    </section>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  isLoggedIn$ = this.authService.isLoggedIn$;

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
    }
  }
}
