import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.router.navigate(['/home']);
          observer.next(false);
        } else {
          observer.next(true);
        }
        observer.complete();
      });

      // Clean up the subscription
      return { unsubscribe };
    });
  }
}
