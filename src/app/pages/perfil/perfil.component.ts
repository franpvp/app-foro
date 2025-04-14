import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="perfil-container">
      <div class="perfil-card">
        <div class="card-header">
          <h3 class="profile-title">Perfil</h3>
        </div>
        <div class="card-body">
          <div class="profile-image-container">
            <img src="assets/perfil.png" class="profile-img" alt="Profile Image">
          </div>
          <div class="username">{{ usuario.username }}</div>
          <form (ngSubmit)="toggleEdit()">
            <div class="form-group">
              <label>Email</label>
              <input type="email" class="form-control" [(ngModel)]="usuario.email" name="email" disabled>
            </div>
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="usuario.nombre" name="nombre" [disabled]="!isEditing" required>
            </div>
            <div class="form-group">
              <label>Apellido Paterno</label>
              <input type="text" class="form-control" [(ngModel)]="usuario.apellidoPaterno" name="apellidoPaterno" [disabled]="!isEditing" required>
            </div>
            <div class="form-group">
              <label>Edad</label>
              <input type="text" class="form-control" [(ngModel)]="usuario.edad" name="edad" [disabled]="!isEditing" required>
            </div>
            <button type="submit" class="btn btn-primary w-100">
              {{ isEditing ? 'Guardar Cambios' : 'Editar' }}
            </button>
          </form>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #121212;
      min-height: 100vh;
      color: #e0e0e0;
      padding-bottom: 2rem;
    }
    .perfil-container {
      max-width: 400px;
      margin: 100px auto 1rem;
      padding: 1rem;
    }
    .perfil-card {
      background: rgba(30,30,30,0.9);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      padding: 1rem;
    }
    .profile-title { text-align: center; color: #fff; }
    .profile-image-container { text-align: center; margin-bottom: 1rem; }
    .profile-img {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 50%;
      border: 3px solid #ff9800;
    }
    .username { text-align: center; font-size: 1.2rem; font-weight: bold; margin-bottom: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-control {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 0.5rem;
      color: #fff;
    }
    label { color: #e0e0e0; }
    button.btn { border-radius: 8px; }
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
  constructor(private usuarioService: UsuarioService, private router: Router) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) { this.router.navigate(['/login']); return; }
    this.usuarioService.obtenerUsuarioPorId(Number(userId)).subscribe({
      next: (data: UsuarioDTO) => { this.usuario = data; },
      error: (error) => { console.error('Error loading user profile:', error); this.router.navigate(['/login']); }
    });
  }
  toggleEdit(): void {
    if (!this.isEditing) { this.isEditing = true; }
    else {
      this.usuarioService.modificarUsuario(this.usuario).subscribe({
        next: (updatedUser) => { this.usuario = updatedUser; this.isEditing = false; },
        error: (error) => console.error('Failed to update profile:', error)
      });
    }
  }
}
