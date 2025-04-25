import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/registro/registro.component').then(m => m.RegistroComponent)
  },
  {
    path: 'recuperar-contrasena',
    loadComponent: () =>
      import('./pages/recuperar-contrasena/recuperar-contrasena.component').then(m => m.RecuperarContrasenaComponent)
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/perfil/perfil.component').then(m => m.PerfilComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [AuthGuard] // Puedes agregar AdminGuard aquí si lo tienes
  },
  {
    path: 'admin/editar-comentario/:id',
    loadComponent: () =>
      import('./pages/admin/editar-comentario.component').then(m => m.EditarComentarioComponent),
    canActivate: [AuthGuard] // o [AuthGuard, AdminGuard] según necesidad
  },
  {
    path: 'admin/editar-usuario/:id',
    loadComponent: () =>
      import('./pages/admin/editar-usuario.component').then(m => m.EditarUsuarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/editar-publicacion/:id',
    loadComponent: () =>
      import('./pages/admin/editar-publicacion.component').then(m => m.EditarPublicacionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
