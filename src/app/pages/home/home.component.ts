import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PublicacionService } from '../../services/publicaciones/publicacion.service';
import { ComentarioService } from '../../services/comentarios/comentario.service';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';

import { UsuarioService } from '../../services/usuarios/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicaciones: PublicacionDTO[] = [];
  comentarios: { [key: number]: ComentarioDTO[] } = {};
  nuevosComentarios: { [key: number]: string } = {};
  userId: number = Number(this.obtenerUsuarioById);
  userMap: Record<number,string> = {};

  nuevaPublicacion: PublicacionDTO = {
    idUsuario: Number(this.userId),
    titulo: '',
    categoria: '',
    contenido: '',
    fechaCreacion: new Date()
  };

  constructor(
    public auth: AuthService,
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.setUserIdIfLogged();
    this.cargarUsuarios();
    this.cargarPublicaciones();
  }

  cargarPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones().subscribe({
      next: (publicaciones) => {
        this.publicaciones = publicaciones;
        publicaciones.forEach(pub => {
          const id = pub.idPublicacion;
          if (id !== undefined) {
            this.cargarComentarios(id);
            if (!this.nuevosComentarios[id]) {
              this.nuevosComentarios[id] = '';
            }
          }
        });
      },
      error: (error) => {
        console.error('Error al cargar publicaciones:', error);
        this.publicaciones = []; // ← importante para activar el mensaje en HTML
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (users: UsuarioDTO[]) => {
        this.userMap = users.reduce((map, u) => {
          if (u.id !== undefined) {
            map[u.id] = u.username;
          }
          return map;
        }, {} as Record<number, string>);
      },
      error: (error) => console.error('Error al cargar usuarios:', error)
    });
  }

  cargarComentarios(idPublicacion: number): void {
    this.comentarioService.obtenerComentariosPorPublicacion(idPublicacion).subscribe({
      next: (comentarios) => {
        this.comentarios[idPublicacion] = comentarios;
      },
      error: (error) => console.error('Error al cargar comentarios:', error)
    });
  }

  crearNuevaPublicacion(): void {
    this.publicacionService.crearPublicacion(this.nuevaPublicacion).subscribe({
      next: () => {
        this.cargarPublicaciones();
        this.nuevaPublicacion = {
          idUsuario: Number(this.userId),
          titulo: '',
          categoria: '',
          contenido: '',
          fechaCreacion: new Date()
        };
      },
      error: (error) => console.error('Error al crear publicación:', error)
    });
  }

  agregarComentario(idPublicacion: number): void {
    const contenido = this.nuevosComentarios[idPublicacion];
    if (!contenido || contenido.trim() === '') return;

    const nuevoComentario: ComentarioDTO = {
      idPublicacion,
      idUsuario: Number(this.userId),
      contenido,
      fechaCreacion: new Date()
    };

    this.comentarioService.crearComentario(nuevoComentario).subscribe({
      next: () => {
        this.cargarComentarios(idPublicacion);
        this.nuevosComentarios[idPublicacion] = '';
      },
      error: (error) => console.error('Error al crear comentario:', error)
    });
  }

  eliminarComentario(idComentario: number, idPublicacion: number): void {
    this.comentarioService.eliminarComentario(idComentario, Number(this.userId)).subscribe({
      next: () => {
        this.cargarComentarios(idPublicacion);
      },
      error: (error) => console.error('Error al eliminar comentario:', error)
    });
  }

  eliminarPublicacion(idPublicacion: number): void {
    this.publicacionService.eliminarPublicacion(idPublicacion, Number(this.userId)).subscribe({
      next: () => {
        this.cargarPublicaciones();
      },
      error: (error) => console.error('Error al eliminar publicación:', error)
    });
  }

  setUserIdIfLogged(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      this.userId = Number(this.obtenerUsuarioById);
    }
  }

  authEstaLogeado(): boolean {
    return !!localStorage.getItem('token') && !!localStorage.getItem('userId');
  }

  get obtenerUsuarioById(): string | null {
    return localStorage.getItem('userId');
  }

  getUsername(): string | null {
      return localStorage.getItem('username');
    }

  getUsernameById(idUsuario: number): string {
    return this.userMap[idUsuario] ?? 'Desconocido';
  }

  /**
   * Adjusts a Date or ISO date string to local timezone by removing the current offset.
   */
  adjustDate(dateValue: string | Date): Date {
    const d = new Date(dateValue);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  }

}
