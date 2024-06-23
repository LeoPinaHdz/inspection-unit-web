export interface ReportParameters {
    idReporte: Number;
    fInicio: string;
    fFinal: string;
    idCliente: Number;
    idNorma: Number;
}

export interface ReportType {
    idReporte: Number;
    nombre?: string;
}
