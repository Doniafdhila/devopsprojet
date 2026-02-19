import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Depatment`;

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}/getAllDepartment`);
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.baseUrl}/getDepartment/${id}`);
  }

  create(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.baseUrl}/createDepartment`, department);
  }

  update(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.baseUrl}/updateDepartment`, department);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDepartment/${id}`);
  }
}
