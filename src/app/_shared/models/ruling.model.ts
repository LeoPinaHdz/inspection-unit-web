export interface Ruling {
    idDictamen: number;
    idCliente?: number;
    idLista?: number;
    folio?: number;
    dictaminacion?: string;
    fDictamen?: string;
    clave?: string;
    tipoServicio?: boolean;
    idFuncionario?: string;
    idEjecutivo?: string;
    observaciones?: string;
    idEstatus?: number;
}