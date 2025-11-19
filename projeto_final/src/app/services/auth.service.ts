import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    JSON.parse(localStorage.getItem('isLoggedIn') || 'false')
  );
  private currentUserSubject = new BehaviorSubject<string>(
    localStorage.getItem('currentUser') || ''
  );

  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    if (username === 'filipe@gmail.com' && password === '123456') {
      this.isLoggedInSubject.next(true);
      this.currentUserSubject.next('ADM');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', 'ADM');
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get user$(): Observable<string> {
    return this.currentUserSubject.asObservable();
  }

  get user(): string {
    return this.currentUserSubject.value;
  }
}
