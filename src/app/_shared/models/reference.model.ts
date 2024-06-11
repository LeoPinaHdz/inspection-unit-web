export interface Reference {
    idFolio: Number;
    idCliente?: Number;
    idNorma?: Number;
    folio?: string;
    clave?: Number;
    fFolio?: string;
    fVigencia?: string;
    numeroUI?: string;
    modalidad?: Number;
    persona?: Number;
    pedimento?: string;
    factura?: string;
    archivo?: string;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: Number;
    idEstatus?: Number;
    foliosDetalle?: ReferenceDetail[];
}

export interface ReferenceDetail {
    idFolioDetalle: Number;
    idFolio?: Number;
    partida?: Number;
    idCliente?: Number;
    subfolio?: string;
    fraccion?: string;
    marca?: string;
    producto?: string;
    modelo?: string;
    idUnidad?: Number;
    cantidad?: Number;
    etiquetas?: Number;
    idPais?: string;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: Number;
    idEstatus?: Number;
    saldo?: Number;
}

export interface ReferenceHeaderFileM {
    cons?: string;
    pedimento?: string;
    aduana?: string;
    patente?: string;
    cliente?: string;
    nombreArchivo?: string;
    idBodega?: string;
}

export interface ReferenceDetailFileM {
    uva?: string;
    norma?: string;
    fraccion?: string;
    modalidad?: string;
    producto?: string;
    cantidad?: string;
    umc?: string;
}

export interface ReferenceCsvFile {
    FolioMadre?: string;
    FolioHijo?: string;
    Modelo?: string;
    Fraccion?: string;
    Resultado?: string;
}

  