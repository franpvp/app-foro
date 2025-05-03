import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioDTO } from '../../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private baseUrl = `http://localhost:8081/api/v1`;

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(`${this.baseUrl}/usuarios`, usuario);
  }

  obtenerUsuarios(): Observable<UsuarioDTO[]> {
    return this.http.get<UsuarioDTO[]>(`${this.baseUrl}/usuarios`);
  }

  obtenerUsuarioPorId(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.baseUrl}/usuarios/${id}`);
  }

  modificarUsuario(usuario: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.baseUrl}/usuarios`, usuario);
  }

  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/usuarios/${id}`);
  }

  existeUsuario(id: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/usuarios/existe/${id}`);
  }

  cambiarContrasena(email: string, nuevaContrasena: string): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(
      `${this.baseUrl}/usuarios/cambiar-contrasena`,
      { email, nuevaContrasena }
    );
  }
}
