export interface PublicacionDTO {
  idPublicacion?: number;
  idUsuario: number;
  titulo: string;
  categoria: string;
  contenido: string;
  fechaCreacion: Date;
}
