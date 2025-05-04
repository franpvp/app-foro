import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditarPublicacionComponent } from './editar-publicacion.component';
import { PublicacionService } from '../../services/publicaciones/publicacion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { PublicacionDTO } from '../../models/publicacion.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}

describe('EditarPublicacionComponent', () => {
  let component: EditarPublicacionComponent;
  let fixture: ComponentFixture<EditarPublicacionComponent>;
  let publicacionServiceGlobal: jasmine.SpyObj<PublicacionService>;
  let router: Router;

  const publicacionMock: PublicacionDTO = {
    idPublicacion: 1,
    idUsuario: 2,
    titulo: 'Título prueba',
    categoria: 'Categoría prueba',
    contenido: 'Contenido prueba',
    fechaCreacion: new Date()
  };

  beforeEach(async () => {
    publicacionServiceGlobal = jasmine.createSpyObj('PublicacionService', ['obtenerPublicacionPorId', 'modificarPublicacion']);
    publicacionServiceGlobal.obtenerPublicacionPorId.and.returnValue(of(publicacionMock));

    await TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        EditarPublicacionComponent,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'admin', component: DummyComponent }
        ])
      ],
      providers: [
        { provide: PublicacionService, useValue: publicacionServiceGlobal },
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

    fixture = TestBed.createComponent(EditarPublicacionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar la publicación en ngOnInit si hay id', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(component.publicacion).toEqual(publicacionMock);
  }));

  it('debería manejar error en ngOnInit si falla la carga', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    publicacionServiceGlobal.obtenerPublicacionPorId.and.returnValue(throwError(() => new Error('Error')));
    component.ngOnInit();
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al cargar la publicación.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería alertar si no hay id en route', async () => {
    const publicacionServiceLocal = jasmine.createSpyObj('PublicacionService', ['obtenerPublicacionPorId', 'modificarPublicacion']);

    await TestBed.resetTestingModule().configureTestingModule({
      declarations: [DummyComponent],
      imports: [EditarPublicacionComponent, RouterTestingModule.withRoutes([{ path: 'admin', component: DummyComponent }]), HttpClientTestingModule],
      providers: [
        { provide: PublicacionService, useValue: publicacionServiceLocal },
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

    fixture = TestBed.createComponent(EditarPublicacionComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(window, 'alert');
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('No se encontró el ID de la publicación.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('debería actualizar la publicación en onSubmit', fakeAsync(() => {
    spyOn(window, 'alert');
    component.publicacion = { ...publicacionMock };
    publicacionServiceGlobal.modificarPublicacion.and.returnValue(of(publicacionMock));
    component.onSubmit();
    tick();
    expect(publicacionServiceGlobal.modificarPublicacion).toHaveBeenCalledWith(component.publicacion);
    expect(window.alert).toHaveBeenCalledWith('Publicación actualizada exitosamente.');
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  }));

  it('debería manejar error al actualizar la publicación', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(console, 'error');
    component.publicacion = { ...publicacionMock };
    publicacionServiceGlobal.modificarPublicacion.and.returnValue(throwError(() => new Error('Error al actualizar')));
    component.onSubmit();
    tick();
    expect(console.error).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Error al actualizar la publicación.');
  }));

  it('debería redirigir a admin al cancelar', () => {
    component.cancel();
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
