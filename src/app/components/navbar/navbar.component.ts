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
        <div class="logo">
          <a routerLink="/home">MiApp</a>
        </div>
        <div class="menu-icon" (click)="toggleMenu()">
          <div class="bar" [class.change]="isMenuOpen"></div>
          <div class="bar" [class.change]="isMenuOpen"></div>
          <div class="bar" [class.change]="isMenuOpen"></div>
          <div class="bar" [class.change]="isMenuOpen"></div>
        </div>
        <ul class="nav-links" [class.active]="isMenuOpen">
          <li><a routerLink="/home">Inicio</a></li>

          <ng-container *ngIf="auth.isLoggedIn(); else notLogged">
            <li class="user-greeting">Hola, {{ auth.getUsername() }} 👋</li>
            <li><a routerLink="/perfil">Perfil</a></li>
            <li><a (click)="logout()" class="logout-link">Cerrar sesión</a></li>
          </ng-container>

          <ng-template #notLogged>
            <li><a routerLink="/login">Login</a></li>
            <li><a routerLink="/registro">Registro</a></li>
          </ng-template>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .custom-navbar {
      background-color: #1e1e1e;
      color: #e0e0e0;
      padding: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
    }
    .navbar-container {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }
    .logo a {
      font-weight: bold;
      color: #e0e0e0;
      text-decoration: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 1rem;
      margin: 0;
    }
    .nav-links li a {
      text-decoration: none;
      color: #e0e0e0;
      transition: color 0.3s ease;
      cursor: pointer;
    }
    .nav-links li a:hover {
      color: #ff9800;
    }
    .menu-icon {
      display: none;
      cursor: pointer;
      flex-direction: column;
      gap: 4px;
    }
    .menu-icon .bar {
      width: 25px;
      height: 3px;
      background-color: #e0e0e0;
      transition: 0.4s;
    }
    .menu-icon .bar.change:nth-child(1) {
      transform: rotate(-45deg) translate(-5px, 6px);
    }
    .menu-icon .bar.change:nth-child(2) {
      opacity: 0;
    }
    .menu-icon .bar.change:nth-child(3) {
      transform: rotate(45deg) translate(-5px, -6px);
    }
    @media (max-width: 768px) {
      .menu-icon {
        display: flex;
      }
      .nav-links {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background-color: #1e1e1e;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.3s ease-out;
      }
      .nav-links.active {
        max-height: 200px;
      }
      .nav-links li {
        padding: 1rem 0;
        width: 100%;
        text-align: center;
      }
    }
    .user-greeting {
      color: #ff9800;
      font-weight: 500;
      font-size: 1rem;
      display: flex;
      align-items: center;
    }

    @media (max-width: 768px) {
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
          console.log(mensaje); // <- si quieres mostrar mensaje "Sesión cerrada"
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
          // igual limpiamos localStorage en caso de error
          this.auth.logout(username).subscribe(); // o directamente localStorage.clear()
          this.router.navigate(['/login']);
        }
      });
    }
  }
  getUsername(): string | null {
    return localStorage.getItem('username');
  }
}
