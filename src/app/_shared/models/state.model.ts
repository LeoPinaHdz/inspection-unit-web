export interface State {
    idEstado: number;
    nombre?: string;
    abrev?: string;
    specs?: StandardSpec[]
}

export interface StandardSpec {
    idNormaPunto: number,
    idNorma?: number,
    punto: number,
    contenido?: string
}