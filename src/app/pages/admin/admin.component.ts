import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { UsuarioService } from '../../services/usuario.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="admin-container">
      <h2>Panel de Administración</h2>
      <div class="tabs">
        <button [class.active]="activeTab === 'usuarios'" (click)="selectTab('usuarios')">Usuarios</button>
        <button [class.active]="activeTab === 'publicaciones'" (click)="selectTab('publicaciones')">Publicaciones</button>
        <button [class.active]="activeTab === 'comentarios'" (click)="selectTab('comentarios')">Comentarios</button>
      </div>
      <div class="content">
        <!-- Gestión de Usuarios -->
        <div *ngIf="activeTab === 'usuarios'">
          <h3>Gestión de Usuarios</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of usuarios">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.role }}</td>
                <td>
                  <button (click)="editarUsuario(user)">Editar</button>
                  <button (click)="eliminarUsuario(user)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Gestión de Publicaciones -->
        <div *ngIf="activeTab === 'publicaciones'">
          <h3>Gestión de Publicaciones</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Contenido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pub of publicaciones">
                <td>{{ pub.idPublicacion }}</td>
                <td>{{ pub.titulo }}</td>
                <td>{{ pub.contenido }}</td>
                <td>
                  <button (click)="editarPublicacion(pub)">Editar</button>
                  <button (click)="eliminarPublicacion(pub)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Gestión de Comentarios -->
        <div *ngIf="activeTab === 'comentarios'">
          <h3>Gestión de Comentarios</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Usuario</th>
                <th>Comentario</th>
                <th>ID Publicación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let comment of comentarios">
                <td>{{ comment.idComentario }}</td>
                <td>{{ comment.idUsuario }}</td>
                <td>{{ comment.contenido }}</td>
                <td>{{ comment.idPublicacion }}</td>
                <td>
                  <button (click)="editarComentario(comment)">Editar</button>
                  <button (click)="eliminarComentario(comment)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #121212;
      color: #e0e0e0;
      min-height: 100vh;
      padding-top: 80px;
      font-family: 'Segoe UI', sans-serif;
    }
    .admin-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 1rem;
      background: rgba(30,30,30,0.9);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: 8px;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .tabs {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .tabs button {
      background: none;
      border: 1px solid #ff9800;
      padding: 0.5rem 1rem;
      color: #ff9800;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    .tabs button.active {
      background: #ff9800;
      color: #1e1e1e;
    }
    .content {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    th, td {
      padding: 0.75rem;
      border: 1px solid #333;
      text-align: left;
    }
    th {
      background: rgba(255,255,255,0.1);
    }
    button {
      margin-right: 0.5rem;
      padding: 0.25rem 0.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: linear-gradient(45deg, #833ab4, #ee2a7b);
      color: #fff;
      transition: background 0.3s ease;
    }
    button:hover {
      background: linear-gradient(45deg, #ee2a7b, #833ab4);
    }
  `]
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
