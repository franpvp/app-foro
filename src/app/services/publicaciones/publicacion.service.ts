import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicacionDTO } from '../../models/publicacion.model';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private baseUrl = `http://localhost:8080/api/v1`;

  constructor(private http: HttpClient) {}

  obtenerIdUsuario(): number {
    return Number(localStorage.getItem('userId') ?? 0);
  }

  obtenerPublicaciones(): Observable<PublicacionDTO[]> {
    return this.http.get<PublicacionDTO[]>(`${this.baseUrl}/publicaciones`);
  }

  obtenerPublicacionPorId(id: number): Observable<PublicacionDTO> {
    return this.http.get<PublicacionDTO>(`${this.baseUrl}/publicaciones/${id}`);
  }

  crearPublicacion(publicacion: PublicacionDTO): Observable<PublicacionDTO> {
    return this.http.post<PublicacionDTO>(`${this.baseUrl}/publicaciones`, publicacion);
  }

  modificarPublicacion(publicacion: PublicacionDTO): Observable<PublicacionDTO> {
    publicacion.idUsuario = this.obtenerIdUsuario();
    return this.http.put<PublicacionDTO>(`${this.baseUrl}/publicaciones`, publicacion);
  }

  eliminarPublicacion(idPublicacion: number, idUsuario: number): Observable<void> {
    const currentUserId = this.obtenerIdUsuario();
    return this.http.delete<void>(`${this.baseUrl}/publicaciones?id-publicacion=${idPublicacion}&id-usuario=${currentUserId}`);
  }
}
