import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput [(ngModel)]="username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="fill" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
            </mat-form-field>

            <div class="button-container">
              <button mat-raised-button color="accent" type="submit">Login</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* Contenedor general con fondo oscuro y centrado */
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #121212;
      padding: 1rem;
    }
    /* Estilo del mat-card para un look oscuro y elegante */
    mat-card {
      width: 100%;
      max-width: 400px;
      background-color: #1e1e1e;
      color: #e0e0e0;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
      border-radius: 8px;
    }
    /* Se asegura que los campos ocupen el 100% del ancho disponible */
    .full-width {
      width: 100%;
    }
    /* Espaciado entre campos */
    mat-form-field {
      margin-bottom: 1rem;
    }
    /* Centrado del botón */
    .button-container {
      display: flex;
      justify-content: center;
    }
    /* Ajuste al botón en modo oscuro y con color acentuado */
    ::ng-deep .mat-raised-button.mat-accent {
      background-color: #ff9800;
      color: #1e1e1e;
    }
    /* Animación de sacudida para el efecto visual */
    @keyframes shake {
      0% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      50% { transform: translateX(5px); }
      75% { transform: translateX(-5px); }
      100% { transform: translateX(0); }
    }
    .logging-in {
      animation: shake 0.5s;
    }
    /* Responsividad: Se asegura de un margen adecuado en pantallas pequeñas */
    @media (max-width: 600px) {
      mat-card {
        margin: 0 1rem;
      }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    // Añade una clase para disparar la animación y mejorar la experiencia de usuario
    const card = document.querySelector('mat-card');
    if (card) {
      card.classList.add('logging-in');
      // Remueve la clase después de que finalice la animación para evitar efectos persistentes
      setTimeout(() => {
        card.classList.remove('logging-in');
      }, 500);
    }

    // Llama al servicio de autenticación
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
