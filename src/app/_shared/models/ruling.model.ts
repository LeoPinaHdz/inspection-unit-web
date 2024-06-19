export interface Ruling {
    idDictamen: number;
    idCliente?: number;
    folio?: number;
    dictaminacion?: string;
    fDictamen?: string;
    idPresentacion?: boolean;
    idFuncionario?: string;
    idEjecutivo?: string;
    observaciones?: string;
    idEstatus?: number;
}