export interface Request {
    idSolicitud: number;
    idContrato?: number;
    idCliente?: number;
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
}