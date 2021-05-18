import Repository from '../../../repositories/Repository';
import EnrollStudent from '../EnrollStudent';
import { ValidationError } from '../Errors';
import { StudentsRepositoryMock } from './StudentsRepositoryMock';

describe('EnrollStudent', () => {
  const factoryEnrollStudent = (studentRepository: Repository = new StudentsRepositoryMock()): EnrollStudent => {
    return new EnrollStudent(studentRepository);
  }

  test("Should not enroll without valid student name", () => {
    const enrollmentRequest = {
      student: {
        name: "Ana",
        cpf: ""
      }
    }

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrow(new ValidationError("Invalid student name"));
  });

  test("Should not enroll without valid student cpf", () => {
    const enrollmentRequest = {
      student: {
        name: "Ana Silva",
        cpf: "123.456.789-99"
      }
    }

    expect(() => {
      factoryEnrollStudent().execute(enrollmentRequest);
    }).toThrow(new ValidationError("Invalid student cpf"));
  });

  test("Should not enroll duplicated student", () => {
    const student = {
      name: "Ana Silva",
      cpf: "832.081.519-34"
    }

    const studentRepository = new StudentsRepositoryMock();
    studentRepository.push(student);

    const enrollmentRequest = {
      student: student
    }

    expect(() => {
      factoryEnrollStudent(studentRepository).execute(enrollmentRequest);
    }).toThrow(new ValidationError("Enrollment with duplicated student is not allowed"));
  })
})
