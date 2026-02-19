import { Component, inject, signal, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Enrollment } from '../../models/enrollment.model';
import { EnrollmentService } from '../../services/enrollment.service';
import { EnrollmentDialogComponent } from './enrollment-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-enrollment-list',
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
    MatChipsModule, DatePipe,
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrl: './enrollment-list.component.css',
})
export class EnrollmentListComponent implements OnInit, AfterViewInit {
  private service = inject(EnrollmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['idEnrollment', 'student', 'course', 'enrollmentDate', 'grade', 'status', 'actions'];
  dataSource = new MatTableDataSource<Enrollment>();
  isLoading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void { this.loadData(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: Enrollment, property: string) => {
      if (property === 'student') return `${item.student?.firstName ?? ''} ${item.student?.lastName ?? ''}`;
      if (property === 'course') return item.course?.name ?? '';
      return (item as never)[property];
    };
    this.dataSource.filterPredicate = (enrollment: Enrollment, filter: string) => {
      const search = `${enrollment.student?.firstName ?? ''} ${enrollment.student?.lastName ?? ''} ${enrollment.course?.name ?? ''} ${enrollment.status}`.toLowerCase();
      return search.includes(filter);
    };
  }

  loadData(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { this.dataSource.data = data; this.isLoading.set(false); },
      error: () => { this.snackBar.open('Failed to load enrollments', 'Close', { duration: 3000 }); this.isLoading.set(false); },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDialog(item?: Enrollment): void {
    const ref = this.dialog.open(EnrollmentDialogComponent, {
      width: '600px', data: item ?? null,
      ariaLabel: item ? 'Edit enrollment' : 'Add new enrollment',
    });
    ref.afterClosed().subscribe(r => { if (r) this.loadData(); });
  }

  deleteItem(item: Enrollment): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px', data: { title: 'Delete Enrollment', message: `Delete enrollment #${item.idEnrollment}?` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && item.idEnrollment != null) {
        this.service.delete(item.idEnrollment).subscribe({
          next: () => { this.snackBar.open('Enrollment deleted', 'Close', { duration: 3000 }); this.loadData(); },
          error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      ACTIVE: 'status-active', COMPLETED: 'status-completed',
      DROPPED: 'status-dropped', FAILED: 'status-failed', WITHDRAWN: 'status-withdrawn',
    };
    return map[status] ?? '';
  }
}
