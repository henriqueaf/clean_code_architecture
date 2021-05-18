import EnrollStudent from './EnrollStudent';
import { StudentsRepository } from '../../repositories/StudentsRepository';

const studentsRepository: StudentsRepository = new StudentsRepository();
const enrollStudent: EnrollStudent = new EnrollStudent(studentsRepository);

export { enrollStudent };
