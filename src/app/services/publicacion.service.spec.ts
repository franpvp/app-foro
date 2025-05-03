import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PublicacionService } from './publicacion.service';
import { PublicacionDTO } from '../models/publicacion.model';

describe('PublicacionService', () => {
  let service: PublicacionService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api/v1';

  const mockPublicacion: PublicacionDTO = {
    idPublicacion: 1,
    idUsuario: 1,
    titulo: 'Título de prueba',
    categoria: 'Categoria de prueba',
    contenido: 'Contenido de prueba',
    fechaCreacion: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PublicacionService]
    });

    service = TestBed.inject(PublicacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener todas las publicaciones', () => {
    service.obtenerPublicaciones().subscribe(publicaciones => {
      expect(publicaciones).toEqual([mockPublicacion]);
    });

    const req = httpMock.expectOne(`${baseUrl}/publicaciones`);
    expect(req.request.method).toBe('GET');
    req.flush([mockPublicacion]);
  });

  it('debería obtener una publicación por ID', () => {
    service.obtenerPublicacionPorId(1).subscribe(pub => {
      expect(pub).toEqual(mockPublicacion);
    });

    const req = httpMock.expectOne(`${baseUrl}/publicaciones/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPublicacion);
  });

  it('debería crear una nueva publicación', () => {
    service.crearPublicacion(mockPublicacion).subscribe(pub => {
      expect(pub).toEqual(mockPublicacion);
    });

    const req = httpMock.expectOne(`${baseUrl}/publicaciones`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPublicacion);
    req.flush(mockPublicacion);
  });

  it('debería modificar una publicación', () => {
    service.modificarPublicacion(mockPublicacion).subscribe(pub => {
      expect(pub).toEqual(mockPublicacion);
    });

    const req = httpMock.expectOne(`${baseUrl}/publicaciones`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPublicacion);
    req.flush(mockPublicacion);
  });

  it('debería eliminar una publicación por ID y usuario', () => {
    service.eliminarPublicacion(1, 1).subscribe(response => {
      expect(response).toBeNull();  // ← validar null
    });

    const req = httpMock.expectOne(
      `${baseUrl}/publicaciones?id-publicacion=1&id-usuario=1`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
