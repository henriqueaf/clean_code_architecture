export interface IGetEnrollmentRequest {
  code: string
}

export interface IGetEnrollmentResponse {
  code: string,
  invoicesBalance: number
}
