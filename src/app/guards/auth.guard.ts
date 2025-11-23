import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = await firstValueFrom(authService.isLoggedIn$);
  if (isLoggedIn == false) {
    router.navigate(["/"])
    return false;
  }

  return true;
};
