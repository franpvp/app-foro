import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']

})
export class PerfilComponent implements OnInit {
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
  isEditing: boolean = false;
  constructor(private usuarioService: UsuarioService, private router: Router) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) { this.router.navigate(['/login']); return; }
    this.usuarioService.obtenerUsuarioPorId(Number(userId)).subscribe({
      next: (data: UsuarioDTO) => { this.usuario = data; },
      error: (error) => { console.error('Error loading user profile:', error); this.router.navigate(['/login']); }
    });
  }
  toggleEdit(): void {
    if (!this.isEditing) { this.isEditing = true; }
    else {
      this.usuarioService.modificarUsuario(this.usuario).subscribe({
        next: (updatedUser) => { this.usuario = updatedUser; this.isEditing = false; },
        error: (error) => console.error('Failed to update profile:', error)
      });
    }
  }
}
