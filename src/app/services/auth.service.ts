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

login(username: string, password: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/login`, { username, password }, { responseType: 'text' })
    .pipe(
      tap(token => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
      })
    );
}

  logout(username: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout?username=${username}`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
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
