import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.model';
import { CommonModule } from '@angular/common';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  const mockUsuario: UsuarioDTO = {
    username: 'fran',
    password: '1234',
    email: 'fran@mail.com',
    role: 'USER',
    nombre: 'Francisca',
    apellidoPaterno: 'Palma',
    edad: 30,
    fechaNacimiento: new Date()
  };

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorId', 'modificarUsuario']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'logout', 'getUsername']);
    spyOn(console, 'error');
    spyOn(console, 'log');

    await TestBed.configureTestingModule({
      imports: [
        PerfilComponent,
        RouterTestingModule,
        CommonModule
      ],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería redirigir a /login si no hay token o userId', () => {
    localStorage.clear();
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería cargar el perfil del usuario si token y userId están presentes', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('userId', '1');
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(of(mockUsuario));

    component.ngOnInit();

    expect(mockUsuarioService.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
    expect(component.usuario.username).toBe('fran');
  });

  it('debería manejar error y redirigir si falla la carga del perfil', () => {
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('userId', '1');
    mockUsuarioService.obtenerUsuarioPorId.and.returnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading user profile:', jasmine.any(Error));
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('debería activar modo edición con toggleEdit()', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
  });

  it('debería guardar cambios del perfil y salir de modo edición', () => {
    component.isEditing = true;
    const updatedUsuario: UsuarioDTO = { ...mockUsuario, username: 'editado' };
    component.usuario = updatedUsuario;
    mockUsuarioService.modificarUsuario.and.returnValue(of(updatedUsuario));

    component.toggleEdit();

    expect(mockUsuarioService.modificarUsuario).toHaveBeenCalledWith(updatedUsuario);
    expect(component.usuario.username).toBe('editado');
    expect(component.isEditing).toBeFalse();
  });

  it('debería manejar error al intentar guardar perfil', () => {
    component.isEditing = true;
    mockUsuarioService.modificarUsuario.and.returnValue(throwError(() => new Error('update error')));

    component.toggleEdit();

    expect(console.error).toHaveBeenCalledWith('Failed to update profile:', jasmine.any(Error));
  });
});
