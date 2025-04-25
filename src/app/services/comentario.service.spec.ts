import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComentarioService } from './comentario.service';
import { ComentarioDTO } from '../models/comentario.model';

describe('ComentarioService', () => {
  let service: ComentarioService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:8080/api/v1';

  const mockComentario: ComentarioDTO = {
    idComentario: 1,
    idPublicacion: 1,
    idUsuario: 2,
    contenido: 'Este es un comentario',
    fechaCreacion: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ComentarioService]
    });

    service = TestBed.inject(ComentarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería obtener comentarios por ID de publicación', () => {
    service.obtenerComentariosPorPublicacion(1).subscribe(comentarios => {
      expect(comentarios).toEqual([mockComentario]);
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios/1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockComentario]);
  });

  it('debería obtener todos los comentarios', () => {
    service.obtenerTodosLosComentarios().subscribe(comentarios => {
      expect(comentarios).toEqual([mockComentario]);
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios/todos`);
    expect(req.request.method).toBe('GET');
    req.flush([mockComentario]);
  });

  it('debería crear un nuevo comentario', () => {
    service.crearComentario(mockComentario).subscribe(comentario => {
      expect(comentario).toEqual(mockComentario);
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComentario);
    req.flush(mockComentario);
  });

  it('debería modificar un comentario', () => {
    service.modificarComentario(mockComentario).subscribe(comentario => {
      expect(comentario).toEqual(mockComentario);
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockComentario);
    req.flush(mockComentario);
  });

  it('debería eliminar un comentario por ID y usuario', () => {
    service.eliminarComentario(1, 2).subscribe(response => {
      expect(response).toBeNull(); // ahora acepta null
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios?id-comentario=1&id-usuario=2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería obtener un comentario por ID', () => {
    service.obtenerComentarioPorId(1).subscribe(comentario => {
      expect(comentario).toEqual(mockComentario);
    });

    const req = httpMock.expectOne(`${baseUrl}/comentarios/comentario/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockComentario);
  });
});
