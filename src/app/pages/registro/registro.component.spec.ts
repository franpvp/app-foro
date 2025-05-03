import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioDTO } from '../../models/usuario.model';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockUsuario: UsuarioDTO = {
    id: 1,
    username: 'fran',
    password: 'Valid123!',
    email: 'fran@mail.com',
    role: 'USER',
    nombre: 'Francisca',
    apellidoPaterno: 'Palma',
    edad: 25,
    fechaNacimiento: new Date()
  };

  beforeEach(async () => {
    // Crear mocks de servicios
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['registrarUsuario']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getUsername',
      'logout',
      'getUserRole' // 👈 necesario si se usa en el HTML
    ]);
    mockAuthService.getUserRole.and.returnValue('USER'); // 👈 valor simulado para tests

    spyOn(console, 'log');
    spyOn(console, 'error');

    await TestBed.configureTestingModule({
      imports: [
        RegistroComponent,
        FormsModule,
        CommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges(); // triggers ngOnInit of NavbarComponent
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería alternar visibilidad de la contraseña', () => {
    expect(component.mostrarPassword).toBeFalse();
    component.togglePassword();
    expect(component.mostrarPassword).toBeTrue();
    component.togglePassword();
    expect(component.mostrarPassword).toBeFalse();
  });

  it('debería validar una contraseña correcta', () => {
    expect(component.esPasswordValida('Abc123!')).toBeTrue();
    expect(component.esPasswordValida('abc')).toBeFalse();
  });

  it('debería detectar contraseña inválida y no llamar al servicio', () => {
    component.usuario.password = 'abc'; // no cumple regex
    component.onSubmit();
    expect(component.mostrarErrorPassword).toBeTrue();
    expect(mockUsuarioService.registrarUsuario).not.toHaveBeenCalled();
  });

  it('debería registrar usuario y redirigir a /login si es exitoso', () => {
    component.usuario = { ...mockUsuario };
    mockUsuarioService.registrarUsuario.and.returnValue(of(mockUsuario));

    component.onSubmit();

    expect(mockUsuarioService.registrarUsuario).toHaveBeenCalledWith(mockUsuario);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería manejar errores del servicio al registrar', () => {
    component.usuario = { ...mockUsuario };
    mockUsuarioService.registrarUsuario.and.returnValue(throwError(() => new Error('Error')));

    component.onSubmit();

    expect(console.error).toHaveBeenCalledWith('Registration failed:', jasmine.any(Error));
  });

  it('debería validar correctamente un correo válido', () => {
    expect(component.esEmailValido('fran@mail.com')).toBeTrue();
    expect(component.esEmailValido('fran@invalido')).toBeFalse();
  });

  it('debería validar un nombre con mínimo dos letras', () => {
    expect(component.esNombreValido('Fran')).toBeTrue();
    expect(component.esNombreValido('F')).toBeFalse();
  });
});
