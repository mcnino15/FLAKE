export interface NotaEstudianteLista {
    idnota:             number;
    estudiante:         Estudiante;
    aula:               number;
    bloque1:            number;
    bloque2:            number;
    bloque3:            number;
    bloque4:            number;
    calificacion_final: number;
    tutor:              number;
}

export interface Estudiante {
    idestudiante: number;
    persona:      Persona;
}

export interface Persona {
    id:               number;
    password:         string;
    last_login:       null;
    is_superuser:     boolean;
    cedula:           string;
    primer_nombre:    string;
    segundo_nombre:   string;
    primer_apellido:  string;
    segundo_apellido: string;
    genero:           string;
    fecha_nacimiento: Date;
    estrato:          string;
    is_active:        boolean;
    is_staff:         boolean;
    groups:           any[];
    user_permissions: any[];
}
