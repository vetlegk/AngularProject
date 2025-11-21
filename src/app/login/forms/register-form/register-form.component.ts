import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LoginComponent } from '../../login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <h2 class="form-header">Register</h2>
    <form class="input-form" [formGroup]="registerForm" (submit)="submitRegister()">
      <input type="email" formControlName="email" placeholder="email:" />
      <input type="password" formControlName="password" placeholder="password:" />
      <input type="password" formControlName="confirmPassword" placeholder="confirm password:" />

      <div class="button-group">
        <button class="primary" type="submit">Confirm</button>
        <button class="primary" type="button" (click)="toggleRegisterForm()">Existing Account ?</button>
      </div>
    </form>
  `,
  styleUrls: ['../../login.component.css']
})
export class RegisterFormComponent {
  authService: AuthService = inject(AuthService);
  loginComponent: LoginComponent = inject(LoginComponent);
  router = inject(Router);
  isRegistering = this.loginComponent.isRegistering$;

  email = new FormControl('');
  password = new FormControl('');
  confirmPassword = new FormControl('');

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });

  toggleRegisterForm() {
    this.loginComponent.toggleRegisterForm();
  }

  async submitRegister() {
    const email = this.registerForm.get('email')?.value || '';
    const password = this.registerForm.get('password')?.value || '';
    const confirmPassword = this.registerForm.get('confirmPassword')?.value || '';
    
    if (password == confirmPassword) { 
      return await this.authService.register(email, password).then(isSuccessful => {
        if (isSuccessful) {
          this.router.navigate(['/homes']);
        }
      });
    };
    
    this.registerForm.reset();
    alert('Registration failed: Passwords do not match.');
  }
}
