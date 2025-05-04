import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarUsuarioComponent } from './editar-usuario.component';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';

@Component({ selector: 'app-dummy', template: '' })
class DummyComponent {}

describe('EditarUsuarioComponent', () => {
  let component: EditarUsuarioComponent;
  let fixture: ComponentFixture<EditarUsuarioComponent>;
  let usuarioServiceGlobal: jasmine.SpyObj<UsuarioService>;
  let router: Router;

  const usuarioMock: UsuarioDTO = {
    id: 1,
    username: 'test',
    password: '1234',
    email: 'test@test.com',
    role: 'USER',
    nombre: 'Nombre',
    apellidoPaterno: 'Apellido',
    edad: 25,
    fechaNacimiento: new Date()
  };

  beforeEach(async () => {
    usuarioServiceGlobal = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorId', 'modificarUsuario']);
    usuarioServiceGlobal.obtenerUsuarioPorId.and.returnValue(of(usuarioMock));

    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [EditarUsuarioComponent, HttpClientTestingModule, RouterTestingModule.withRoutes([
        { path: 'admin', component: DummyComponent }
      ])],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceGlobal },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el usuario en ngOnInit si hay id', fakeAsync(() => {
    usuarioServiceGlobal.obtenerUsuarioPorId.and.returnValue(of(usuarioMock));
    component.ngOnInit();
    tick();
    expect(component.usuario).toEqual(usuarioMock);
  }));

  it('debería manejar error en ngOnInit si falla la carga', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    usuarioServiceGlobal.obtenerUsuarioPorId.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al cargar el usuario.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería alertar si no hay id en route', async () => {
    const usuarioServiceLocal = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarioPorId', 'modificarUsuario']);

    await TestBed.resetTestingModule().configureTestingModule({
      imports: [EditarUsuarioComponent, RouterTestingModule.withRoutes([{ path: 'admin', component: DummyComponent }]), HttpClientTestingModule],
      declarations: [DummyComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceLocal },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarUsuarioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('No se encontró el ID del usuario.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería actualizar el usuario en onSubmit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.usuario = { ...usuarioMock };
    usuarioServiceGlobal.modificarUsuario.and.returnValue(of(usuarioMock));

    component.onSubmit();
    tick();

    expect(usuarioServiceGlobal.modificarUsuario).toHaveBeenCalledWith(component.usuario);
    expect(window.alert).toHaveBeenCalledWith('Usuario actualizado exitosamente.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería manejar error al actualizar usuario', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    component.usuario = { ...usuarioMock };
    usuarioServiceGlobal.modificarUsuario.and.returnValue(throwError(() => new Error('Error al actualizar')));

    component.onSubmit();
    tick();

    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar el usuario.');
  }));

  it('debería redirigir a admin al cancelar', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
