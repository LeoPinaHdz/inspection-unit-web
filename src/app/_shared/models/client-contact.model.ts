export interface ClientContact {
    idContacto: Number;
    idCliente: Number;
    nombre: string;
    puesto?: string;
    telefono?: string;
    extension?: string;
    email?: string;
    idTipo: Number;
    fCaptura: string;
    fModificacion: string;
    idUsuario: Number;
    idEstatus: Number;
}