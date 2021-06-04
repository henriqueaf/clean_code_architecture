export interface IEnrollmentRequest {
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
