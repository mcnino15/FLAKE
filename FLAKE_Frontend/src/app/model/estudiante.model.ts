export interface Estudiante {
  idestudiante: number;
  persona: Persona;
  instituciones: Instituciones | number;
  aula: Aula | number;
}
export interface EstudianteCrear {
  cedula:           string;
  primer_nombre:    string;
  segundo_nombre:   string;
  primer_apellido:  string;
  segundo_apellido: string;
  genero:           string;
  fecha_nacimiento: Date;
  estrato:          string;
  password:         string;
  instituciones:    number;
  aula:             number;
}
export interface Aula {
  idaula: number;
  grado: string;
  gradunum: number;
  grupo: number;
  jornada: string;
  institucion: number;
}

export interface Instituciones {
  idinstitucion: number;
  instnombre: string;
  direccion: string;
  barrio: string;
}

export interface Persona {
  id: number;
  password: string;
  last_login: null;
  is_superuser: boolean;
  cedula: string;
  primer_nombre: string;
  segundo_nombre: string;
  primer_apellido: string;
  segundo_apellido: string;
  genero: string;
  fecha_nacimiento: Date;
  estrato: string;
  is_active: boolean;
  is_staff: boolean;
  groups: any[];
  user_permissions: any[];
}
