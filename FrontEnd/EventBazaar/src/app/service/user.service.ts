import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDTO } from '../model/userDTO';

@Injectable({ providedIn: 'root' }) // Rende il servizio disponibile globalmente nell'app (singleton)
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/users';
  // URL base per tutte le chiamate al backend riguardanti gli utenti

  // === INIZIO AGGIUNTE PER GESTIONE UTENTE CORRENTE ===
  private currentUserSubject = new BehaviorSubject<UserDTO | null>(null);
  /** Observable per ascoltare i cambiamenti all'utente loggato */
  user$ = this.currentUserSubject.asObservable();

  /**
   * Carica i dati dell'utente loggato tramite UUID e li salva nello stato locale
   * @param uuid identificativo univoco dell'utente
   */
  loadUserByUuid(uuid: string): void {
    this.getUserByUuid(uuid).subscribe({
      next: (user) => this.currentUserSubject.next(user),
      error: (err) => {
        console.error("Errore durante il caricamento dell'utente:", err);
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Restituisce l'utente attualmente loggato (sincrono)
   */
  getCurrentUser(): UserDTO | null {
    return this.currentUserSubject.value;
  }

  /**
   * Resetta lo stato dell'utente loggato
   */
  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('uuid');
  }
  // === FINE AGGIUNTE ===

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
