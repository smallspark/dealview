import type { Loan, LoanWithId } from 'types/liabilities/loan'

export const validLoan1: Loan = {
  name: '5SS Reno Loan',
  currentBalance: 500000,
  repaymentType: 'principalAndInterest',
  interestRate: 400,
  compoundingPeriod: 'daily',
  endDate: '2039-09-10',
}
export const validLoanWithId1: LoanWithId = { ...validLoan1, id: '345' }

export const validLoan2: Loan = {
  name: 'Briggs Primary',
  startDate: '2019-05-10',
  principal: 150000,
  establishmentFees: 1500,
  repaymentType: 'interestOnly',
  interestRate: 400,
  compoundingPeriod: 'monthly',
  endDate: '2029-05-10',
}
export const validLoanWithId2: LoanWithId = { ...validLoan2, id: '832' }
