import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { of, throwError } from 'rxjs';
import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { AuthService } from '../../services/auth.service';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockPublicacionService: jasmine.SpyObj<PublicacionService>;
  let mockComentarioService: jasmine.SpyObj<ComentarioService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockPublicacionService = jasmine.createSpyObj('PublicacionService', [
      'obtenerPublicaciones',
      'crearPublicacion',
      'eliminarPublicacion'
    ]);

    mockComentarioService = jasmine.createSpyObj('ComentarioService', [
      'obtenerComentariosPorPublicacion',
      'crearComentario',
      'eliminarComentario'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: PublicacionService, useValue: mockPublicacionService },
        { provide: ComentarioService, useValue: mockComentarioService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    localStorage.setItem('token', '123');
    localStorage.setItem('userId', '1');
    localStorage.setItem('username', 'fran');

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar publicaciones y comentarios en ngOnInit', fakeAsync(() => {
    const publicacionesMock: PublicacionDTO[] = [
      { idPublicacion: 1, idUsuario: 1, titulo: 'Test', categoria: 'Categoria' ,contenido: 'Contenido', fechaCreacion: new Date() }
    ];
    const comentariosMock: ComentarioDTO[] = [
      { idComentario: 1, idPublicacion: 1, idUsuario: 1, contenido: 'Comentario', fechaCreacion: new Date() }
    ];

    mockPublicacionService.obtenerPublicaciones.and.returnValue(of(publicacionesMock));
    mockComentarioService.obtenerComentariosPorPublicacion.and.returnValue(of(comentariosMock));

    component.ngOnInit();
    tick();

    expect(component.publicaciones.length).toBe(1);
    expect(component.comentarios[1].length).toBe(1);
  }));

  it('debería crear una nueva publicación', fakeAsync(() => {
    mockPublicacionService.crearPublicacion.and.returnValue(of({
      idUsuario: 1,
      titulo: 'Mock titulo',
      categoria: 'Mock categoria',
      contenido: 'Mock contenido',
      fechaCreacion: new Date()
    }));

    mockPublicacionService.obtenerPublicaciones.and.returnValue(of([]));

    component.nuevaPublicacion = {
      idUsuario: 1,
      titulo: 'Nueva',
      categoria: 'Categoria',
      contenido: 'Contenido',
      fechaCreacion: new Date()
    };

    component.crearNuevaPublicacion();
    tick();

    expect(mockPublicacionService.crearPublicacion).toHaveBeenCalled();
  }));

  it('no debería agregar comentario si está vacío', () => {
    component.nuevosComentarios[1] = ' ';
    component.agregarComentario(1);
    expect(mockComentarioService.crearComentario).not.toHaveBeenCalled();
  });

  it('debería agregar un comentario si tiene contenido', fakeAsync(() => {
    component.nuevosComentarios[1] = 'Comentario válido';
    mockComentarioService.crearComentario.and.returnValue(of({
      idPublicacion: 1,
      idUsuario: 1,
      contenido: 'Comentario válido',
      fechaCreacion: new Date()
    }));
    mockComentarioService.obtenerComentariosPorPublicacion.and.returnValue(of([]));

    component.agregarComentario(1);
    tick();

    expect(mockComentarioService.crearComentario).toHaveBeenCalled();
  }));

  it('debería eliminar un comentario', fakeAsync(() => {
    mockComentarioService.eliminarComentario.and.returnValue(of(void 0));
    mockComentarioService.obtenerComentariosPorPublicacion.and.returnValue(of([]));

    component.eliminarComentario(1, 1);
    tick();

    expect(mockComentarioService.eliminarComentario).toHaveBeenCalled();
  }));

  it('debería eliminar una publicación', fakeAsync(() => {
    mockPublicacionService.eliminarPublicacion.and.returnValue(of(void 0));
    mockPublicacionService.obtenerPublicaciones.and.returnValue(of([]));

    component.eliminarPublicacion(1);
    tick();

    expect(mockPublicacionService.eliminarPublicacion).toHaveBeenCalled();
  }));

  it('debería retornar true si el usuario está logeado', () => {
    expect(component.authEstaLogeado()).toBeTrue();
  });

  it('debería retornar username desde localStorage', () => {
    expect(component.getUsername()).toBe('fran');
  });

  it('debería manejar error al cargar publicaciones', fakeAsync(() => {
    spyOn(console, 'error');

    mockPublicacionService.obtenerPublicaciones.and.returnValue(
      throwError(() => new Error('Error'))
    );

    component.cargarPublicaciones();
    tick();

    expect(component.publicaciones.length).toBe(0);
  }));
});
