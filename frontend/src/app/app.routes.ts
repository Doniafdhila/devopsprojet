import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudentListComponent } from './components/students/student-list.component';
import { DepartmentListComponent } from './components/departments/department-list.component';
import { CourseListComponent } from './components/courses/course-list.component';
import { EnrollmentListComponent } from './components/enrollments/enrollment-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'courses', component: CourseListComponent },
  { path: 'enrollments', component: EnrollmentListComponent },
  { path: '**', redirectTo: 'dashboard' },
];
