import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-course-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Course' : 'Add Course' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Course Name</mat-label>
          <input matInput formControlName="name">
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Course Code</mat-label>
          <input matInput formControlName="code" placeholder="e.g. CS101">
          @if (form.get('code')?.hasError('required') && form.get('code')?.touched) {
            <mat-error>Code is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Credits</mat-label>
          <input matInput formControlName="credit" type="number" min="0">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
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
    .dialog-form { display: flex; flex-direction: column; gap: 4px; min-width: 380px; padding-top: 8px; }
    mat-dialog-actions button { border-radius: 10px; min-width: 100px; }
  `]
})
export class CourseDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<CourseDialogComponent>);
  data: Course | null = inject(MAT_DIALOG_DATA);
  private service = inject(CourseService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  isSaving = signal(false);

  ngOnInit(): void {
    this.isEdit = !!this.data?.idCourse;
    this.form = this.fb.group({
      name:        [this.data?.name ?? '', Validators.required],
      code:        [this.data?.code ?? '', Validators.required],
      credit:      [this.data?.credit ?? 0],
      description: [this.data?.description ?? ''],
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const course: Course = {
      ...(this.isEdit && this.data ? { idCourse: this.data.idCourse } : {}),
      ...this.form.value,
    };
    const op = this.isEdit ? this.service.update(course) : this.service.create(course);
    op.subscribe({
      next: () => { this.snackBar.open(`Course ${this.isEdit ? 'updated' : 'created'}`, 'Close', { duration: 3000 }); this.dialogRef.close(true); },
      error: () => { this.snackBar.open('Operation failed', 'Close', { duration: 3000 }); this.isSaving.set(false); },
    });
  }

  onCancel(): void { this.dialogRef.close(false); }
}
