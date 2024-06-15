export interface Request {
    idSolicitud: number;
    idContrato?: number;
    idCliente?: number;
    folio?: number;
    idNorma?: number;
    pedimento?: string;
    tipoServicio?: boolean;
    tipoRegimen?: boolean;
    fSolicitud?: string;
    fPrograma?: string;
    idRepresentante?: number;
    idContacto?: number;
    idLugar?: number;
    idFuncionario?: number;
    idEjecutivo?: number;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: number;
    idEstatus?: number;
    clave?: string;
    detalles?: RequestDetail[];
}

export interface RequestDetail {
    idSolicitudDetalle: Number;
    idSolicitud?: Number;
    partida?: number;
    modelo?: Number;
    producto?: Number;
    cantidad?: Number;
    idUnidad?: Number;
    marca?: string;
    pais?: string;
}