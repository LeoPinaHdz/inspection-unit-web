export interface Login {
    userName: string;
    password: string;
}

export interface User {
    idUsuario: Number;
    idUsuarioCreacion?: Number;
    usuario?: string;
    nombre?: string;
    idEstatus?: Number;
    contrasena?: string;
    pantallas?: string[];
}