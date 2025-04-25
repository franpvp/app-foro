import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../models/login-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8081/api/v1/auth';

  const mockResponse: LoginResponseDTO = {
    token: 'abc123',
    role: 'USER',
    username: 'fran',
    userId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería loguear y guardar datos en localStorage', () => {
    service.login('fran', '1234').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('abc123');
      expect(localStorage.getItem('username')).toBe('fran');
      expect(localStorage.getItem('userId')).toBe('1');
      expect(localStorage.getItem('userRol')).toBe('USER');
    });

    const req = httpMock.expectOne(`${baseUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'fran', password: '1234' });

    req.flush(mockResponse);
  });

  it('debería cerrar sesión y limpiar localStorage', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('username', 'fran');
    localStorage.setItem('userId', '1');
    localStorage.setItem('userRol', 'USER');

    service.logout('fran').subscribe(res => {
      expect(res).toBe('Sesión cerrada');
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
      expect(localStorage.getItem('userId')).toBeNull();
      expect(localStorage.getItem('userRol')).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/logout?username=fran`);
    expect(req.request.method).toBe('POST');
    req.flush('Sesión cerrada');
  });

  it('debería verificar estado de login por ID', () => {
    service.checkLoginStatus(1).subscribe(res => {
      expect(res).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/estado/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('debería retornar true si el usuario está logueado', () => {
    localStorage.setItem('username', 'fran');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('debería retornar false si el usuario no está logueado', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('debería retornar el username', () => {
    localStorage.setItem('username', 'fran');
    expect(service.getUsername()).toBe('fran');
  });

  it('debería retornar null si no hay username', () => {
    expect(service.getUsername()).toBeNull();
  });
});
