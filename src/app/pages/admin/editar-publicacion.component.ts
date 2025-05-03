import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PublicacionService } from '../../services/publicacion.service';
import { PublicacionDTO } from '../../models/publicacion.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-editar-publicacion',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="editar-container">
      <h2>Editar Publicación</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="titulo">Título:</label>
          <input type="text" id="titulo" name="titulo" [(ngModel)]="publicacion.titulo" required />
        </div>
        <div class="form-group">
          <label for="contenido">Contenido:</label>
          <textarea id="contenido" name="contenido" [(ngModel)]="publicacion.contenido" required rows="5"></textarea>
        </div>
        <button type="submit">Actualizar Publicación</button>
        <button type="button" (click)="cancel()">Cancelar</button>
      </form>
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
    .editar-container {
      max-width: 600px;
      margin: 2rem auto;
      padding: 1rem;
      background: rgba(30,30,30,0.9);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: 8px;
    }
    h2 { text-align: center; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    label { display: block; margin-bottom: 0.5rem; }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: none;
      background: rgba(0,0,0,0.3);
      color: #fff;
    }
    button {
      margin-right: 0.5rem;
      padding: 0.5rem 1rem;
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
export class EditarPublicacionComponent implements OnInit {
  publicacion: PublicacionDTO = {
    idPublicacion: 0,
    idUsuario: 0,
    titulo: '',
    categoria: '',
    contenido: '',
    fechaCreacion: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicacionService: PublicacionService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.publicacionService.obtenerPublicacionPorId(id).subscribe(
        data => this.publicacion = data,
        error => {
          console.error('Error al cargar la publicación:', error);
          alert('Error al cargar la publicación.');
          this.router.navigate(['/admin']);
        }
      );
    } else {
      alert('No se encontró el ID de la publicación.');
      this.router.navigate(['/admin']);
    }
  }

  onSubmit(): void {
    this.publicacionService.modificarPublicacion(this.publicacion).subscribe(
      updated => {
        alert('Publicación actualizada exitosamente.');
        this.router.navigate(['/admin']);
      },
      error => {
        console.error('Error al actualizar la publicación:', error);
        alert('Error al actualizar la publicación.');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
