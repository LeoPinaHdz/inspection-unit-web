export interface List {
    idLista: number;
    idSolicitud?: number;
    dictaminacion?: string;
    idEjecutivo?: number;
    idEjecutivo2?: number;
    fInspeccion?: string;
    fPresentacion?: string;
    tecnica?: string;
    muestra?: string;
    instrumento?: string;
    lote?: string;
    observaciones?: string;
    puntos?: string;
    contenido?: string;
    resumen?: string;
    idEstatus?: number;
    idUsuario?: number;
    fCaptura?: string;
    fModificacion?: string;
    idPresentacion?: number;
    listasDetalle?: ListDetail[];
    listasPunto?: ListPoint[];
}

export interface ListDetail {
    idListaDetalle: Number;
    idFolioDetalle?: Number;
    idSolicitudDetalle?: Number;
    cantidad?: Number;
    idEstatus?: string;
}

export interface ListPoint {
    idListaPunto: number;
    idPunto?: number;
    dictaminacion?: string;
    observaciones?: string;
}
