export interface Asistencia {
    tutor_id:    number;
    aula_id:     number;
    fechaclase:  string | Date;
    asistencias: AsistenciaElement[];
}

export interface AsistenciaElement {
    estudiante_id: number;
    estado:        string;
}
