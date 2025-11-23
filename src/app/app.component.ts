import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <main>
      <header *ngIf="authService.isLoggedIn$ | async">
          <img class="logo" src="assets/logo.svg" alt="logo" />
          <p *ngIf="authService.userData$ | async as userData" class="alert-text">Logged in as: {{userData.email}}</p>
          <p *ngIf="showAlert">{{alertText}}</p>
          <button type="button" class="primary" (click)="logout()">Logout</button>
      </header>

      <section>
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

  showAlert = false;
  alertText = '';

  constructor() {}

  logout() {
    if (this.authService.logout()) {
      this.router.navigate([''])
    };
  }

  setAlert(message: string) {
    if (message != '') {
      this.alertText = message;
      this.showAlert = true;
      return;
    };

    this.alertText = message;
    this.showAlert = false;
  }
}
