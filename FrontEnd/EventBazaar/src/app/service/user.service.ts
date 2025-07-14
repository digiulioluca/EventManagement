import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../module/userDTO';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users'; 

  constructor(private http: HttpClient) {}

  getUserByUuid(uuid: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${uuid}`);
  }

  updateUser(uuid: string, data: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }

  partialUpdateUser(uuid: string, data: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }

  deleteUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}