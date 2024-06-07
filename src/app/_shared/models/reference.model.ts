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

  