import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { DepartmentService } from '../../services/department.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  isLoading = signal(true);
  studentCount = signal(0);
  departmentCount = signal(0);
  courseCount = signal(0);
  enrollmentCount = signal(0);

  ngOnInit(): void {
    forkJoin({
      students: this.studentService.getAll(),
      departments: this.departmentService.getAll(),
      courses: this.courseService.getAll(),
      enrollments: this.enrollmentService.getAll(),
    }).subscribe({
      next: (data) => {
        this.studentCount.set(data.students.length);
        this.departmentCount.set(data.departments.length);
        this.courseCount.set(data.courses.length);
        this.enrollmentCount.set(data.enrollments.length);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
