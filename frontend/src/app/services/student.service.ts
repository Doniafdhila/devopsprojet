import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/getAllStudents`);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/getStudent/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.baseUrl}/createStudent`, student);
  }

  update(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.baseUrl}/updateStudent`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteStudent/${id}`);
  }
}
