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
import { Department } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';
import { DepartmentDialogComponent } from './department-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-department-list',
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatTooltipModule, MatProgressSpinnerModule,
  ],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.css',
})
export class DepartmentListComponent implements OnInit, AfterViewInit {
  private service = inject(DepartmentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['idDepartment', 'name', 'location', 'phone', 'head', 'actions'];
  dataSource = new MatTableDataSource<Department>();
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
      error: () => { this.snackBar.open('Failed to load departments', 'Close', { duration: 3000 }); this.isLoading.set(false); },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openDialog(item?: Department): void {
    const ref = this.dialog.open(DepartmentDialogComponent, {
      width: '550px', data: item ?? null,
      ariaLabel: item ? 'Edit department' : 'Add new department',
    });
    ref.afterClosed().subscribe(r => { if (r) this.loadData(); });
  }

  deleteItem(item: Department): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px', data: { title: 'Delete Department', message: `Delete "${item.name}"?` },
    });
    ref.afterClosed().subscribe(confirmed => {
      if (confirmed && item.idDepartment != null) {
        this.service.delete(item.idDepartment).subscribe({
          next: () => { this.snackBar.open('Department deleted', 'Close', { duration: 3000 }); this.loadData(); },
          error: () => this.snackBar.open('Delete failed', 'Close', { duration: 3000 }),
        });
      }
    });
  }
}
