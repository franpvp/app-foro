import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const userRol = localStorage.getItem('userRol');

      const target = route.routeConfig?.path;

      if (!token || !userId) {
        this.router.navigate(['/login']);
        return false;
      }

      if (target === 'admin') {
        if (userRol === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }

      return true;
  }
}
