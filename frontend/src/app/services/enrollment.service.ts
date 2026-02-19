import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Enrollment`;

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.baseUrl}/getAllEnrollment`);
  }

  getById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.baseUrl}/getEnrollment/${id}`);
  }

  create(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.baseUrl}/createEnrollment`, enrollment);
  }

  update(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.baseUrl}/updateEnrollment`, enrollment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteEnrollment/${id}`);
  }
}
