import EnrollStudent from '@app/application/useCases/enrollStudent/EnrollStudent';
import GetEnrollment from '@app/application/useCases/getEnrollment/GetEnrollment';
import Class from '@app/domain/entities/Class';
import { ILevelsRepository } from '@app/domain/repositoriesInterfaces';
import { ClassesRepository, EnrollmentsRepository, LevelsRepository, ModulesRepository, StudentsRepository } from '@app/infrastructure/repositories/inMemory';
import { addDays } from '@app/utils/DateUtils';

export const validEnrollmentRequest = {
  student: {
    name: 'Ana Maria',
    cpf: '755.525.774-26',
    birthDate: '2002-03-12'
  },
  level: 'EM',
  module: '1',
  class: 'A',
  installments: 12
};

export const factoryEnrollStudent = ({
  studentsRepository,
  levelsRepository,
  modulesRepository,
  classesRepository,
  enrollmentsRepository
}: {
  studentsRepository?: StudentsRepository,
  levelsRepository?: ILevelsRepository,
  modulesRepository?: ModulesRepository,
  classesRepository?: ClassesRepository,
  enrollmentsRepository?: EnrollmentsRepository
} = {}): EnrollStudent => {
  studentsRepository = studentsRepository || new StudentsRepository();
  levelsRepository = levelsRepository || new LevelsRepository(),
  modulesRepository = modulesRepository || new ModulesRepository();
  classesRepository = classesRepository || new ClassesRepository();
  enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

  levelsRepository.save({
    code: validEnrollmentRequest.level,
    description: 'Ensino Médio'
  });

  modulesRepository.save({
    level: validEnrollmentRequest.level,
    code: validEnrollmentRequest.module,
    description: '1º Ano',
    minimumAge: 15,
    price: 17000
  });

  classesRepository.save(new Class({
    level: validEnrollmentRequest.level,
    module: validEnrollmentRequest.module,
    code: validEnrollmentRequest.class,
    capacity: 1,
    startDate: new Date().toISOString(),
    endDate: addDays(new Date(), 10).toISOString()
  }));

  return new EnrollStudent(
    studentsRepository,
    levelsRepository,
    modulesRepository,
    classesRepository,
    enrollmentsRepository
  );
};

export const factoryGetEnrollment = ({
  enrollmentsRepository
}: {
  enrollmentsRepository?: EnrollmentsRepository
} = {}): GetEnrollment => {
  enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

  return new GetEnrollment({ enrollmentsRepository });
};
