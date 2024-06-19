export interface Letter {
    idOficio: number;
    idCliente?: number;
    idNorma?: number;
    folio?: number;
    fOficio?: string;
    fPresentacion?: boolean;
    hPresentacion?: string;
    observaciones?: string;
    idEjecutivo?: number;
    idFuncionario?: number;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: number;
    idEstatus?: number;
    clave?: string;
}


export interface LetterDetail {
    idOficioDetalle: Number;
    idOficio?: Number;
    clave?: Number;
    fSolicitudFmt?: string;
    idSolicitud?: Number;
}