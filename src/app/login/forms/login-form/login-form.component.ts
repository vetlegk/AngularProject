import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="form-header">Login</h2>
    <form class="input-form" [formGroup]="loginForm" (submit)="submitLogin()">
      <input type="email" formControlName="email" placeholder="email:" />
      <input type="password" formControlName="password" placeholder="password:" />

      <div class="button-group">
        <button class="primary" type="submit">Log In</button>
        <button class="primary" type="button" (click)="setRegisterForm.emit()">Register Account ?</button>
      </div>
    </form>
  `,
  styleUrls: ['../../login.component.css']
})

export class LoginFormComponent {
  @Output() setRegisterForm = new EventEmitter<void>();
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  email = new FormControl('');
  password = new FormControl('');

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor() {}

  async submitLogin() {
    const email = this.loginForm.get('email')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    const isSuccessful = await this.authService.login(email, password);

    if (isSuccessful) {
      this.router.navigate(['/homes']);
      return;
    }

    this.loginForm.reset();
    alert('Login failed: Invalid email or password.');
  }
}
