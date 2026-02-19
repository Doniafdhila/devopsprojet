import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="confirm-icon-wrapper">
        <mat-icon>warning_amber</mat-icon>
      </div>
      <h2 mat-dialog-title>{{ data.title }}</h2>
      <mat-dialog-content>
        <p>{{ data.message }}</p>
        <p class="confirm-warning">This action cannot be undone.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close(false)">Cancel</button>
        <button mat-raised-button color="warn" (click)="dialogRef.close(true)">Delete</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog { text-align: center; }
    .confirm-icon-wrapper {
      display: flex; justify-content: center; margin: 8px 0 4px;
    }
    .confirm-icon-wrapper mat-icon {
      font-size: 48px; width: 48px; height: 48px; color: #ef5350;
    }
    h2 { text-align: center; }
    .confirm-warning { font-size: 0.85rem; color: #90a4ae; margin-top: 8px; }
    mat-dialog-actions { justify-content: center; padding-bottom: 16px; }
    mat-dialog-actions button { border-radius: 10px; min-width: 100px; }
  `]
})
export class ConfirmDialogComponent {
  dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
}
