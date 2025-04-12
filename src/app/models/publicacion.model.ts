export interface PublicacionDTO {
  idPublicacion?: number;
  idUsuario: number;
  titulo: string;
  contenido: string;
  fechaCreacion: Date;
}