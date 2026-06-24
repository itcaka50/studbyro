import { BaseModel } from './base.model';

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
}
