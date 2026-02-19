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
import { Course } from '../../models/course.model';
import { CourseService } from '../../services/course.service';
import { CourseDialogComponent } from './course-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-course-list',
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent implements OnInit, AfterViewInit {
  private service = inject(CourseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['idCourse', 'name', 'code', 'credit', 'description', 'actions'];
  dataSource = new MatTableDataSource<Course>();
  isLoading = signal(true);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void { this.loadData(); }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData(): void {
    this.isLoading.set(true);
    this.service.getAll().subscribe({
      next: (data) => { this.dataSource.data = data; this.isLoading.set(false); },
      error: () => { this.snackBar.open('Failed to load courses', 'Close', { duration: 3000 }); this.isLoading.set(false); },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDialog(item?: Course): void {
    const ref = this.dialog.open(CourseDialogComponent, {
      width: '550px', data: item ?? null,
      ariaLabel: item ? 'Edit course' : 'Add new course',
    });
    ref.afterClosed().subscribe(r => { if (r) this.loadData(); });
  }

  deleteItem(item: Course): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px', data: { title: 'Delete Course', message: `Delete "${item.name}" (${item.code})?` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && item.idCourse != null) {
        this.service.delete(item.idCourse).subscribe({
          next: () => { this.snackBar.open('Course deleted', 'Close', { duration: 3000 }); this.loadData(); },
          error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
