import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Enrollment, Status } from '../../models/enrollment.model';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-enrollment-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Enrollment' : 'Add Enrollment' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Student</mat-label>
          <mat-select formControlName="student" [compareWith]="compareStudents">
            @for (s of students(); track s.idStudent) {
              <mat-option [value]="s">{{ s.firstName }} {{ s.lastName }}</mat-option>
            }
          </mat-select>
          @if (form.get('student')?.hasError('required') && form.get('student')?.touched) {
            <mat-error>Student is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Course</mat-label>
          <mat-select formControlName="course" [compareWith]="compareCourses">
            @for (c of courses(); track c.idCourse) {
              <mat-option [value]="c">{{ c.name }} ({{ c.code }})</mat-option>
            }
          </mat-select>
          @if (form.get('course')?.hasError('required') && form.get('course')?.touched) {
            <mat-error>Course is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Enrollment Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="enrollmentDate">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Grade</mat-label>
          <input matInput formControlName="grade" type="number" min="0" max="100" step="0.1">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            @for (s of statuses; track s) {
              <mat-option [value]="s">{{ s }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="form.invalid || isSaving()">
        @if (isSaving()) { <mat-spinner diameter="20"></mat-spinner> } @else { {{ isEdit ? 'Update' : 'Create' }} }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 4px; min-width: 400px; padding-top: 8px; }
    mat-dialog-actions button { border-radius: 10px; min-width: 100px; }
  `]
})
export class EnrollmentDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<EnrollmentDialogComponent>);
  data: Enrollment | null = inject(MAT_DIALOG_DATA);
  private service = inject(EnrollmentService);
  private studentService = inject(StudentService);
  private courseService = inject(CourseService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  isSaving = signal(false);
  students = signal<Student[]>([]);
  courses = signal<Course[]>([]);
  statuses: Status[] = ['ACTIVE', 'COMPLETED', 'DROPPED', 'FAILED', 'WITHDRAWN'];

  ngOnInit(): void {
    this.isEdit = !!this.data?.idEnrollment;
    this.studentService.getAll().subscribe(s => this.students.set(s));
    this.courseService.getAll().subscribe(c => this.courses.set(c));
    this.form = this.fb.group({
      student:        [this.data?.student ?? null, Validators.required],
      course:         [this.data?.course ?? null, Validators.required],
      enrollmentDate: [this.data?.enrollmentDate ? new Date(this.data.enrollmentDate + 'T00:00:00') : null],
      grade:          [this.data?.grade ?? 0],
      status:         [this.data?.status ?? 'ACTIVE'],
    });
  }

  compareStudents(a: Student | null, b: Student | null): boolean {
    return a?.idStudent != null && b?.idStudent != null ? a.idStudent === b.idStudent : a === b;
  }

  compareCourses(a: Course | null, b: Course | null): boolean {
    return a?.idCourse != null && b?.idCourse != null ? a.idCourse === b.idCourse : a === b;
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const eDate = v.enrollmentDate instanceof Date ? v.enrollmentDate.toISOString().split('T')[0] : v.enrollmentDate;
    const enrollment: Enrollment = {
      ...(this.isEdit && this.data ? { idEnrollment: this.data.idEnrollment } : {}),
      enrollmentDate: eDate,
      grade: v.grade,
      status: v.status,
      student: v.student ? { idStudent: v.student.idStudent } as Student : null,
      course: v.course ? { idCourse: v.course.idCourse } as Course : null,
    };
    const op = this.isEdit ? this.service.update(enrollment) : this.service.create(enrollment);
    op.subscribe({
      next: () => { this.snackBar.open(`Enrollment ${this.isEdit ? 'updated' : 'created'}`, 'Close', { duration: 3000 }); this.dialogRef.close(true); },
      error: () => { this.snackBar.open('Operation failed', 'Close', { duration: 3000 }); this.isSaving.set(false); },
    });
  }

  onCancel(): void { this.dialogRef.close(false); }
}
