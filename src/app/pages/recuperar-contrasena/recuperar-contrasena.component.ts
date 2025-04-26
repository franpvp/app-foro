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
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']

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
