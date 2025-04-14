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
import { FooterComponent } from '../../components/footer/footer.component';

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
    NavbarComponent,
    FooterComponent
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
        <!-- Enlace para recuperar contraseña -->
        <div class="recover-link">
          <button type="button" class="recover-button" (click)="goToRecuperar()">¿Olvidaste tu contraseña?</button>
        </div>
      </mat-card-content>
    </mat-card>
  </div>
  <app-footer></app-footer>
`,
styles: [`
  :host {
    display: block;
    background-color: #121212;
    min-height: 100vh;
    overflow-x: hidden;
  }
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    margin-top: 70px;
  }
  mat-card {
    width: 100%;
    max-width: 400px;
    background: rgba(30,30,30,0.8);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    color: #e0e0e0;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    border-radius: 8px;
  }
  .full-width {
    width: 100%;
  }
  mat-form-field {
    margin-bottom: 1rem;
  }
  .button-container {
    display: flex;
    justify-content: center;
  }
  ::ng-deep .mat-raised-button.mat-accent {
    background-color: #ff9800;
    color: #1e1e1e;
  }
  .recover-link {
    text-align: center;
    margin-top: 0.75rem;
  }
  .recover-link a {
    color: #ff9800;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  .recover-link a:hover {
    color: #ffc107;
  }
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
    const card = document.querySelector('mat-card');
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
