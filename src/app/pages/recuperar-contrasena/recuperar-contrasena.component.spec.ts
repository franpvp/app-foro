import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarContrasenaComponent } from './recuperar-contrasena.component';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout', 'getUsername']);

describe('RecuperarContrasenaComponent', () => {
  let component: RecuperarContrasenaComponent;
  let fixture: ComponentFixture<RecuperarContrasenaComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let router: Router;

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['cambiarContrasena']);
    spyOn(window, 'alert');
    spyOn(console, 'error');

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

  it('debería cambiar la contraseña y redirigir a login si es exitoso', () => {
    component.email = 'test@mail.com';
    component.nuevaContrasena = '123456';

    mockUsuarioService.cambiarContrasena.and.returnValue(of({
      id: 1,
      username: 'fran',
      password: '123456',
      email: 'fran@mail.com',
      role: 'USER',
      nombre: 'Francisca',
      apellidoPaterno: 'Palma',
      edad: 30,
      fechaNacimiento: new Date()
    }));

    component.onSubmit();

    expect(mockUsuarioService.cambiarContrasena).toHaveBeenCalledWith('test@mail.com', '123456');
    expect(window.alert).toHaveBeenCalledWith('Contraseña actualizada exitosamente.');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar errores al cambiar la contraseña', () => {
    component.email = 'fail@mail.com';
    component.nuevaContrasena = 'errorpass';

    mockUsuarioService.cambiarContrasena.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Error al cambiar la contraseña', jasmine.any(Error));
    expect(window.alert).toHaveBeenCalledWith('Error al cambiar la contraseña. Intenta nuevamente.');
  });
});
