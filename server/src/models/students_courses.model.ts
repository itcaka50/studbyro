import { BaseModel } from './base.model';
import { Student } from './student.model';
import { Course } from './course.model';

export class StudentCourse extends BaseModel {
    static get tableName() {
        return 'students_courses';
    }

    grade?: number;
    studentId!: string;
    courseId!: number;

    static get relationMappings() {
        return {
            student: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Student,
                join: {
                    from: 'students_courses.studentId',
                    to: 'students.facultyNumber',
                },
            },
            course: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Course,
                join: {
                    from: 'students_courses.courseId',
                    to: 'courses.id',
                },
            },
        };
    }
}
