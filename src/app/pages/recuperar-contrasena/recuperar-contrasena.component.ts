import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <h2>Recuperar Contraseña</h2>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Email:</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div class="form-group">
          <label>Nueva Contraseña:</label>
          <input type="password" [(ngModel)]="nuevaContrasena" name="nuevaContrasena" required />
        </div>
        <button type="submit">Cambiar Contraseña</button>
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
      padding: 1rem;
    }
    .container {
      max-width: 400px;
      margin: 100px auto;
      padding: 1rem;
      background: rgba(30, 30, 30, 0.9);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    }
    h2 {
      text-align: center;
      margin-bottom: 1rem;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border-radius: 4px;
      border: none;
      background: rgba(0, 0, 0, 0.3);
      color: #fff;
    }
    button {
      display: block;
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      background: linear-gradient(45deg, #833ab4, #ee2a7b);
      color: #fff;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    button:hover {
      background: linear-gradient(45deg, #ee2a7b, #833ab4);
    }
  `]
})
export class RecuperarContrasenaComponent {
  email: string = '';
  nuevaContrasena: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onSubmit() {
    this.usuarioService.cambiarContrasena(this.email, this.nuevaContrasena).subscribe({
      next: () => {
        alert('Contraseña actualizada exitosamente.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cambiar la contraseña', err);
        alert('Error al cambiar la contraseña. Intenta nuevamente.');
      }
    });
  }
}
