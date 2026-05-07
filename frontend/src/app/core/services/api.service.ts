import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`).pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(
      catchError(this.handleError),
    );
  }

  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData).pipe(
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'An unexpected error occurred';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status === 0) {
      message = 'Unable to connect to server. Please check your connection.';
    } else if (error.status === 429) {
      message = 'Too many requests. Please wait a moment and try again.';
    } else if (error.status === 413) {
      message = 'File is too large. Maximum size is 5GB.';
    } else if (error.status >= 500) {
      message = 'Server error. Please try again later.';
    }

    return throwError(() => new Error(message));
  }
}
