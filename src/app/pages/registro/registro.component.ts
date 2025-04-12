import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    NavbarComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Registro</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="usuario.username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="usuario.password" name="password" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput type="email" [(ngModel)]="usuario.email" name="email" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput [(ngModel)]="usuario.nombre" name="nombre" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Apellido Paterno</mat-label>
              <input matInput [(ngModel)]="usuario.apellidoPaterno" name="apellidoPaterno" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Edad</mat-label>
              <input matInput type="number" [(ngModel)]="usuario.edad" name="edad" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Fecha de Nacimiento</mat-label>
              <input matInput type="date" [(ngModel)]="usuario.fechaNacimiento" name="fechaNacimiento" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">Registrar</button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* Aplicado al host para forzar fondo oscuro a toda la pantalla */
    :host {
      display: block;
      background-color: #121212;
      width: 100vw;
      min-height: 100vh;
      margin: 0;
      overflow-x: hidden;
    }
    /* Contenedor principal: centra la tarjeta y deja espacio para el navbar */
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      width: 100%;
      /* Ajusta la altura según la presencia del navbar;
         aquí se asume que el navbar ocupa 70px */
      min-height: calc(100vh - 70px);
      margin-top: 70px;
    }
    /* Tarjeta de registro: fondo oscuro, sombra y bordes redondeados */
    mat-card {
      width: 100%;
      max-width: 400px;
      background-color: #1e1e1e;
      color: #e0e0e0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }
    /* Asegura que los campos ocupen todo el ancho */
    .full-width {
      width: 100%;
    }
    /* Espacio entre campos */
    mat-form-field {
      margin-bottom: 1rem;
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

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onSubmit() {
    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
      }
    });
  }
}
