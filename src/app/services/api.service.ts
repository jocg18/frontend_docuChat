import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
  // Aquí apuntamos al prefijo /api del backend
    private baseUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {}

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(`${this.baseUrl}/upload`, formData);
    }

    query<T>(payload: any): Observable<T> {
        return this.http.post<T>(`${this.baseUrl}/query`, payload);
    }
}
