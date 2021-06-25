import InvoiceStatus from '@app/domain/valueObjects/InvoiceStatus';

export interface GetEnrollmentInputData {
  code: string,
  currentDate: Date
}

export interface GetEnrollmentOutputData {
  code: string,
  invoicesBalance: number,
  status: string,
  invoices: {
    amount: number,
    status: InvoiceStatus,
    dueDate: Date
    penalty: number,
    interest: number,
    balance: number
  }[]
}
