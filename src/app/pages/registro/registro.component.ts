import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuarios/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  usuario: UsuarioDTO = {
    username: '',
    password: '',
    email: '',
    role: 'USER',
    nombre: '',
    apellidoPaterno: '',
    edad: 0,
    fechaNacimiento: new Date()
  };

  mostrarPassword = false;
  mostrarErrorPassword = false;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    this.mostrarErrorPassword = false;

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;

    if (!passwordRegex.test(this.usuario.password)) {
      this.mostrarErrorPassword = true;
      return;
    }

    this.usuarioService.registrarUsuario(this.usuario).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (error) => console.error('Registration failed:', error)
    });
  }

  esPasswordValida(password: string): boolean {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,16}$/;
    return regex.test(password || '');
  }

  esEmailValido(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|cl)$/;
    return regex.test(email || '');
  }

  esNombreValido(nombre: string): boolean {
    const regex = /^[A-Za-zÁÉÍÓÚÑáéíóúñ]{2,}$/;
    return regex.test(nombre || '');
  }
}
