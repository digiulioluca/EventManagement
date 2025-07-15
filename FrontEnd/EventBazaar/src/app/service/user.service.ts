import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDTO } from '../module/userDTO';

@Injectable({ providedIn: 'root' }) // Rende il servizio disponibile globalmente nell'app (singleton)
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';
  // URL base per tutte le chiamate al backend riguardanti gli utenti
  constructor(private http: HttpClient) {}
/**
   * Recupera i dati di un utente specifico tramite UUID
   * @param uuid identificativo univoco dell'utente
   * @returns Observable contenente i dati dell'utente
   */
  getUserByUuid(uuid: string): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.baseUrl}/${uuid}`);
  }
/**
   * Esegue l'update completo dell'utente specificato
   * @param uuid identificativo dell'utente
   * @param data oggetto con i nuovi dati dell'utente
   * @returns Observable con l'utente aggiornato
   */
  updateUser(uuid: string, data: UserDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }
/**
   * Esegue un aggiornamento parziale (PATCH) dell'utente specificato
   * @param uuid identificativo dell'utente
   * @param data oggetto parziale con i campi da aggiornare
   * @returns Observable con l'utente aggiornato
   */
  partialUpdateUser(uuid: string, data: Partial<UserDTO>): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/${uuid}`, data);
  }
/**
   * Elimina un utente dal sistema tramite UUID
   * @param uuid identificativo dell'utente
   * @returns Observable che si completa al termine dell'eliminazione
   */
  deleteUser(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${uuid}`);
  }
}
