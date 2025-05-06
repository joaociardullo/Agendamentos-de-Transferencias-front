import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Transferencia } from './transferencia.model';

@Injectable({ providedIn: 'root' })
export class TransferenciaService {
  private apiUrl = 'http://localhost:8080/transferencias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  criar(transferencia: Transferencia): Observable<Transferencia> {
    return this.http.post<Transferencia>(this.apiUrl, transferencia).pipe(
      catchError(this.handleError)
    );
  }

  atualizar(id: number, transferencia: Transferencia): Observable<Transferencia> {
    return this.http.put<Transferencia>(`${this.apiUrl}/${id}`, transferencia).pipe(
      catchError(this.handleError)
    );
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }


  buscarPorConta(contaOrigem: string): Observable<Transferencia[]> {
    return this.http.get<Transferencia[]>(`${this.apiUrl}/buscarContaOrigem/${contaOrigem}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('Ocorreu um erro:', error);
    return throwError(() => new Error('Ocorreu um erro ao processar sua solicitação.'));
  }
}