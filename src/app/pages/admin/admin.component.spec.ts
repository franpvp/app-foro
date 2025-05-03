import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { UsuarioService } from '../../services/usuario.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.model';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';
import { AuthService } from '../../services/auth.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  let router: Router;
  let mockUsuarioService: jasmine.SpyObj<UsuarioService>;
  let mockPublicacionService: jasmine.SpyObj<PublicacionService>;
  let mockComentarioService: jasmine.SpyObj<ComentarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockUsuarioService = jasmine.createSpyObj('UsuarioService', [
      'obtenerUsuarios',
      'eliminarUsuario'
    ]);
    mockPublicacionService = jasmine.createSpyObj('PublicacionService', [
      'obtenerPublicaciones',
      'eliminarPublicacion'
    ]);
    mockComentarioService = jasmine.createSpyObj('ComentarioService', [
      'obtenerTodosLosComentarios',
      'eliminarComentario'
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    // Set default return values for listar methods
    mockUsuarioService.obtenerUsuarios.and.returnValue(of([]));
    mockPublicacionService.obtenerPublicaciones.and.returnValue(of([]));
    mockComentarioService.obtenerTodosLosComentarios.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AdminComponent, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: UsuarioService, useValue: mockUsuarioService },
        { provide: PublicacionService, useValue: mockPublicacionService },
        { provide: ComentarioService, useValue: mockComentarioService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar usuarios, publicaciones y comentarios en ngOnInit', fakeAsync(() => {
    const usuariosMock: UsuarioDTO[] = [
      { id: 1, username: 'u1' } as any
    ];
    const publicacionesMock: PublicacionDTO[] = [
      { idPublicacion: 1, idUsuario: 1, titulo: 'T', categoria: 'C', contenido: 'C', fechaCreacion: new Date() }
    ];
    const comentariosMock: ComentarioDTO[] = [
      { idComentario: 1, idPublicacion: 1, idUsuario: 1, contenido: 'X', fechaCreacion: new Date() }
    ];

    mockUsuarioService.obtenerUsuarios.and.returnValue(of(usuariosMock));
    mockPublicacionService.obtenerPublicaciones.and.returnValue(of(publicacionesMock));
    mockComentarioService.obtenerTodosLosComentarios.and.returnValue(of(comentariosMock));

    component.ngOnInit();
    tick();

    expect(component.usuarios).toEqual(usuariosMock);
    expect(component.publicaciones).toEqual(publicacionesMock);
    expect(component.comentarios).toEqual(comentariosMock);
  }));

  it('debería cambiar la pestaña activa al llamar selectTab', () => {
    component.activeTab = 'usuarios';
    component.selectTab('comentarios');
    expect(component.activeTab).toBe('comentarios');
  });

  it('debería navegar a editarUsuario', () => {
    spyOn(router, 'navigate');
    const user = { id: 2, username: 'usr' } as UsuarioDTO;
    component.editarUsuario(user);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-usuario', user.id]);
  });

  it('debería eliminar usuario cuando confirme', fakeAsync(() => {
    const user = { id: 3, username: 'usr' } as UsuarioDTO;
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(component, 'cargarUsuarios');
    mockUsuarioService.eliminarUsuario.and.returnValue(of(void 0));

    component.eliminarUsuario(user);
    tick();

    expect(mockUsuarioService.eliminarUsuario).toHaveBeenCalledWith(user.id);
    expect(window.alert).toHaveBeenCalledWith('Usuario eliminado');
    expect(component.cargarUsuarios).toHaveBeenCalled();
  }));

  it('debería manejar error al eliminar usuario', fakeAsync(() => {
    const user = { id: 4, username: 'err' } as UsuarioDTO;
    const error = new Error('Error');
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');
    mockUsuarioService.eliminarUsuario.and.returnValue(throwError(() => error));

    component.eliminarUsuario(user);
    tick();

    expect(console.error).toHaveBeenCalledWith('Error al eliminar usuario:', error);
    expect(window.alert).toHaveBeenCalledWith('Error al eliminar el usuario');
  }));

  it('debería navegar a editarPublicacion', () => {
    spyOn(router, 'navigate');
    const pub = {
      idPublicacion: 5,
      idUsuario: 1,
      titulo: 'T',
      categoria: 'C',
      contenido: 'C',
      fechaCreacion: new Date()
    } as PublicacionDTO;
    component.editarPublicacion(pub);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-publicacion', pub.idPublicacion]);
  });

  it('debería eliminar publicacion cuando confirme', fakeAsync(() => {
    const pub = {
      idPublicacion: 6,
      idUsuario: 2,
      titulo: 'T',
      categoria: 'C',
      contenido: 'C',
      fechaCreacion: new Date()
    } as PublicacionDTO;
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(component, 'cargarPublicaciones');
    mockPublicacionService.eliminarPublicacion.and.returnValue(of(void 0));

    component.eliminarPublicacion(pub);
    tick();

    expect(mockPublicacionService.eliminarPublicacion)
      .toHaveBeenCalledWith(pub.idPublicacion, pub.idUsuario);
    expect(window.alert).toHaveBeenCalledWith('Publicación eliminada');
    expect(component.cargarPublicaciones).toHaveBeenCalled();
  }));

  it('debería manejar error al eliminar publicacion', fakeAsync(() => {
    const pub = {
      idPublicacion: 7,
      idUsuario: 3,
      titulo: 'T',
      categoria: 'C',
      contenido: 'C',
      fechaCreacion: new Date()
    } as PublicacionDTO;
    const error = new Error('Error');
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(console, 'error');
    mockPublicacionService.eliminarPublicacion.and.returnValue(throwError(() => error));

    component.eliminarPublicacion(pub);
    tick();

    expect(console.error).toHaveBeenCalledWith('Error al eliminar publicación:', error);
    expect(window.alert).toHaveBeenCalledWith('Error al eliminar la publicación');
  }));

  it('debería navegar a editarComentario', () => {
    spyOn(router, 'navigate');
    const com = {
      idComentario: 8,
      idPublicacion: 1,
      idUsuario: 1,
      contenido: 'C',
      fechaCreacion: new Date()
    } as ComentarioDTO;
    component.editarComentario(com);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/editar-comentario', com.idComentario]);
  });

  it('debería eliminar comentario cuando confirme', fakeAsync(() => {
    const com = {
      idComentario: 9,
      idPublicacion: 1,
      idUsuario: 4,
      contenido: 'C',
      fechaCreacion: new Date()
    } as ComentarioDTO;
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(window, 'alert');
    spyOn(component, 'cargarComentarios');
    mockComentarioService.eliminarComentario.and.returnValue(of(void 0));

    component.eliminarComentario(com);
    tick();

    expect(mockComentarioService.eliminarComentario)
      .toHaveBeenCalledWith(com.idComentario, com.idUsuario);
    expect(window.alert).toHaveBeenCalledWith('Comentario eliminado');
    expect(component.cargarComentarios).toHaveBeenCalled();
  }));

  it('debería manejar error al cargar comentarios', fakeAsync(() => {
    const error = new Error('Error');
    mockComentarioService.obtenerTodosLosComentarios.and.returnValue(throwError(() => error));
    spyOn(console, 'error');

    component.cargarComentarios();
    tick();

    expect(component.comentarios.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith('Error al obtener comentarios:', error);
  }));
});
