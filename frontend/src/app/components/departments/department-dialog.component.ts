import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-department-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Department' : 'Add Department' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="dialog-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Location</mat-label>
          <input matInput formControlName="location">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Phone</mat-label>
          <input matInput formControlName="phone">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Head of Department</mat-label>
          <input matInput formControlName="head">
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
export class DepartmentDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<DepartmentDialogComponent>);
  data: Department | null = inject(MAT_DIALOG_DATA);
  private service = inject(DepartmentService);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  isEdit = false;
  isSaving = signal(false);

  ngOnInit(): void {
    this.isEdit = !!this.data?.idDepartment;
    this.form = this.fb.group({
      name:     [this.data?.name ?? '', Validators.required],
      location: [this.data?.location ?? ''],
      phone:    [this.data?.phone ?? ''],
      head:     [this.data?.head ?? ''],
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    this.isSaving.set(true);
    const dept: Department = {
      ...(this.isEdit && this.data ? { idDepartment: this.data.idDepartment } : {}),
      ...this.form.value,
    };
    const op = this.isEdit ? this.service.update(dept) : this.service.create(dept);
    op.subscribe({
      next: () => { this.snackBar.open(`Department ${this.isEdit ? 'updated' : 'created'}`, 'Close', { duration: 3000 }); this.dialogRef.close(true); },
      error: () => { this.snackBar.open('Operation failed', 'Close', { duration: 3000 }); this.isSaving.set(false); },
    });
  }

  onCancel(): void { this.dialogRef.close(false); }
}
