export interface Letter {
    idOficio: number;
    idCliente?: number;
    idNorma?: number;
    folio?: number;
    fOficio?: string;
    fPresentacion?: boolean;
    hPresentacion?: string;
    observaciones?: string;
    idRepresentante?: number;
    idEjecutivo?: number;
    idFuncionario?: number;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: number;
    idEstatus?: number;
}