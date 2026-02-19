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
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { StudentDialogComponent } from './student-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-student-list',
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css',
})
export class StudentListComponent implements OnInit, AfterViewInit {
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['idStudent', 'firstName', 'lastName', 'email', 'phone', 'department', 'actions'];
  dataSource = new MatTableDataSource<Student>();
  isLoading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: Student, property: string) => {
      if (property === 'department') return item.department?.name ?? '';
      return (item as never)[property];
    };
    this.dataSource.filterPredicate = (student: Student, filter: string) => {
      const search = `${student.firstName} ${student.lastName} ${student.email} ${student.department?.name ?? ''}`.toLowerCase();
      return search.includes(filter);
    };
  }

  loadData(): void {
    this.isLoading.set(true);
    this.studentService.getAll().subscribe({
      next: (data) => { this.dataSource.data = data; this.isLoading.set(false); },
      error: () => { this.snackBar.open('Failed to load students', 'Close', { duration: 3000 }); this.isLoading.set(false); }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openDialog(student?: Student): void {
    const ref = this.dialog.open(StudentDialogComponent, {
      width: '600px',
      data: student ?? null,
      ariaLabel: student ? 'Edit student' : 'Add new student',
    });
    ref.afterClosed().subscribe(result => { if (result) this.loadData(); });
  }

  deleteItem(student: Student): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Delete Student', message: `Delete ${student.firstName} ${student.lastName}?` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && student.idStudent != null) {
        this.studentService.delete(student.idStudent).subscribe({
          next: () => { this.snackBar.open('Student deleted', 'Close', { duration: 3000 }); this.loadData(); },
          error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
