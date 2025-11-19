import { Component, inject } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <main>
      <header *ngIf="isLoggedIn$ | async">
          <img class="logo" src="assets/logo.svg" alt="logo" />
          <p *ngIf="userEmail$ | async as userEmail" class="alert-text">Logged in as: {{userEmail}}</p>
          <p *ngIf="showAlert">{{alertText}}</p>
          <button type="button" class="primary" (click)="logout()">Logout</button>
      </header>

      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, RouterModule],
})

export class AppComponent {
  authService: AuthService = inject(AuthService);
  router = inject(Router);

  title = 'homes';
  showAlert = false;
  alertText = '';

  isLoggedIn$ = this.authService.isLoggedIn$
  userEmail$ = this.authService.userEmail$

  constructor() {};

  logout() {
    if (this.authService.logout()) {
      this.router.navigate([''])
    };
  }

  login() {
    if (this.isLoggedIn$) {
      this.setAlert('');
      this.router.navigate(['/homes']);

    } else {
      this.setAlert('Please log in to continue.')
      this.router.navigate(['']);
    }
  }

  setAlert(message: string) {
    if (message != '') {
      this.alertText = message;
      this.showAlert = true;
      return;
    } 

    this.alertText
    this.showAlert = false;
  }
}
