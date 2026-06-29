import { BaseModel } from './base.model';
import { Faculty } from './faculty.model';
import { Course } from './course.model';

export type EducationForm = 'задочно' | 'редовно';
export type CurriculumType = 'бакалавър' | 'магистър' | 'доктор';

export class Curriculum extends BaseModel {
    static get tableName() {
        return 'curriculums';
    }

    name!: string;
    startYear!: Date;
    educationForm!: EducationForm;
    semesterCount!: number;
    type!: CurriculumType;
    link?: string;
    facultyId!: number;
    courses?: Course[];

    static get relationMappings() {
        return {
            faculty: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Faculty,
                join: {
                    from: 'curriculums.facultyId',
                    to: 'faculties.id',
                },
            },
            courses: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: Course,
                join: {
                    from: 'curriculums.id',
                    through: {
                        from: 'curriculums_courses.curriculum_id',
                        to: 'curriculums_courses.course_id',
                        extra: ['credits'],
                    },
                    to: 'courses.id',
                },
            },
        };
    }
}
