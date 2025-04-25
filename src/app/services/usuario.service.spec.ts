import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { UsuarioDTO } from '../models/usuario.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8081/api/v1';

  const mockUsuario: UsuarioDTO = {
    id: 1,
    username: 'fran',
    password: '123456',
    email: 'fran@mail.com',
    role: 'USER',
    nombre: 'Francisca',
    apellidoPaterno: 'Palma',
    edad: 30,
    fechaNacimiento: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });

    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería registrar un usuario', () => {
    service.registrarUsuario(mockUsuario).subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUsuario);
  });

  it('debería obtener todos los usuarios', () => {
    const usuariosMock: UsuarioDTO[] = [mockUsuario];

    service.obtenerUsuarios().subscribe(usuarios => {
      expect(usuarios).toEqual(usuariosMock);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios`);
    expect(req.request.method).toBe('GET');
    req.flush(usuariosMock);
  });

  it('debería obtener un usuario por ID', () => {
    service.obtenerUsuarioPorId(1).subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsuario);
  });

  it('debería modificar un usuario', () => {
    service.modificarUsuario(mockUsuario).subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockUsuario);
  });

  it('debería eliminar un usuario por ID', () => {
    service.eliminarUsuario(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería verificar si un usuario existe', () => {
    service.existeUsuario(1).subscribe(existe => {
      expect(existe).toBeTrue();
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/existe/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('debería cambiar la contraseña', () => {
    const email = 'fran@mail.com';
    const nuevaContrasena = 'nueva123';

    service.cambiarContrasena(email, nuevaContrasena).subscribe(usuario => {
      expect(usuario).toEqual(mockUsuario);
    });

    const req = httpMock.expectOne(`${baseUrl}/usuarios/cambiar-contrasena`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ email, nuevaContrasena });
    req.flush(mockUsuario);
  });
});
