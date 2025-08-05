import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  // Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Obtener roles requeridos de la ruta
  const requiredRoles = route.data?.['roles'] as string[];
  
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene alguno de los roles requeridos
  const userRoles = authService.getUserRoles();
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (hasRole) {
    return true;
  } else {
    router.navigate(['/unauthorized']);
    return false;
  }
};
