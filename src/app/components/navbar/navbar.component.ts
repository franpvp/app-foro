import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <nav class="custom-navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="logo">
        <a routerLink="/home">
          <img src="assets/logo-book.svg" alt="logo" class="logo-icon">
          <span class="logo-text">PublicaTodo</span>
        </a>
      </div>

      <!-- Icono hamburguesa -->
      <div class="menu-icon" (click)="toggleMenu()">
        <div class="bar" [class.change]="isMenuOpen"></div>
        <div class="bar" [class.change]="isMenuOpen"></div>
        <div class="bar" [class.change]="isMenuOpen"></div>
      </div>

      <!-- Enlaces -->
      <ul class="nav-links" [class.active]="isMenuOpen">
        <ng-container *ngIf="auth.isLoggedIn(); else notLogged">
          <li class="user-greeting">Hola, {{ auth.getUsername() }}</li>
          <li><a routerLink="/home">Inicio</a></li>
          <li><a routerLink="/perfil">Perfil</a></li>
          <li><a (click)="logout()" class="logout-link">Cerrar sesión</a></li>
        </ng-container>
        <ng-template #notLogged>
          <li><a routerLink="/home">Inicio</a></li>
          <li><a routerLink="/login">Login</a></li>
          <li><a routerLink="/registro">Registro</a></li>
        </ng-template>
      </ul>
    </div>
  </nav>
`,
styles: [`
  /* Navbar estilo dark-glass */
  .custom-navbar {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    transition: background 0.3s ease;
  }
  .logout-link {
    cursor: pointer;
  }
  .navbar-container {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* Logo */
  .logo a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    /* Degradado en el texto */
    background: linear-gradient(90deg, #ff5e62, #ff9966, #fcd34d);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    font-size: 1.5rem;
    transition: transform 0.3s ease;
  }
  .logo a:hover {
    transform: scale(1.05);
  }
  .logo-icon {
    width: 32px;
    height: 32px;
    filter: drop-shadow(0 0 6px rgba(255, 255, 255, 0.3));
  }
  .logo-text {
    font-family: 'Segoe UI', sans-serif;
    letter-spacing: 0.5px;
  }
  /* Enlaces de navegación */
  .nav-links {
    list-style: none;
    display: flex;
    gap: 1.5rem;
    margin: 0;
    transition: all 0.3s ease;
  }
  .nav-links li a {
    text-decoration: none;
    color: #e0e0e0;
    font-weight: 500;
    transition: color 0.3s ease;
  }
  .nav-links li a:hover {
    color: #ffca28;
  }
  /* Saludo */
  .user-greeting {
    color: #ffca28;
    font-weight: 500;
    font-size: 1rem;
  }
  /* Icono hamburguesa */
  .menu-icon {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
  }
  .bar {
    width: 25px;
    height: 3px;
    background-color: #e0e0e0;
    transition: all 0.3s ease;
  }
  .bar.change:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
  }
  .bar.change:nth-child(2) {
    opacity: 0;
  }
  .bar.change:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
  }
  /* Responsive */
  @media (max-width: 768px) {
    .menu-icon {
      display: flex;
    }
    .nav-links {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      flex-direction: column;
      align-items: center;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease;
    }
    .nav-links.active {
      max-height: 300px;
      padding-bottom: 1rem;
    }
    .nav-links li {
      padding: 1rem 0;
      width: 100%;
      text-align: center;
    }
    .user-greeting {
      font-size: 0.95rem;
      color: #ffc107;
    }
  }
`]
})
export class NavbarComponent implements OnInit {
  isMenuOpen = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Auth status:', this.auth.isLoggedIn());
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout(): void {
    const username = this.auth.getUsername();

    if (username) {
      this.auth.logout(username).subscribe({
        next: (mensaje) => {
          console.log(mensaje);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
          this.auth.logout(username).subscribe();
          this.router.navigate(['/login']);
        }
      });
    }
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
