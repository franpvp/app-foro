import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { UsuarioService } from '../../services/usuarios/usuario.service';
import { PublicacionService } from '../../services/publicaciones/publicacion.service';
import { ComentarioService } from '../../services/comentarios/comentario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
      CommonModule,
      RouterModule,
      NavbarComponent,
      FooterComponent
    ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab: 'usuarios' | 'publicaciones' | 'comentarios' = 'usuarios';
  usuarios: UsuarioDTO[] = [];
  publicaciones: PublicacionDTO[] = [];
  comentarios: ComentarioDTO[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarPublicaciones();
    this.cargarComentarios();
  }

  selectTab(tab: 'usuarios' | 'publicaciones' | 'comentarios'): void {
    this.activeTab = tab;
  }

  cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  cargarPublicaciones(): void {
    this.publicacionService.obtenerPublicaciones().subscribe(data => {
      this.publicaciones = data;
    });
  }

  cargarComentarios(): void {
    this.comentarioService.obtenerTodosLosComentarios().subscribe(
      (data: ComentarioDTO[]) => {
        this.comentarios = data;
      },
      (error: any) => {
        console.error('Error al obtener comentarios:', error);
      }
    );
  }

  editarUsuario(user: UsuarioDTO): void {
    this.router.navigate(['/admin/editar-usuario', user.id]);
  }

  eliminarUsuario(user: UsuarioDTO): void {
    if (confirm(`¿Está seguro que desea eliminar el usuario ${user.username}?`)) {
      this.usuarioService.eliminarUsuario(user.id!).subscribe(
        () => {
          alert('Usuario eliminado');
          this.cargarUsuarios();
        },
        error => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      );
    }
  }

  editarPublicacion(publicacion: PublicacionDTO): void {
    this.router.navigate(['/admin/editar-publicacion', publicacion.idPublicacion]);
  }

  eliminarPublicacion(publicacion: PublicacionDTO): void {
    if (confirm(`¿Está seguro que desea eliminar la publicación "${publicacion.titulo}"?`)) {
      this.publicacionService.eliminarPublicacion(publicacion.idPublicacion!, publicacion.idUsuario).subscribe(
        () => {
          alert('Publicación eliminada');
          this.cargarPublicaciones();
        },
        error => {
          console.error('Error al eliminar publicación:', error);
          alert('Error al eliminar la publicación');
        }
      );
    }
  }

  editarComentario(comentario: ComentarioDTO): void {
    this.router.navigate(['/admin/editar-comentario', comentario.idComentario]);
  }

  eliminarComentario(comentario: ComentarioDTO): void {
    if (confirm(`¿Está seguro que desea eliminar el comentario con ID ${comentario.idComentario}?`)) {
      this.comentarioService.eliminarComentario(comentario.idComentario!, comentario.idUsuario).subscribe(
        () => {
          alert('Comentario eliminado');
          this.cargarComentarios();
        },
        error => {
          console.error('Error al eliminar comentario:', error);
          alert('Error al eliminar el comentario');
        }
      );
    }
  }
}
