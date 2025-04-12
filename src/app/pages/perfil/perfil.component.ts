import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <!-- Navbar global -->
    <app-navbar></app-navbar>

    <div class="perfil-container">
      <div class="card perfil-card">
        <div class="card-header text-center">
          <h3 class="profile-title">Perfil</h3>
        </div>
        <div class="card-body">
          <!-- Imagen de perfil centrada -->
          <div class="text-center mb-3">
            <img src="assets/perfil.png" class="profile-img" alt="Profile Image">
          </div>
          <!-- Mostrar username debajo de la imagen -->
          <div class="text-center mb-3">
            <p class="username">{{ usuario.username }}</p>
          </div>
          <form (ngSubmit)="toggleEdit()">
            <!-- Email (deshabilitado) -->
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email"
                     id="email"
                     class="form-control"
                     [(ngModel)]="usuario.email"
                     name="email"
                     disabled>
            </div>
            <!-- Nombre -->
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input type="text"
                     id="nombre"
                     class="form-control"
                     [(ngModel)]="usuario.nombre"
                     name="nombre"
                     [disabled]="!isEditing"
                     required>
            </div>
            <!-- Apellido Paterno -->
            <div class="mb-3">
              <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
              <input type="text"
                     id="apellidoPaterno"
                     class="form-control"
                     [(ngModel)]="usuario.apellidoPaterno"
                     name="apellidoPaterno"
                     [disabled]="!isEditing"
                     required>
            </div>
            <!-- Edad -->
            <div class="mb-3">
              <label for="edad" class="form-label">Edad</label>
              <input type="text"
                     id="edad"
                     class="form-control"
                     [(ngModel)]="usuario.edad"
                     name="edad"
                     [disabled]="!isEditing"
                     required>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              {{ isEditing ? 'Guardar Cambios' : 'Editar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Host: cubrir toda la pantalla con fondo oscuro */
    :host {
      display: block;
      width: 100vw;
      min-height: 100vh;
      background-color: #121212;
      color: #e0e0e0;
      margin: 0;
      overflow-x: hidden;
    }
    /* Contenedor principal centrado */
    .perfil-container {
      max-width: 400px;
      margin: 100px auto 1rem auto; /* Ajusta '100px' según la altura del navbar */
      padding: 1rem;
    }
    /* Tarjeta de perfil personalizada */
    .perfil-card {
      background-color: #1e1e1e;
      border: none;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    }
    /* Título de perfil en blanco */
    .profile-title {
      color: #ffffff;
    }
    /* Ajuste de labels y campos de Bootstrap */
    .form-label {
      color: #e0e0e0;
    }
    .form-control {
      background-color: #2c2c2c;
      color: #e0e0e0;
      border: none;
    }
    .form-control:focus {
      box-shadow: none;
    }
    /* Imagen de perfil: tamaño forzado, redonda y centrada */
    .profile-img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid #ff9800;
    }
    /* Estilo para el username */
    .username {
      font-size: 1.2rem;
      font-weight: bold;
      color: #ffffff;
      margin: 0;
    }
  `]
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioDTO = {
    username: '',
    password: '',
    email: '',
    role: 'USER',
    nombre: '',
    apellidoPaterno: '',
    edad: 0,
    fechaNacimiento: new Date()
  };

  isEditing: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const userId = 1;
    this.usuarioService.obtenerUsuarioPorId(userId).subscribe({
      next: (data: UsuarioDTO) => {
        this.usuario = data;
      },
      error: (error) => console.error('Error loading user profile:', error)
    });
  }

  toggleEdit(): void {
    if (!this.isEditing) {
      this.isEditing = true;
    } else {
      // Guardar cambios y salir del modo edición
      this.usuarioService.modificarUsuario(this.usuario).subscribe({
        next: (updatedUser) => {
          this.usuario = updatedUser;
          this.isEditing = false;
        },
        error: (error) => console.error('Failed to update profile:', error)
      });
    }
  }
}
