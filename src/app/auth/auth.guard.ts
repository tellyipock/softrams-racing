import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      // go to login if not authenticated
      if (!this.isLoggedIn()) {
        this.router.navigate(['/login']);
        return false;
      }
    return true;
  }

  isLoggedIn(): string | undefined {
    return localStorage.getItem('username');
  }
}
