export interface AuthTokens {
  refresh: string;
  access: string;
  id: number;
  role: 'administrador' | 'tutor';
}
