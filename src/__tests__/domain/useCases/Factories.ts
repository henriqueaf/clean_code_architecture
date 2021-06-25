import CancelEnrollment from '@app/domain/useCases/cancelEnrollment/CancelEnrollment';
import EnrollStudent from '@app/domain/useCases/enrollStudent/EnrollStudent';
import GetEnrollment from '@app/domain/useCases/getEnrollment/GetEnrollment';
import PayInvoice from '@app/domain/useCases/payInvoice/PayInvoice';
import Class from '@app/domain/entities/Class';
import Enrollment from '@app/domain/entities/Enrollment';
import Level from '@app/domain/entities/Level';
import Module from '@app/domain/entities/Module';
import Student from '@app/domain/entities/Student';
import { ClassesRepository, EnrollmentsRepository, ModulesRepository, StudentsRepository } from '@app/adapters/repositories/memory';
import { LevelsRepository } from '@app/adapters/repositories/database';
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

export const factoryEnrollStudent = async ({
  studentsRepository,
  levelsRepository,
  modulesRepository,
  classesRepository,
  enrollmentsRepository
}: {
  studentsRepository?: StudentsRepository,
  levelsRepository?: LevelsRepository,
  modulesRepository?: ModulesRepository,
  classesRepository?: ClassesRepository,
  enrollmentsRepository?: EnrollmentsRepository
} = {}): Promise<EnrollStudent> => {
  studentsRepository = studentsRepository || new StudentsRepository();
  levelsRepository = levelsRepository || new LevelsRepository(),
  modulesRepository = modulesRepository || new ModulesRepository();
  classesRepository = classesRepository || new ClassesRepository();
  enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

  await levelsRepository.save({
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

export const validStudentAttributes = {
  name: 'Ana Maria',
  cpf: '755.525.774-26',
  birthDate: '2002-03-12'
};

export const factoryStudent = (params = validStudentAttributes): Student => {
  return new Student(params.name, params.cpf, params.birthDate);
};

export const validLevelAttributes = {
  code: 'EF1',
  description: 'Ensino Fundamental I'
};

export const factoryLevel = (params = validLevelAttributes): Level => {
  return new Level(params.code, params.description);
};

export const validModuleAttributes = {
  level: validLevelAttributes.code,
  code: '1',
  description: '1o Ano',
  minimumAge: 6,
  price: 15000
};

export const factoryModule = (params = validModuleAttributes): Module => {
  return new Module(params.level, params.code, params.description, params.minimumAge, params.price);
};

export const validClassAttributes = {
  level: validModuleAttributes.level,
  module: validModuleAttributes.code,
  code: 'A',
  capacity: 5,
  startDate: '2021-06-01',
  endDate: '2021-12-15'
};

export const factoryClass = (params = validClassAttributes): Class => {
  return new Class(params);
};

export const validEnrollmentAttributes = {
  student: factoryStudent(),
  level: factoryLevel(),
  module: factoryModule(),
  klass: factoryClass(),
  issueDate: new Date(validClassAttributes.startDate),
  sequence: 1,
  installments: validEnrollmentRequest.installments
};

export const factoryEnrollment = (params = validEnrollmentAttributes): Enrollment => {
  return new Enrollment(params);
};

export const factoryPayInvoice = ({
  enrollmentsRepository
}: {
  enrollmentsRepository?: EnrollmentsRepository
} = {}): PayInvoice => {
  enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

  return new PayInvoice({ enrollmentsRepository });
};

export const factoryCancelEnrollment = ({
  enrollmentsRepository
}: {
  enrollmentsRepository?: EnrollmentsRepository
} = {}): CancelEnrollment => {
  enrollmentsRepository = enrollmentsRepository || new EnrollmentsRepository();

  return new CancelEnrollment({ enrollmentsRepository });
};
