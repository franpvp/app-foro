import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarComentarioComponent } from './editar-comentario.component';
import { ComentarioService } from '../../services/comentarios/comentario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ComentarioDTO } from '../../models/comentario.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('EditarComentarioComponent', () => {
  let component: EditarComentarioComponent;
  let fixture: ComponentFixture<EditarComentarioComponent>;
  let comentarioServiceGlobal: jasmine.SpyObj<ComentarioService>;
  let router: Router;

  const comentarioMock: ComentarioDTO = {
    idComentario: 1,
    idPublicacion: 2,
    idUsuario: 3,
    contenido: 'Contenido',
    fechaCreacion: new Date()
  };

  beforeEach(async () => {
    comentarioServiceGlobal = jasmine.createSpyObj('ComentarioService', ['obtenerComentarioPorId', 'modificarComentario']);
    comentarioServiceGlobal.obtenerComentarioPorId.and.returnValue(of(comentarioMock));

    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        EditarComentarioComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'admin', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: ComentarioService, useValue: comentarioServiceGlobal },
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

    fixture = TestBed.createComponent(EditarComentarioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar el comentario en ngOnInit si hay id', fakeAsync(() => {
    comentarioServiceGlobal.obtenerComentarioPorId.and.returnValue(of(comentarioMock));
    component.ngOnInit();
    tick();
    expect(component.comentario).toEqual(comentarioMock);
  }));

  it('debería manejar error en ngOnInit si falla la carga', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    comentarioServiceGlobal.obtenerComentarioPorId.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al cargar el comentario.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería alertar si no hay id en route', async () => {
    const comentarioServiceLocal = jasmine.createSpyObj('ComentarioService', ['obtenerComentarioPorId', 'modificarComentario']);

    await TestBed.resetTestingModule().configureTestingModule({
      declarations: [DummyComponent],
      imports: [EditarComentarioComponent, RouterTestingModule.withRoutes([{ path: 'admin', component: DummyComponent }]), HttpClientTestingModule],
      providers: [
        { provide: ComentarioService, useValue: comentarioServiceLocal },
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

    fixture = TestBed.createComponent(EditarComentarioComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(window, 'alert');

    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('No se encontró el ID del comentario.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería actualizar el comentario en onSubmit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.comentario = { ...comentarioMock };
    comentarioServiceGlobal.modificarComentario.and.returnValue(of(comentarioMock));
    component.onSubmit();
    tick();
    expect(comentarioServiceGlobal.modificarComentario).toHaveBeenCalledWith(component.comentario);
    expect(window.alert).toHaveBeenCalledWith('Comentario actualizado exitosamente.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería manejar error al actualizar comentario', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    component.comentario = { ...comentarioMock };
    comentarioServiceGlobal.modificarComentario.and.returnValue(throwError(() => new Error('Error al actualizar')));
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar el comentario.');
  }));

  it('debería redirigir a admin al cancelar', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
