import { BaseModel } from './base.model';
import { Curriculum } from './curriculum.model';
import { Course } from './course.model';

export class CurriculumCourse extends BaseModel {
    static get tableName() {
        return 'curriculums_courses';
    }

    curriculumId!: number;
    courseId!: number;
    credits!: number;

    static get relationMappings() {
        return {
            curriculum: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Curriculum,
                join: {
                    from: 'curriculums_courses.curriculumId',
                    to: 'curriculums.id',
                },
            },
            course: {
                relation: BaseModel.BelongsToOneRelation,
                modelClass: Course,
                join: {
                    from: 'curriculums_courses.courseId',
                    to: 'courses.id',
                },
            },
        };
    }
}
