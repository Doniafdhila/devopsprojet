import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/courses`;

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/getAllCourses`);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/getCourse/${id}`);
  }

  create(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.baseUrl}/createCourse`, course);
  }

  update(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.baseUrl}/updateCourse`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteCourse/${id}`);
  }
}
