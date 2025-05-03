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
  mostrarPassword = false;
  confirmContrasena: string = '';
  mostrarNuevaContrasena: boolean = false;
  mostrarConfirmContrasena: boolean = false;
  showPopup: boolean = false;
  showErrorPassword = false;
  showMismatch: boolean = false;
  showSuccess: boolean = false;


  constructor(private usuarioService: UsuarioService, private router: Router) {}

  onSubmit() {
    if (this.nuevaContrasena !== this.confirmContrasena) {
        this.showMismatch = true;
        return;
    }
    this.usuarioService.cambiarContrasena(this.email, this.nuevaContrasena).subscribe({
      next: () => {
        this.showSuccess = true;
      },
      error: (err) => {
        console.error('Error al cambiar la contraseña', err);
        this.showMismatch = true;
      }
    });
  }

  esPasswordValida(password: string): boolean {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;
    return regex.test(password);
  }

  toggleNuevaPassword(): void {
    this.mostrarNuevaContrasena = !this.mostrarNuevaContrasena;
  }

  toggleConfirmPassword(): void {
    this.mostrarConfirmContrasena = !this.mostrarConfirmContrasena;
  }

  onSuccessPopupClose(): void {
      this.showSuccess = false;
      this.router.navigate(['/login']);
    }
}
