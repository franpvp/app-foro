export interface ComentarioDTO {
  idComentario?: number;
  idPublicacion: number;
  idUsuario: number;
  contenido: string;
  fechaCreacion: Date;
}