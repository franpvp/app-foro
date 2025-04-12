import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { trigger, transition, style, animate } from '@angular/animations';

import { PublicacionService } from '../../services/publicacion.service';
import { ComentarioService } from '../../services/comentario.service';
import { PublicacionDTO } from '../../models/publicacion.model';
import { ComentarioDTO } from '../../models/comentario.model';

// Importa el Navbar (ajusta la ruta según tu estructura)
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NavbarComponent
  ],
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ],
  template: `
    <!-- Navbar -->
    <app-navbar></app-navbar>
    <!-- Contenedor principal centrado -->
    <div class="home-container">
      <!-- Formulario para nueva publicación -->
      <mat-card class="new-post-card" [@fadeSlideIn]>
        <mat-card-header>
          <mat-card-title>Nueva Publicación</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="crearNuevaPublicacion()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Título</mat-label>
              <input matInput [(ngModel)]="nuevaPublicacion.titulo" name="titulo" required>
            </mat-form-field>
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Contenido</mat-label>
              <textarea matInput [(ngModel)]="nuevaPublicacion.contenido" name="contenido" rows="3" required></textarea>
            </mat-form-field>
            <button mat-raised-button color="primary" type="submit">Publicar</button>
          </form>
        </mat-card-content>
      </mat-card>

      <!-- Lista de publicaciones -->
      <div class="publications-list">
        <mat-card *ngFor="let publicacion of publicaciones" class="publication-card" [@fadeSlideIn]>
          <mat-card-header>
            <mat-card-title>{{ publicacion.titulo }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>{{ publicacion.contenido }}</p>
          </mat-card-content>
          <mat-divider></mat-divider>
          <!-- Sección de comentarios -->
          <div class="comments-section" *ngIf="publicacion.idPublicacion as idPub">
            <h3>Comentarios</h3>
            <!-- Nuevo comentario -->
            <div class="new-comment-form">
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Añadir comentario</mat-label>
                <input matInput [(ngModel)]="nuevosComentarios[idPub]" [name]="'comment' + idPub">
              </mat-form-field>
              <button mat-button color="primary" (click)="agregarComentario(idPub)">Comentar</button>
            </div>
            <!-- Lista de comentarios -->
            <div class="comment" *ngFor="let comentario of comentarios[idPub]" [@fadeSlideIn]>
              <p>{{ comentario.contenido }}</p>
              <div class="comment-actions" *ngIf="comentario.idUsuario === userId">
                <button mat-icon-button color="warn" (click)="eliminarComentario(comentario.idComentario!, idPub)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
            <!-- Acciones sobre publicación -->
            <mat-card-actions *ngIf="publicacion.idUsuario === userId">
              <button mat-button color="warn" (click)="eliminarPublicacion(idPub)">
                <mat-icon>delete</mat-icon> Eliminar
              </button>
            </mat-card-actions>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    /* Forzamos que el host cubra toda la pantalla sin bordes blancos */
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      background-color: #121212;
      margin: 0;
      overflow-x: hidden;
    }
    /* Contenedor principal centrado, con margen superior para el navbar fijo */
    .home-container {
      max-width: 800px;
      margin: 80px auto 1rem auto;  /* Ajusta el margen-top si el navbar tiene otra altura */
      padding: 1rem;
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: #fafafa;
    }
    /* Estilos para el formulario de nueva publicación */
    .new-post-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.03);
      color: #e0e0e0;
      margin-bottom: 20px;
      width: 100%;
      padding: 1rem;
    }
    /* Estilos para cada publicación */
    .publication-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.5), -4px -4px 10px rgba(255, 255, 255, 0.03);
      color: #e0e0e0;
      margin-bottom: 16px;
      width: 100%;
    }
    .full-width {
      width: 100%;
    }
    .publications-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    /* Sección de comentarios */
    .comments-section {
      padding: 16px;
    }
    .new-comment-form {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 16px;
    }
    .comment {
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .comment-actions {
      display: flex;
      gap: 8px;
    }
    /* Responsividad: ajustes para pantallas pequeñas */
    @media (max-width: 600px) {
      .new-post-card, .publication-card {
        padding: 1rem 0.5rem;
      }
      .publication-card mat-card-header {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .publication-card mat-card-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  publicaciones: PublicacionDTO[] = [];
  comentarios: { [key: number]: ComentarioDTO[] } = {};
  nuevosComentarios: { [key: number]: string } = {};
  userId = 1; // Esto debería venir de un AuthService real

  nuevaPublicacion: PublicacionDTO = {
    idUsuario: this.userId,
    titulo: '',
    contenido: '',
    fechaCreacion: new Date()
  };

  constructor(
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService
  ) {}

  ngOnInit(): void {
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
      error: (error) => console.error('Error loading publications:', error)
    });
  }

  cargarComentarios(idPublicacion: number): void {
    this.comentarioService.obtenerComentariosPorPublicacion(idPublicacion).subscribe({
      next: (comentarios) => {
        this.comentarios[idPublicacion] = comentarios;
      },
      error: (error) => console.error('Error loading comments:', error)
    });
  }

  crearNuevaPublicacion(): void {
    this.publicacionService.crearPublicacion(this.nuevaPublicacion).subscribe({
      next: () => {
        this.cargarPublicaciones();
        this.nuevaPublicacion = {
          idUsuario: this.userId,
          titulo: '',
          contenido: '',
          fechaCreacion: new Date()
        };
      },
      error: (error) => console.error('Error creating publication:', error)
    });
  }

  agregarComentario(idPublicacion: number): void {
    if (!this.nuevosComentarios[idPublicacion]) return;
    const nuevoComentario: ComentarioDTO = {
      idPublicacion,
      idUsuario: this.userId,
      contenido: this.nuevosComentarios[idPublicacion],
      fechaCreacion: new Date()
    };
    this.comentarioService.crearComentario(nuevoComentario).subscribe({
      next: () => {
        this.cargarComentarios(idPublicacion);
        this.nuevosComentarios[idPublicacion] = '';
      },
      error: (error) => console.error('Error creating comment:', error)
    });
  }

  eliminarComentario(idComentario: number, idPublicacion: number): void {
    this.comentarioService.eliminarComentario(idComentario, this.userId).subscribe({
      next: () => {
        this.cargarComentarios(idPublicacion);
      },
      error: (error) => console.error('Error deleting comment:', error)
    });
  }

  eliminarPublicacion(idPublicacion: number): void {
    this.publicacionService.eliminarPublicacion(idPublicacion, this.userId).subscribe({
      next: () => {
        this.cargarPublicaciones();
      },
      error: (error) => console.error('Error deleting publication:', error)
    });
  }
}
