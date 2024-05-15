export interface ReportParameters {
    idReporte: Number;
    ReciboIni?: string;
    ReciboFin?: string;
    ArticuloIni?: string;
    ArticuloFin?: string;
    Fecha: string;
    FechaCierre: string;
    MovimientosEnCero: Number;
}

export interface ReportType {
    idReporte: Number;
    nombre?: string;
}
