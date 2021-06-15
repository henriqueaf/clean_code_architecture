export interface EnrollStudentInput {
  student: {
    name: string;
    cpf: string;
    birthDate: string;
  },
  level: string,
  module: string,
  class: string,
  installments: number
}
