import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  template: `
  <app-navbar></app-navbar>
  <div class="login-container">
    <div class="card bg-dark text-light shadow-lg p-4" style="width: 100%; max-width: 400px;">
      <h3 class="text-center mb-4">Login</h3>
      <form (ngSubmit)="onSubmit()">
        <!-- Username -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" name="username"
                 [(ngModel)]="username" required />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <div class="input-group">
            <input
              [type]="mostrarPassword ? 'text' : 'password'"
              class="form-control"
              id="password"
              name="password"
              required
              [(ngModel)]="password" />
            <button type="button" class="btn btn-outline-secondary" (click)="togglePassword()" tabindex="-1">
              <i class="bi" [ngClass]="mostrarPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <!-- Botón login -->
        <div class="d-grid">
          <button type="submit" class="btn btn-warning w-100">Login</button>
        </div>
      </form>

      <!-- Enlace para recuperar contraseña -->
      <div class="recover-link mt-3 text-center">
        <button type="button" class="recover-button" (click)="goToRecuperar()">¿Olvidaste tu contraseña?</button>
      </div>
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
    overflow-x: hidden;
  }

  .login-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin-top: 70px;
  }

  .recover-link {
    text-align: center;
    margin-top: 0.75rem;
  }

  .recover-button {
    background: transparent;
    border: none;
    color: #ff9800;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0;
    transition: color 0.3s ease;
  }

  .recover-button:hover {
    color: #ffc107;
  }

  .logging-in {
    animation: shake 0.5s;
  }

  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`]
})
export class LoginComponent {
  username = '';
  password = '';
  mostrarPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    const card = document.querySelector('.card');
    if (card) {
      card.classList.add('logging-in');
      setTimeout(() => { card.classList.remove('logging-in'); }, 500);
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => console.error('Login failed:', error)
    });
  }

  goToRecuperar(): void {
    this.router.navigate(['/recuperar-contrasena']);
  }
}
