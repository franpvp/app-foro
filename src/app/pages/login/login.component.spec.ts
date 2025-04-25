import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginResponseDTO } from '../../models/login-response.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    spyOn(console, 'error');

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar la visibilidad de la contraseña', () => {
    expect(component.mostrarPassword).toBeFalse();
    component.togglePassword();
    expect(component.mostrarPassword).toBeTrue();
    component.togglePassword();
    expect(component.mostrarPassword).toBeFalse();
  });

  it('debería redirigir a /admin si el rol es ADMIN', () => {
    const mockResponse: LoginResponseDTO = {
      token: 'abc123',
      role: 'ADMIN',
      username: 'admin',
      userId: 1
    };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.username = 'admin';
    component.password = 'password';
    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith('admin', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería redirigir a /home si el rol no es ADMIN', () => {
    const mockResponse: LoginResponseDTO = {
      token: 'abc123',
      role: 'USER',
      username: 'user',
      userId: 2
    };
    mockAuthService.login.and.returnValue(of(mockResponse));

    component.username = 'user';
    component.password = 'password';
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('debería manejar errores de login correctamente', () => {
    mockAuthService.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.username = 'fail';
    component.password = '1234';
    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Login failed:', jasmine.any(Error));
  });

  it('debería redirigir a la ruta de recuperación de contraseña', () => {
    component.goToRecuperar();
    expect(router.navigate).toHaveBeenCalledWith(['/recuperar-contrasena']);
  });
});
