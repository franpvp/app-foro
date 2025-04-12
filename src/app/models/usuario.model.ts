export interface UsuarioDTO {
  id?: number;
  username: string;
  password: string;
  email: string;
  role: string;
  nombre: string;
  apellidoPaterno: string;
  edad: number;
  fechaNacimiento: Date;
}