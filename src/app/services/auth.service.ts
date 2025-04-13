import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `http://localhost:8081/api/v1/auth`;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string, username: string, userId: number }>(
      `${this.baseUrl}/login`,
      { username, password }
    ).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        localStorage.setItem('userId', response.userId.toString());
      })
    );
  }

  logout(username: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout?username=${username}`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
        })
      );
  }

  checkLoginStatus(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/estado/${id}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUsername(): string | null {
      return localStorage.getItem('username');
  }

}
