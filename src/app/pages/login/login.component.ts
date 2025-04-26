import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoginResponseDTO } from '../../models/login-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    this.authService.login(this.username, this.password).subscribe({
      next: (response: LoginResponseDTO) => {
        console.log(response.role);

        // Puedes guardar el token y otra información de ser necesario
        if (response.role === 'ADMIN') {
          // Si es administrador, se redirige a la página de administración
          this.router.navigate(['/admin']);
        } else {
          // Si es usuario común, se muestra un mensaje de error o se redirige a otra página según tu lógica
         //alert('Acceso denegado, solo administradores pueden ingresar.');

         this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  goToRecuperar(): void {
    this.router.navigate(['/recuperar-contrasena']);
  }
}
