import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="container d-flex justify-content-center align-items-center min-vh-100">
      <div class="card bg-dark text-light shadow-lg p-4" style="width: 100%; max-width: 500px;">
        <h3 class="text-center mb-4">Registro</h3>
        <form #registroForm="ngForm" (ngSubmit)="onSubmit()">

          <!-- Username -->
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
              type="text"
              class="form-control"
              id="username"
              name="username"
              required
              maxlength="10"
              [(ngModel)]="usuario.username"
              #usernameInput="ngModel"
              [class.is-invalid]="usernameInput.invalid && (usernameInput.touched || registroForm.submitted)" />
            <div *ngIf="usernameInput.invalid && (usernameInput.touched || registroForm.submitted)" class="invalid-feedback">
              El username es obligatorio y no puede tener más de 10 caracteres.
            </div>
          </div>

          <!-- Password -->
          <div class="mb-3 position-relative">
            <label for="password" class="form-label">Contraseña</label>
            <div class="input-group">
              <input
                [type]="mostrarPassword ? 'text' : 'password'"
                class="form-control"
                id="password"
                name="password"
                required
                [(ngModel)]="usuario.password"
                #passwordInput="ngModel"
                [class.is-invalid]="!esPasswordValida(usuario.password) && (passwordInput.touched || registroForm.submitted)" />
              <button type="button" class="btn btn-outline-secondary" (click)="togglePassword()" tabindex="-1">
                <i class="bi" [ngClass]="mostrarPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
              </button>
            </div>
            <div *ngIf="!esPasswordValida(usuario.password) && (passwordInput.touched || registroForm.submitted)" class="invalid-feedback d-block">
              La contraseña debe tener entre 6 y 16 caracteres, incluir letras, al menos un número y un carácter especial.
            </div>
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Correo Electrónico</label>
            <input
              type="email"
              class="form-control"
              id="email"
              name="email"
              required
              [(ngModel)]="usuario.email"
              #emailInput="ngModel"
              [class.is-invalid]="!esEmailValido(usuario.email) && (emailInput.touched || registroForm.submitted)" />
            <div *ngIf="!esEmailValido(usuario.email) && (emailInput.touched || registroForm.submitted)" class="invalid-feedback">
              Ingresa un correo válido.
            </div>
          </div>

          <!-- Nombre -->
          <div class="mb-3">
            <label for="nombre" class="form-label">Nombre</label>
            <input
              type="text"
              class="form-control"
              id="nombre"
              name="nombre"
              required
              [(ngModel)]="usuario.nombre"
              #nombreInput="ngModel"
              [class.is-invalid]="!esNombreValido(usuario.nombre) && (nombreInput.touched || registroForm.submitted)" />
            <div *ngIf="!esNombreValido(usuario.nombre) && (nombreInput.touched || registroForm.submitted)" class="invalid-feedback">
              Ingrese mínimo 2 caracteres.
            </div>
          </div>

          <!-- Apellido Paterno -->
          <div class="mb-3">
            <label for="apellidoPaterno" class="form-label">Apellido Paterno</label>
            <input
              type="text"
              class="form-control"
              id="apellidoPaterno"
              name="apellidoPaterno"
              required
              [(ngModel)]="usuario.apellidoPaterno"
              #apellidoInput="ngModel"
              [class.is-invalid]="!esNombreValido(usuario.apellidoPaterno) && (apellidoInput.touched || registroForm.submitted)" />
            <div *ngIf="!esNombreValido(usuario.apellidoPaterno) && (apellidoInput.touched || registroForm.submitted)" class="invalid-feedback">
              Ingrese mínimo 2 caracteres.
            </div>
          </div>

          <!-- Edad -->
          <div class="mb-3">
            <label for="edad" class="form-label">Edad</label>
            <input
              type="number"
              class="form-control"
              id="edad"
              name="edad"
              required
              min="1"
              [(ngModel)]="usuario.edad"
              #edadInput="ngModel"
              [class.is-invalid]="usuario.edad < 1 && (edadInput.touched || registroForm.submitted)" />
            <div *ngIf="usuario.edad < 1 && (edadInput.touched || registroForm.submitted)" class="invalid-feedback">
              La edad debe ser mayor o igual a 1.
            </div>
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="mb-3">
            <label for="fechaNacimiento" class="form-label">Fecha de Nacimiento</label>
            <input
              type="date"
              class="form-control"
              id="fechaNacimiento"
              name="fechaNacimiento"
              required
              [(ngModel)]="usuario.fechaNacimiento"
              #fechaInput="ngModel"
              [class.is-invalid]="!usuario.fechaNacimiento && (fechaInput.touched || registroForm.submitted)" />
            <div *ngIf="!usuario.fechaNacimiento && (fechaInput.touched || registroForm.submitted)" class="invalid-feedback">
              La fecha es obligatoria.
            </div>
          </div>
          <button type="submit" class="btn btn-warning w-100">Registrar</button>
        </form>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #121212;
      width: 100%;
      overflow-x: hidden;
    }

    .container {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      width: 100%;
      margin-top: 70px;
    }
  `]
})
export class RegistroComponent {
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

  mostrarPassword = false; // 👁 para mostrar u ocultar la contraseña
  mostrarErrorPassword = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    this.mostrarErrorPassword = false;

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;

    if (!passwordRegex.test(this.usuario.password)) {
      this.mostrarErrorPassword = true;
      return;
    }

    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => console.error('Registration failed:', error)
    });
  }

  esPasswordValida(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;
    return regex.test(password || '');
  }

  esEmailValido(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl)$/;
    return regex.test(email || '');
  }

  esNombreValido(nombre: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/;
    return regex.test(nombre || '');
  }
}
