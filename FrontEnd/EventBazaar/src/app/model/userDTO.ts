export interface UserDTO {
  uuid: string;
  name: string;
  password?: string | null;
  email: string;
  role: string;
  reservations?: any[] | null;
  events?: any[] | null;
}
