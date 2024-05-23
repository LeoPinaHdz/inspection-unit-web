export interface Executive {
    idEjecutivo: Number;
    nombre?: string;
    telefono?: string;
    email?: string;
    signatario?: boolean;
    inspector?: boolean;
    fCaptura?: string;
    fModificacion?: string;
    idUsuario?: Number;
    idEstatus?: Number;
    normaEjecutivo?: ExecutiveStandards[];
}

export interface ExecutiveStandards {
    idNormaEjecutivo?: Number;
    idNorma: Number;
    idEjecutivo?: Number;
}