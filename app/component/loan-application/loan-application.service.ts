import db from '../../models';

const LoanApplicationService = {
  create(data: {
    customer_id: number;
    amount: number;
    term_months: number;
    annual_interest_rate: number;
    monthly_payment: number;
  }) {
    return db.LoanApplication.create(data);
  },
};
export default LoanApplicationService;
