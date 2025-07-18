import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private setAuthData(response: any) {
    localStorage.setItem('currentUser', JSON.stringify(response.usuario));
    localStorage.setItem('token', response.token);
    this.currentUserSubject.next(response.usuario);
  }

  login(email: string, senha: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((response: any) => {
        if (response.success) {
          this.setAuthData(response);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue() {
    return this.currentUserSubject.value;
  }

  get token() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.token;
  }
}
