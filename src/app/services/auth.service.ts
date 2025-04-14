import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginResponseDTO } from '../models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `http://localhost:8081/api/v1/auth`;

  constructor(private http: HttpClient) {}

  
  login(username: string, password: string): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${this.baseUrl}/login`, { username, password })
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', response.username);
          localStorage.setItem('userId', response.userId.toString());
          localStorage.setItem('userRol', response.role);
        })
      );
  }

  logout(username: string): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/logout?username=${username}`, {})
      .pipe(
        tap(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          localStorage.removeItem('userId');
          localStorage.removeItem('userRol');
        })
      );
  }

  checkLoginStatus(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/estado/${id}`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('username');
  }

  getUsername(): string | null {
      return localStorage.getItem('username');
  }

}
