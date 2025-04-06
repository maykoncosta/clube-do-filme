import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private router: Router) {}

  login(email: string, password: string): Promise<void> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then(() => {
        this.router.navigate(['/home']);
      });
  }

  signUp(email: string, password: string, username: string): void {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          updateProfile(user, { displayName: username })
            .then(() => {
              this.router.navigate(['/home']);
            });
        }
      })
      .catch((error) => {
        console.error(error.message);
        alert('Erro ao criar a conta.');
      });

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log(user.displayName); // Nome do usuário
      }
    });
  }

  isAuthenticated(): Observable<User | null> {
    return new Observable((observer) => {
      return onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
    });
  }

  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  getCurrentUser(): Promise<User | null> {
    return Promise.resolve(this.auth.currentUser);
  }
}
