import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="site-footer">
      <div class="footer-content">
        <!-- Logo / Nombre -->
        <div class="footer-section footer-logo">
          <strong>PublicaTodo</strong>
        </div>
        <!-- Enlaces Rápidos -->
        <div class="footer-section quick-links">
          <a routerLink="/home">Inicio</a>
          <a routerLink="/perfil">Perfil</a>
          <a routerLink="/contacto">Contacto</a>
        </div>
        <!-- Redes Sociales -->
        <div class="footer-section footer-social">
          <a href="https://instagram.com" target="_blank"><i class="bi bi-instagram"></i></a>
          <a href="https://twitter.com" target="_blank"><i class="bi bi-twitter"></i></a>
          <a href="https://github.com" target="_blank"><i class="bi bi-github"></i></a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .site-footer {
      margin-top: 3rem; 
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border-top: 1px solid rgba(255,255,255,0.2);
      padding: 1rem 2rem;
      color: #fff;
    }
    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      text-align: center;
    }
    .footer-section { margin: 0.5rem 0; }
    .quick-links a {
      margin: 0 0.5rem;
      color: #ffffffcc;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .quick-links a:hover { color: #fff; }
    .footer-social a {
      color: #fff;
      margin: 0 0.5rem;
      font-size: 1.2rem;
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
    }
    .footer-social a:hover {
      color: #ff8a00;
      transform: scale(1.1);
    }
    @media (max-width: 600px) {
      .footer-content { flex-direction: column; }
    }
  `]
})
export class FooterComponent {}
