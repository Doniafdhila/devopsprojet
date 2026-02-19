import { Student } from './student.model';
import { Course } from './course.model';

export type Status = 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'FAILED' | 'WITHDRAWN';

export interface Enrollment {
  idEnrollment?: number;
  enrollmentDate: string;
  grade: number;
  status: Status;
  student?: Student | null;
  course?: Course | null;
}
