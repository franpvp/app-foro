import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="editar-container">
      <h2>Editar Usuario</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" [(ngModel)]="usuario.username" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" [(ngModel)]="usuario.email" required />
        </div>
        <div class="form-group">
          <label for="nombre">Nombre:</label>
          <input type="text" id="nombre" name="nombre" [(ngModel)]="usuario.nombre" required />
        </div>
        <div class="form-group">
          <label for="apellidoPaterno">Apellido Paterno:</label>
          <input type="text" id="apellidoPaterno" name="apellidoPaterno" [(ngModel)]="usuario.apellidoPaterno" required />
        </div>
        <div class="form-group">
          <label for="edad">Edad:</label>
          <input type="number" id="edad" name="edad" [(ngModel)]="usuario.edad" required />
        </div>
        <!-- Puedes agregar otros campos si es necesario -->
        <button type="submit">Actualizar Usuario</button>
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
    input {
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
export class EditarUsuarioComponent implements OnInit {
  usuario: UsuarioDTO = {
    id: 0,
    username: '',
    password: '',
    email: '',
    role: '',
    nombre: '',
    apellidoPaterno: '',
    edad: 0,
    fechaNacimiento: new Date()
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.usuarioService.obtenerUsuarioPorId(id).subscribe(
        data => this.usuario = data,
        error => {
          console.error('Error al cargar el usuario:', error);
          alert('Error al cargar el usuario.');
          this.router.navigate(['/admin']);
        }
      );
    } else {
      alert('No se encontró el ID del usuario.');
      this.router.navigate(['/admin']);
    }
  }

  onSubmit(): void {
    this.usuarioService.modificarUsuario(this.usuario).subscribe(
      data => {
        alert('Usuario actualizado exitosamente.');
        this.router.navigate(['/admin']);
      },
      error => {
        console.error('Error al actualizar el usuario:', error);
        alert('Error al actualizar el usuario.');
      }
    );
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }
}
