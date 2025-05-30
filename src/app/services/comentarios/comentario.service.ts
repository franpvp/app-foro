import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComentarioDTO } from '../../models/comentario.model';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  private baseUrl = `http://localhost:8080/api/v1`;

  constructor(private http: HttpClient) {}

  obtenerIdUsuario(): number {
      return Number(localStorage.getItem('userId') ?? 0);
    }

  obtenerComentariosPorPublicacion(idPublicacion: number): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(`${this.baseUrl}/comentarios/${idPublicacion}`);
  }

  obtenerTodosLosComentarios(): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(`${this.baseUrl}/comentarios/todos`);
  }
  crearComentario(comentario: ComentarioDTO): Observable<ComentarioDTO> {
    return this.http.post<ComentarioDTO>(`${this.baseUrl}/comentarios`, comentario);
  }

  modificarComentario(comentario: ComentarioDTO): Observable<ComentarioDTO> {
    comentario.idUsuario = this.obtenerIdUsuario();
    return this.http.put<ComentarioDTO>(`${this.baseUrl}/comentarios`, comentario);
  }

  eliminarComentario(idComentario: number, idUsuario: number): Observable<void> {
    const currentUserId = this.obtenerIdUsuario();
    return this.http.delete<void>(`${this.baseUrl}/comentarios?id-comentario=${idComentario}&id-usuario=${currentUserId}`);
  }

  obtenerComentarioPorId(id: number): Observable<ComentarioDTO> {
    return this.http.get<ComentarioDTO>(`${this.baseUrl}/comentarios/comentario/${id}`);
  }

}
