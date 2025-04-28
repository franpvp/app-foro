import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../services/auth.service';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.model';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

let component: AdminComponent;
let fixture: ComponentFixture<AdminComponent>;
let usuarioService: jasmine.SpyObj<UsuarioService>;
let publicacionService: jasmine.SpyObj<PublicacionService>;
let comentarioService: jasmine.SpyObj<ComentarioService>;
let mockAuthService: jasmine.SpyObj<AuthService>;
let router: jasmine.SpyObj<Router>;

beforeEach(async () => {
  usuarioService = jasmine.createSpyObj('UsuarioService', ['obtenerUsuarios', 'eliminarUsuario']);
  publicacionService = jasmine.createSpyObj('PublicacionService', ['obtenerPublicaciones', 'eliminarPublicacion']);
  comentarioService = jasmine.createSpyObj('ComentarioService', ['obtenerTodosLosComentarios', 'eliminarComentario']);
  router = jasmine.createSpyObj('Router', ['navigate']);
  (router as any).events = of(new NavigationEnd(0, '/', '/'));

  usuarioService.obtenerUsuarios.and.returnValue(of([]));
  publicacionService.obtenerPublicaciones.and.returnValue(of([]));
  comentarioService.obtenerTodosLosComentarios.and.returnValue(of([]));
  usuarioService.eliminarUsuario.and.returnValue(of(void 0));
  publicacionService.eliminarPublicacion.and.returnValue(of(void 0));
  comentarioService.eliminarComentario.and.returnValue(of(void 0));

  mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

  await TestBed.configureTestingModule({
    imports: [RouterTestingModule, AdminComponent],
    providers: [
      { provide: UsuarioService, useValue: usuarioService },
      { provide: PublicacionService, useValue: publicacionService },
      { provide: ComentarioService, useValue: comentarioService },
      { provide: AuthService, useValue: mockAuthService },
      { provide: ActivatedRoute, useValue: {} },
      { provide: Router, useValue: router }
    ],
    schemas: [NO_ERRORS_SCHEMA]
  }).compileComponents();

  fixture = TestBed.createComponent(AdminComponent);
  component = fixture.componentInstance;
});

it('debería crear el componente', () => {
  expect(component).toBeTruthy();
});

it('debería tener activeTab por defecto "usuarios"', () => {
  expect(component.activeTab).toBe('usuarios');
});

it('selectTab debería cambiar el tab activo', () => {
  component.selectTab('publicaciones');
  expect(component.activeTab).toBe('publicaciones');
});

it('ngOnInit debería llamar a cargarUsuarios, cargarPublicaciones y cargarComentarios', () => {
  spyOn(component, 'cargarUsuarios');
  spyOn(component, 'cargarPublicaciones');
  spyOn(component, 'cargarComentarios');

  component.ngOnInit();

  expect(component.cargarUsuarios).toHaveBeenCalled();
  expect(component.cargarPublicaciones).toHaveBeenCalled();
  expect(component.cargarComentarios).toHaveBeenCalled();
});

it('cargarUsuarios debería poblar la lista de usuarios', () => {
  const users: UsuarioDTO[] = [{ id: 1, username: 'u1' } as any];
  usuarioService.obtenerUsuarios.and.returnValue(of(users));

  component.cargarUsuarios();

  expect(component.usuarios).toEqual(users);
});

it('cargarPublicaciones debería poblar la lista de publicaciones', () => {
  const pubs: PublicacionDTO[] = [{ idPublicacion: 1, titulo: 't1', idUsuario: 1 } as any];
  publicacionService.obtenerPublicaciones.and.returnValue(of(pubs));

  component.cargarPublicaciones();

  expect(component.publicaciones).toEqual(pubs);
});

it('cargarComentarios debería poblar la lista de comentarios en caso de éxito', () => {
  const comms: ComentarioDTO[] = [{ idComentario: 1, contenido: 'c1', idUsuario: 1 } as any];
  comentarioService.obtenerTodosLosComentarios.and.returnValue(of(comms));

  component.cargarComentarios();

  expect(component.comentarios).toEqual(comms);
});

it('cargarComentarios debería registrar un error en caso de fallo', () => {
  spyOn(console, 'error');
  comentarioService.obtenerTodosLosComentarios.and.returnValue(throwError('err'));

  component.cargarComentarios();

  expect(console.error).toHaveBeenCalledWith('Error al obtener comentarios:', 'err');
});

