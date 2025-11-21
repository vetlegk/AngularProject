import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from '../../login.component';
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
        <button class="primary" type="button" (click)="toggleRegisterForm()">Register</button>
      </div>
    </form>
  `,
  styleUrls: ['../../login.component.css']
})
export class LoginFormComponent {
  authService: AuthService = inject(AuthService);
  loginComponent: LoginComponent = inject(LoginComponent);
  router = inject(Router);

  email = new FormControl('');
  password = new FormControl('');

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  toggleRegisterForm() {
    this.loginComponent.toggleRegisterForm();
  }

  async submitLogin() {
    const email = this.loginForm.get('email')?.value || '';
    const password = this.loginForm.get('password')?.value || '';
    await this.authService.login(email, password).then(isSuccessful => {
      if (isSuccessful) {
      this.router.navigate(['/homes']);
      return;
    }
    } );

    this.loginForm.reset();
    alert('Login failed: Invalid email or password.');
  }
}
