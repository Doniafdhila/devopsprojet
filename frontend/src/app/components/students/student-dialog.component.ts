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
import { Student } from '../../models/student.model';
import { Department } from '../../models/department.model';
import { StudentService } from '../../services/student.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-student-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Student' : 'Add Student' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>First Name</mat-label>
          <input matInput formControlName="firstName" autocomplete="given-name">
          @if (form.get('firstName')?.hasError('required') && form.get('firstName')?.touched) {
            <mat-error>First name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Last Name</mat-label>
          <input matInput formControlName="lastName" autocomplete="family-name">
          @if (form.get('lastName')?.hasError('required') && form.get('lastName')?.touched) {
            <mat-error>Last name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" autocomplete="email">
          @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
            <mat-error>Email is required</mat-error>
          }
          @if (form.get('email')?.hasError('email') && form.get('email')?.touched) {
            <mat-error>Invalid email format</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone" autocomplete="tel">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Date of Birth</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateOfBirth">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" autocomplete="street-address">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="department" [compareWith]="compareDepts">
            @for (dept of departments(); track dept.idDepartment) {
              <mat-option [value]="dept">{{ dept.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="form.invalid || isSaving()">
        @if (isSaving()) { <mat-spinner diameter="20"></mat-spinner> }
        @else { {{ isEdit ? 'Update' : 'Create' }} }
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-form { display: flex; flex-direction: column; gap: 4px; min-width: 400px; padding-top: 8px; }
    mat-dialog-actions button { border-radius: 10px; min-width: 100px; }
  `]
})
export class StudentDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<StudentDialogComponent>);
  data: Student | null = inject(MAT_DIALOG_DATA);
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  isSaving = signal(false);
  departments = signal<Department[]>([]);

  ngOnInit(): void {
    this.isEdit = !!this.data?.idStudent;
    this.departmentService.getAll().subscribe(d => this.departments.set(d));
    this.form = this.fb.group({
      firstName:   [this.data?.firstName ?? '', Validators.required],
      lastName:    [this.data?.lastName ?? '', Validators.required],
      email:       [this.data?.email ?? '', [Validators.required, Validators.email]],
      phone:       [this.data?.phone ?? ''],
      dateOfBirth: [this.data?.dateOfBirth ? new Date(this.data.dateOfBirth + 'T00:00:00') : null],
      address:     [this.data?.address ?? ''],
      department:  [this.data?.department ?? null],
    });
  }

  compareDepts(a: Department | null, b: Department | null): boolean {
    return a?.idDepartment != null && b?.idDepartment != null ? a.idDepartment === b.idDepartment : a === b;
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const v = this.form.value;
    const dob = v.dateOfBirth instanceof Date ? v.dateOfBirth.toISOString().split('T')[0] : v.dateOfBirth;
    const student: Student = {
      ...(this.isEdit && this.data ? { idStudent: this.data.idStudent } : {}),
      firstName: v.firstName, lastName: v.lastName, email: v.email,
      phone: v.phone, dateOfBirth: dob, address: v.address,
      department: v.department ? { idDepartment: v.department.idDepartment } as Department : null,
    };
    const op = this.isEdit ? this.studentService.update(student) : this.studentService.create(student);
    op.subscribe({
      next: () => { this.snackBar.open(`Student ${this.isEdit ? 'updated' : 'created'}`, 'Close', { duration: 3000 }); this.dialogRef.close(true); },
      error: () => { this.snackBar.open('Operation failed', 'Close', { duration: 3000 }); this.isSaving.set(false); },
    });
  }

  onCancel(): void { this.dialogRef.close(false); }
}