it('editarUsuario debería navegar a la ruta de edición de usuario', () => {
  const user = { id: 2 } as UsuarioDTO;
  component.editarUsuario(user);
  expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-usuario', user.id]);
});

it('editarPublicacion debería navegar a la ruta de edición de publicación', () => {
  const pub = { idPublicacion: 3 } as PublicacionDTO;
  component.editarPublicacion(pub);
  expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-publicacion', pub.idPublicacion]);
});

it('editarComentario debería navegar a la ruta de edición de comentario', () => {
  const com = { idComentario: 4 } as ComentarioDTO;
  component.editarComentario(com);
  expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-comentario', com.idComentario]);
});

it('eliminarUsuario no debería llamar al servicio si la confirmación es falsa', () => {
  (window.confirm as jasmine.Spy).and.returnValue(false);
  component.eliminarUsuario({ id: 5, username: 'u5' } as any);
  expect(usuarioService.eliminarUsuario).not.toHaveBeenCalled();
});

it('eliminarUsuario debería eliminar y recargar en caso de éxito', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  spyOn(component, 'cargarUsuarios');

  component.eliminarUsuario({ id: 5, username: 'u5' } as any);

  expect(usuarioService.eliminarUsuario).toHaveBeenCalledWith(5);
  expect(window.alert).toHaveBeenCalledWith('Usuario eliminado');
  expect(component.cargarUsuarios).toHaveBeenCalled();
});

it('eliminarUsuario debería mostrar alerta en caso de fallo', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  usuarioService.eliminarUsuario.and.returnValue(throwError('err'));
  spyOn(console, 'error');

  component.eliminarUsuario({ id: 5, username: 'u5' } as any);

  expect(console.error).toHaveBeenCalledWith('Error al eliminar usuario:', 'err');
  expect(window.alert).toHaveBeenCalledWith('Error al eliminar el usuario');
});

it('eliminarPublicacion no debería llamar al servicio si la confirmación es falsa', () => {
  (window.confirm as jasmine.Spy).and.returnValue(false);
  component.eliminarPublicacion({ idPublicacion: 6, idUsuario: 1 } as any);
  expect(publicacionService.eliminarPublicacion).not.toHaveBeenCalled();
});

it('eliminarPublicacion debería eliminar y recargar en caso de éxito', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  spyOn(component, 'cargarPublicaciones');

  component.eliminarPublicacion({ idPublicacion: 6, idUsuario: 1 } as any);

  expect(publicacionService.eliminarPublicacion).toHaveBeenCalledWith(6, 1);
  expect(window.alert).toHaveBeenCalledWith('Publicación eliminada');
  expect(component.cargarPublicaciones).toHaveBeenCalled();
});

it('eliminarPublicacion debería mostrar alerta en caso de fallo', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  publicacionService.eliminarPublicacion.and.returnValue(throwError('err'));
  spyOn(console, 'error');

  component.eliminarPublicacion({ idPublicacion: 6, idUsuario: 1 } as any);

  expect(console.error).toHaveBeenCalledWith('Error al eliminar publicación:', 'err');
  expect(window.alert).toHaveBeenCalledWith('Error al eliminar la publicación');
});

it('eliminarComentario no debería llamar al servicio si la confirmación es falsa', () => {
  (window.confirm as jasmine.Spy).and.returnValue(false);
  component.eliminarComentario({ idComentario: 7, idUsuario: 1 } as any);
  expect(comentarioService.eliminarComentario).not.toHaveBeenCalled();
});

it('eliminarComentario debería eliminar y recargar en caso de éxito', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  spyOn(component, 'cargarComentarios');

  component.eliminarComentario({ idComentario: 7, idUsuario: 1 } as any);

  expect(comentarioService.eliminarComentario).toHaveBeenCalledWith(7, 1);
  expect(window.alert).toHaveBeenCalledWith('Comentario eliminado');
  expect(component.cargarComentarios).toHaveBeenCalled();
});

it('eliminarComentario debería mostrar alerta en caso de fallo', () => {
  (window.confirm as jasmine.Spy).and.returnValue(true);
  comentarioService.eliminarComentario.and.returnValue(throwError('err'));
  spyOn(console, 'error');

  component.eliminarComentario({ idComentario: 7, idUsuario: 1 } as any);

  expect(console.error).toHaveBeenCalledWith('Error al eliminar comentario:', 'err');
  expect(window.alert).toHaveBeenCalledWith('Error al eliminar el comentario');
});
