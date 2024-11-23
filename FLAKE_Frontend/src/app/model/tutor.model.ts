export interface Tutor {
  idtutor:       number;
  persona:       Persona;
  telefono:      string;
  correo:        string;
  direccion:     string;
  instituciones: number;
  aula:          number;
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
