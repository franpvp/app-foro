import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const mockAuthService = jasmine.createSpyObj('AuthService', [
  'isLoggedIn',
  'logout',
  'getUsername',
  'getUserRole'
]);
mockAuthService.getUserRole.and.returnValue('USER');

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let router: Router;

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['cambiarContrasena']);

    await TestBed.configureTestingModule({
      imports: [
        RecuperarContrasenaComponent,
        CommonModule,
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería establecer showSuccess en true si el cambio de contraseña es exitoso', fakeAsync(() => {
    component.email = 'test@mail.com';
    component.nuevaContrasena = '123456';
    component.confirmContrasena = '123456';

    mockUsuarioService.cambiarContrasena.and.returnValue(of({}));

    component.onSubmit();
    tick();

    expect(component.showSuccess).toBeTrue();
  }));

  it('debería establecer showMismatch en true si las contraseñas no coinciden', () => {
    component.nuevaContrasena = 'abc123';
    component.confirmContrasena = 'xyz456';

    component.onSubmit();

    expect(component.showMismatch).toBeTrue();
    expect(mockUsuarioService.cambiarContrasena).not.toHaveBeenCalled();
  });

  it('debería establecer showMismatch en true si el servicio falla', fakeAsync(() => {
    component.email = 'fail@mail.com';
    component.nuevaContrasena = '123456';
    component.confirmContrasena = '123456';

    mockUsuarioService.cambiarContrasena.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();
    tick();

    expect(component.showMismatch).toBeTrue();
  }));

  it('debería redirigir a /login al cerrar el popup de éxito', () => {
    component.onSuccessPopupClose();

    expect(component.showSuccess).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
