import EnrollStudent from '../EnrollStudent';
import { ValidationError } from '../Errors';
import { StudentsRepositoryMock } from './StudentsRepositoryMock';

describe('EnrollStudent', () => {
  const studentRepository = new StudentsRepositoryMock();
  const enrollStudent = new EnrollStudent(studentRepository);

  test("Should not enroll without valid student name", () => {
    const enrollmentRequest = {
      student: {
        name: "Ana",
        cpf: ""
      }
    }

    expect(() => {
      enrollStudent.execute(enrollmentRequest);
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
      enrollStudent.execute(enrollmentRequest);
    }).toThrow(new ValidationError("Invalid student cpf"));
  });

  test("Should not enroll duplicated student", () => {
    const student = {
      name: "Ana Silva",
      cpf: "832.081.519-34"
    }

    studentRepository.push(student);

    const enrollmentRequest = {
      student: student
    }

    expect(() => {
      enrollStudent.execute(enrollmentRequest);
    }).toThrow(new ValidationError("Enrollment with duplicated student is not allowed"));
  })
})
